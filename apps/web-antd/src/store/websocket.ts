import { computed, ref } from 'vue';

import { useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

import { $t } from '#/locales';

import { useAuthStore } from './auth';

export interface OnlineUser {
  userId: number;
  deviceId: string;
  socketId: string;
  onlineAt: Date;
  lastActiveAt: Date;
  status: string;
}

export interface ServerStats {
  connectedSockets: number;
  onlineUsers: number;
  timestamp: Date;
}

export const useWebSocketStore = defineStore('websocket', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const authStore = useAuthStore();

  // WebSocket 连接状态
  const isConnected = ref(false);
  const isConnecting = ref(false);
  const connectionError = ref<null | string>(null);

  // 在线用户数据
  const onlineUsers = ref<OnlineUser[]>([]);
  const onlineUserCount = ref(0);
  const serverStats = ref<null | ServerStats>(null);

  // 会话变更通知
  const sessionChangeCount = ref(0);
  const lastSessionChange = ref<Date | null>(null);

  // 会话状态数据（新增）
  const sessionStates = ref<any[]>([]);
  const currentSessionState = ref<any | null>(null);

  const socket = ref<null | Socket>(null);

  const heartbeatInterval = ref<NodeJS.Timeout | null>(null);
  const HEARTBEAT_INTERVAL = 60_000; // 60秒心跳间隔（后端超时3分钟）

  // 重连配置（新增）
  const reconnectAttempts = ref(0);
  const MAX_RECONNECT_ATTEMPTS = 10;
  const BASE_RECONNECT_DELAY = 1000; // 基础延迟 1秒
  const MAX_RECONNECT_DELAY = 30_000; // 最大延迟 30秒

  const wsUrl = computed(() => {
    let baseUrl = import.meta.env.VITE_WEBSOCKET_URL;

    // 移除协议前缀
    baseUrl = baseUrl.replace(/^https?:\/\//, '');

    baseUrl = baseUrl.split('/')[0];

    const protocol = location.protocol === 'https:' ? 'https:' : 'http:';
    return `${protocol}//${baseUrl}`;
  });

  // 处理接收到的消息
  function handleMessage(type: string, payload: any) {
    switch (type) {
      case 'connected': {
        break;
      }

      case 'error': {
        handleErrorMessage(payload);
        break;
      }

      case 'force_logout': {
        handleForceLogout(payload);
        break;
      }

      case 'heartbeat_response': {
        break;
      }

      case 'online_users_response': {
        handleOnlineUsersResponse(payload);
        break;
      }

      case 'session.force-logout-response': {
        handleForceLogoutResponse(payload);
        break;
      }

      case 'session.heartbeat-timeout': {
        handleHeartbeatTimeout(payload);
        break;
      }

      case 'session.state-changed': {
        handleSessionStateChanged(payload);
        break;
      }

      case 'session.status-response': {
        handleSessionStatusResponse(payload);
        break;
      }

      case 'session.strategy-updated': {
        handleStrategyUpdated(payload);
        break;
      }

      case 'session_change': {
        handleSessionChange(payload);
        break;
      }

      case 'system_broadcast': {
        handleSystemBroadcast(payload);
        break;
      }

      case 'system_message': {
        handleSystemMessage(payload);
        break;
      }

      case 'user_status_change': {
        handleUserStatusChange(payload);
        break;
      }

      default: {
        console.warn($t('system.websocket.unhandledMessage'), type, payload);
      }
    }
  }

  // 处理用户状态变化
  function handleUserStatusChange(payload: any) {
    const { userId, status, timestamp } = payload;
    console.warn(
      $t('system.websocket.userStatusChange', { userId, status }),
      timestamp,
    );

    // 如果是当前用户，更新连接状态
    if (userId === userStore.userInfo?.userId) {
      isConnected.value = status === 'online';
    }
  }

  function handleOnlineUsersResponse(payload: any) {
    const { users, count, timestamp } = payload;
    onlineUsers.value = users || [];
    onlineUserCount.value = count || 0;
    console.warn($t('system.websocket.onlineUsersUpdate'), {
      count,
      timestamp,
    });
  }

  // 处理会话变更通知
  function handleSessionChange(payload: any) {
    sessionChangeCount.value++;
    lastSessionChange.value = new Date();
    console.warn($t('system.websocket.sessionChange'), payload);
  }

  // 处理会话状态变化（新增）
  function handleSessionStateChanged(payload: any) {
    const { type, sessionId, deviceId, timestamp } = payload;

    currentSessionState.value = payload;
    sessionChangeCount.value++;
    lastSessionChange.value = new Date(timestamp);

    // 根据不同的会话状态类型显示通知
    switch (type) {
      case 'session.created': {
        notification.info({
          message: $t('websocket.session.created'),
          description: $t('websocket.notification.newMessage'),
        });
        break;
      }

      case 'session.expired': {
        notification.warning({
          message: $t('websocket.session.expired'),
          description: $t('websocket.session.expired'),
        });
        break;
      }

      case 'session.kicked': {
        notification.warning({
          message: $t('websocket.session.kicked'),
          description: payload.reason || $t('websocket.session.forceLogout'),
          duration: 0,
        });
        break;
      }

      case 'session.offline': {
        console.log($t('websocket.session.offline'), {
          sessionId,
          deviceId,
          reason: payload.reason,
        });
        break;
      }

      case 'session.online': {
        console.log($t('websocket.session.online'), { sessionId, deviceId });
        break;
      }

      default: {
        console.warn($t('websocket.error.unknown'), type);
      }
    }

    // 更新会话状态列表
    const existingIndex = sessionStates.value.findIndex(
      (s) => s.sessionId === sessionId,
    );
    if (existingIndex === -1) {
      sessionStates.value.push(payload);
    } else {
      sessionStates.value[existingIndex] = payload;
    }
  }

  // 处理会话状态查询响应（新增）
  function handleSessionStatusResponse(payload: any) {
    const { userId, deviceId, isOnline, socketCount, allDevices, timestamp } =
      payload;

    // 更新会话状态列表
    if (allDevices && Array.isArray(allDevices)) {
      sessionStates.value = allDevices;
    }

    currentSessionState.value = {
      userId,
      deviceId,
      isOnline,
      socketCount,
      allDevices,
      timestamp: new Date(timestamp),
    };
  }

  // 处理强制登出响应（新增）
  function handleForceLogoutResponse(payload: any) {
    const { success, message, targetDeviceId, timestamp } = payload;

    if (success) {
      notification.success({
        message: $t('websocket.notification.title.success'),
        description: message || $t('websocket.session.forceLogout'),
      });
    } else {
      notification.error({
        message: $t('websocket.error.unknown'),
        description: message || $t('websocket.error.unknown'),
      });
    }
  }

  // 处理心跳超时（新增）
  function handleHeartbeatTimeout(payload: any) {
    const { message, timeout, timestamp } = payload;

    notification.error({
      message: $t('websocket.heartbeat.timeout'),
      description: message || $t('websocket.heartbeat.timeout'),
      duration: 5,
    });

    console.warn('[WebSocket] 心跳超时:', { timeout, timestamp });

    // 自动尝试重连
    setTimeout(() => {
      if (!isConnected.value) {
        connect();
      }
    }, 3000);
  }

  // 处理登录策略更新（新增）
  function handleStrategyUpdated(payload: any) {
    const { oldStrategy, newStrategy, updatedBy, timestamp } = payload;

    notification.info({
      message: $t('websocket.strategy.updated'),
      description: $t('websocket.strategy.changed'),
      duration: 10,
    });

    console.log('[WebSocket] 登录策略更新:', {
      oldStrategy,
      newStrategy,
      updatedBy,
      timestamp,
    });
  }

  function handleForceLogout(payload: any) {
    const { message, reason } = payload;

    notification.warning({
      message: message || $t('system.websocket.forceLogoutTitle'),
      description: reason || $t('system.websocket.forceLogoutDescription'),
      duration: 0,
    });

    socket?.value?.disconnect();
    socket.value = null;
    authStore.forceLogout();
  }

  // 处理系统消息
  function handleSystemMessage(payload: any) {
    notification.info({
      message: payload.message || $t('system.websocket.systemMessage'),
      description: payload.content,
    });
  }

  // 处理系统广播
  function handleSystemBroadcast(payload: any) {
    notification.info({
      message: payload.message || $t('system.websocket.systemBroadcast'),
      description: payload.content,
    });
  }

  // 处理错误消息
  function handleErrorMessage(payload: any) {
    const { message, error } = payload;
    notification.error({
      message: message || $t('system.websocket.error'),
      description: error,
    });
  }

  // 发送消息(通用方法)
  function sendMessage(type: string, data: any = {}) {
    if (!socket.value) {
      console.warn($t('websocket.error.connectionFailed'));
      return false;
    }

    if (!socket.value.connected) {
      console.warn($t('websocket.error.networkError'));
      return false;
    }

    socket.value.emit(type, data);
    return true;
  }

  function startHeartbeat() {
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value);
    }

    heartbeatInterval.value = setInterval(() => {
      if (isConnected.value) {
        sendMessage('heartbeat');
      }
    }, HEARTBEAT_INTERVAL);
  }

  function stopHeartbeat() {
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value);
      heartbeatInterval.value = null;
    }
  }

  function connect() {
    if (!accessStore.accessToken) {
      console.error($t('system.websocket.loginRequired'));
      return;
    }

    if (isConnected.value || isConnecting.value) {
      console.warn($t('system.websocket.alreadyConnected'));
      return;
    }

    // 先断开旧连接（如果存在）
    if (socket.value) {
      console.log('[WebSocket] 清理旧连接');
      socket.value.removeAllListeners();
      socket.value.disconnect();
      socket.value = null;
      stopHeartbeat();
    }

    isConnecting.value = true;
    connectionError.value = null;

    // 计算指数退避延迟
    const reconnectDelay = Math.min(
      BASE_RECONNECT_DELAY * 2 ** reconnectAttempts.value,
      MAX_RECONNECT_DELAY,
    );

    socket.value = io(`${wsUrl.value}/admin`, {
      query: {
        token: accessStore.accessToken,
      },
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: reconnectDelay,
      reconnectionDelayMax: MAX_RECONNECT_DELAY,
      forceNew: true, // 强制创建新连接
    });

    // 连接成功事件
    socket.value.on('connect', () => {
      isConnected.value = true;
      isConnecting.value = false;
      connectionError.value = null;
      reconnectAttempts.value = 0; // 重置重连计数
      startHeartbeat();

      // 连接成功后查询会话状态（延迟确保状态已更新）
      setTimeout(() => {
        if (socket.value?.connected) {
          socket.value.emit('session.query-status');
        }
      }, 1000);
    });

    // 重连尝试事件
    socket.value.on('reconnect_attempt', (attempt) => {
      reconnectAttempts.value = attempt;
    });

    // 重连失败事件
    socket.value.on('reconnect_failed', () => {
      isConnected.value = false;
      isConnecting.value = false;
      connectionError.value = $t('websocket.error.connectionFailed');

      notification.error({
        message: $t('websocket.error.connectionFailed'),
        description: $t('websocket.connection.failed'),
        duration: 0,
      });

      console.error($t('websocket.connection.failed'));
    });

    // 连接失败事件
    socket.value.on('connect_error', (error) => {
      isConnected.value = false;
      isConnecting.value = false;
      reconnectAttempts.value++;

      connectionError.value = $t('system.websocket.connectionFailed', {
        error: error.message,
      });

      console.error(
        $t('websocket.connection.error', { message: error.message }),
      );

      // 只在首次连接失败时显示通知，避免重连时频繁弹窗
      if (reconnectAttempts.value === 1) {
        notification.error({
          message: $t('websocket.error.connectionFailed'),
          description: $t('websocket.connection.error', {
            message: error.message,
          }),
        });
      }
    });

    socket.value.on('disconnect', (reason) => {
      isConnected.value = false;
      isConnecting.value = false;
      stopHeartbeat();

      // 如果是服务器主动断开或传输关闭，尝试重连
      if (reason === 'io server disconnect' || reason === 'transport close') {
        notification.warning({
          message: $t('websocket.notification.title.warning'),
          description: $t('websocket.connection.reconnecting', {
            attempt: reconnectAttempts.value + 1,
          }),
          duration: 3,
        });
      }
    });

    // 注册所有事件监听器
    const events = [
      'connected',
      'heartbeat_response',
      'user_status_change',
      'online_users_response',
      'force_logout',
      'system_message',
      'system_broadcast',
      'error',
      'session_change',
      // 新增的会话相关事件
      'session.state-changed',
      'session.status-response',
      'session.force-logout-response',
      'session.heartbeat-timeout',
      'session.strategy-updated',
    ];

    events.forEach((eventType) => {
      socket.value?.on(eventType, (payload) => {
        handleMessage(eventType, payload);
      });
    });
  }

  function disconnect() {
    stopHeartbeat();

    if (socket.value) {
      socket.value.removeAllListeners(); // 移除所有事件监听器
      socket.value.disconnect();
      socket.value = null;
    }

    isConnected.value = false;
    isConnecting.value = false;
  }

  function getOnlineUsers() {
    sendMessage('get_online_users');
  }

  // 查询会话状态（新增）
  function querySessionStatus() {
    return sendMessage('session.query-status');
  }

  // 强制登出指定设备（新增）
  function forceLogoutDevice(targetDeviceId?: string, reason?: string) {
    return sendMessage('session.force-logout', {
      targetDeviceId,
      reason:
        reason || $t('websocket.session.forceLogoutWithReason', { reason: '' }),
    });
  }

  function $reset() {
    disconnect();
    onlineUsers.value = [];
    onlineUserCount.value = 0;
    serverStats.value = null;
    connectionError.value = null;
    sessionChangeCount.value = 0;
    lastSessionChange.value = null;
    sessionStates.value = [];
    currentSessionState.value = null;
    reconnectAttempts.value = 0;
  }

  return {
    // 连接状态
    isConnected: computed(() => isConnected.value),
    isConnecting: computed(() => isConnecting.value),
    connectionError: computed(() => connectionError.value),
    reconnectAttempts: computed(() => reconnectAttempts.value),

    // 在线用户数据
    onlineUsers: computed(() => onlineUsers.value),
    onlineUserCount: computed(() => onlineUserCount.value),
    serverStats: computed(() => serverStats.value),

    // 会话相关数据
    sessionChangeCount: computed(() => sessionChangeCount.value),
    lastSessionChange: computed(() => lastSessionChange.value),
    sessionStates: computed(() => sessionStates.value),
    currentSessionState: computed(() => currentSessionState.value),

    // 连接管理
    connect,
    disconnect,

    // 消息发送
    sendMessage,
    getOnlineUsers,
    querySessionStatus,
    forceLogoutDevice,

    // 心跳管理
    startHeartbeat,
    stopHeartbeat,

    // 重置
    $reset,
  };
});
