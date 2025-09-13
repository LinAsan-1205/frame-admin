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

  const socket = ref<null | Socket>(null);

  const heartbeatInterval = ref<NodeJS.Timeout | null>(null);
  const HEARTBEAT_INTERVAL = 30_000; // 30秒心跳间隔

  const wsUrl = computed(() => {
    let baseUrl = import.meta.env.VITE_GLOB_API_URL;

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

  // 发送消息（通用方法）
  function sendMessage(type: string, data: any = {}) {
    if (!isConnected.value || !socket.value) {
      console.warn($t('system.websocket.notConnected'));
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

    isConnecting.value = true;
    connectionError.value = null;

    socket.value = io(`${wsUrl.value}/admin`, {
      query: {
        token: accessStore.accessToken,
      },
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    // 连接成功事件
    socket.value.on('connect', () => {
      isConnected.value = true;
      isConnecting.value = false;
      connectionError.value = null;
      startHeartbeat();
    });

    // 连接失败事件
    socket.value.on('connect_error', (error) => {
      isConnected.value = false;
      isConnecting.value = false;
      connectionError.value = $t('system.websocket.connectionFailed', {
        error: error.message,
      });

      notification.error({
        message: $t('system.websocket.connectionFailedTitle'),
        description: $t('system.websocket.connectionFailedDescription'),
      });
    });

    socket.value.on('disconnect', (_reason) => {
      isConnected.value = false;
      isConnecting.value = false;
      stopHeartbeat();
    });

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
      socket.value.disconnect();
      socket.value = null;
    }

    isConnected.value = false;
    isConnecting.value = false;
  }

  function getOnlineUsers() {
    sendMessage('get_online_users');
  }

  function $reset() {
    disconnect();
    onlineUsers.value = [];
    onlineUserCount.value = 0;
    serverStats.value = null;
    connectionError.value = null;
    sessionChangeCount.value = 0;
    lastSessionChange.value = null;
  }

  return {
    isConnected: computed(() => isConnected.value),
    isConnecting: computed(() => isConnecting.value),
    connectionError: computed(() => connectionError.value),
    onlineUsers: computed(() => onlineUsers.value),
    onlineUserCount: computed(() => onlineUserCount.value),
    serverStats: computed(() => serverStats.value),
    sessionChangeCount: computed(() => sessionChangeCount.value),
    lastSessionChange: computed(() => lastSessionChange.value),

    connect,
    disconnect,
    sendMessage,
    getOnlineUsers,
    $reset,

    startHeartbeat,
    stopHeartbeat,
  };
});
