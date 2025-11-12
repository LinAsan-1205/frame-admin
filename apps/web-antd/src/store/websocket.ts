import { computed, ref } from 'vue';

import { useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

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

const SSE_ENDPOINT_PATH = '/admin/sse/stream';

interface ParsedSseMessage {
  type: string;
  payload: any;
}

export const useWebSocketStore = defineStore('websocket', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const authStore = useAuthStore();

  const isConnected = ref(false);
  const isConnecting = ref(false);
  const connectionError = ref<null | string>(null);

  const onlineUsers = ref<OnlineUser[]>([]);
  const onlineUserCount = ref(0);
  const serverStats = ref<null | ServerStats>(null);

  const sessionChangeCount = ref(0);
  const lastSessionChange = ref<Date | null>(null);

  const sessionStates = ref<any[]>([]);
  const currentSessionState = ref<any | null>(null);

  const eventSource = ref<EventSource | null>(null);

  const reconnectAttempts = ref(0);
  const MAX_RECONNECT_ATTEMPTS = 10;

  let hasShownConnectionErrorNotification = false;
  let activeConnectionId = 0;

  const streamUrl = computed(() => createSseUrl(SSE_ENDPOINT_PATH));

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

  function handleUserStatusChange(payload: any) {
    const { userId, status, timestamp } = payload ?? {};
    console.warn(
      $t('system.websocket.userStatusChange', { userId, status }),
      timestamp,
    );

    if (userId === userStore.userInfo?.userId) {
      isConnected.value = status === 'online';
    }
  }

  function handleOnlineUsersResponse(payload: any) {
    const { users, count, timestamp } = payload ?? {};
    onlineUsers.value = users || [];
    onlineUserCount.value = count || 0;
    console.warn($t('system.websocket.onlineUsersUpdate'), {
      count,
      timestamp,
    });
  }

  function handleSessionChange(payload: any) {
    sessionChangeCount.value++;
    lastSessionChange.value = new Date();
    console.warn($t('system.websocket.sessionChange'), payload);
  }

  function handleSessionStateChanged(payload: any) {
    const { type, sessionId, deviceId, timestamp } = payload ?? {};

    currentSessionState.value = payload;
    sessionChangeCount.value++;
    lastSessionChange.value = timestamp ? new Date(timestamp) : new Date();

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
          description: payload?.reason || $t('websocket.session.forceLogout'),
          duration: 0,
        });
        break;
      }

      case 'session.offline': {
        console.warn($t('websocket.session.offline'), {
          sessionId,
          deviceId,
          reason: payload?.reason,
        });
        break;
      }

      case 'session.online': {
        console.warn($t('websocket.session.online'), { sessionId, deviceId });
        break;
      }

      default: {
        console.warn($t('websocket.error.unknown'), type);
      }
    }

    const existingIndex = sessionStates.value.findIndex(
      (s) => s.sessionId === sessionId,
    );
    if (existingIndex === -1) {
      sessionStates.value.push(payload);
    } else {
      sessionStates.value[existingIndex] = payload;
    }
  }

  function handleSessionStatusResponse(payload: any) {
    const { userId, deviceId, isOnline, socketCount, allDevices, timestamp } =
      payload ?? {};

    if (allDevices && Array.isArray(allDevices)) {
      sessionStates.value = allDevices;
    }

    currentSessionState.value = {
      userId,
      deviceId,
      isOnline,
      socketCount,
      allDevices,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    };
  }

  function handleForceLogoutResponse(payload: any) {
    const { success, message, targetDeviceId } = payload ?? {};

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

    if (targetDeviceId) {
      console.warn('[SSE] force logout response:', targetDeviceId);
    }
  }

  function handleHeartbeatTimeout(payload: any) {
    const { message, timeout, timestamp } = payload ?? {};

    notification.error({
      message: $t('websocket.heartbeat.timeout'),
      description: message || $t('websocket.heartbeat.timeout'),
      duration: 5,
    });

    console.warn('[SSE] Heartbeat timeout:', { timeout, timestamp });
  }

  function handleStrategyUpdated(payload: any) {
    const { oldStrategy, newStrategy, updatedBy, timestamp } = payload ?? {};

    notification.info({
      message: $t('websocket.strategy.updated'),
      description: $t('websocket.strategy.changed'),
      duration: 10,
    });

    console.warn('[SSE] Login strategy updated:', {
      oldStrategy,
      newStrategy,
      updatedBy,
      timestamp,
    });
  }

  function handleForceLogout(payload: any) {
    const { message, reason } = payload ?? {};

    notification.warning({
      message: message || $t('system.websocket.forceLogoutTitle'),
      description: reason || $t('system.websocket.forceLogoutDescription'),
      duration: 0,
    });

    disconnect();
    authStore.forceLogout();
  }

  function handleSystemMessage(payload: any) {
    notification.info({
      message: payload?.message || $t('system.websocket.systemMessage'),
      description: payload?.content,
    });
  }

  function handleSystemBroadcast(payload: any) {
    notification.info({
      message: payload?.message || $t('system.websocket.systemBroadcast'),
      description: payload?.content,
    });
  }

  function handleErrorMessage(payload: any) {
    const { message, error } = payload ?? {};
    notification.error({
      message: message || $t('system.websocket.error'),
      description: error,
    });
  }

  function connect() {
    if (!accessStore.accessToken) {
      connectionError.value = $t('system.websocket.loginRequired');
      return;
    }

    if (eventSource.value) {
      activeConnectionId += 1;
      eventSource.value.close();
      eventSource.value = null;
    }

    const currentConnectionId = ++activeConnectionId;

    reconnectAttempts.value = 0;
    hasShownConnectionErrorNotification = false;
    isConnecting.value = true;
    connectionError.value = null;

    try {
      const url = new URL(streamUrl.value);
      url.searchParams.set('token', accessStore.accessToken);

      const es = new EventSource(url.toString());

      const handleSseEvent = (event: MessageEvent<string>) => {
        if (currentConnectionId !== activeConnectionId) {
          return;
        }
        const parsed = parseSseMessage(event);
        if (!parsed) {
          return;
        }
        handleMessage(parsed.type, parsed.payload);
      };

      es.addEventListener('open', () => {
        if (currentConnectionId !== activeConnectionId) {
          return;
        }
        isConnected.value = true;
        isConnecting.value = false;
        connectionError.value = null;
        reconnectAttempts.value = 0;
        hasShownConnectionErrorNotification = false;
      });

      es.addEventListener('message', handleSseEvent as EventListener);

      const eventTypes = [
        'connected',
        'force_logout',
        'heartbeat_response',
        'online_users_response',
        'session.force-logout-response',
        'session.heartbeat-timeout',
        'session.state-changed',
        'session.status-response',
        'session.strategy-updated',
        'session_change',
        'system_broadcast',
        'system_message',
        'user_status_change',
      ];

      eventTypes.forEach((eventType) => {
        es.addEventListener(eventType, handleSseEvent as EventListener);
      });

      es.addEventListener('error', () => {
        if (currentConnectionId !== activeConnectionId) {
          return;
        }

        isConnected.value = false;
        isConnecting.value = true;
        reconnectAttempts.value += 1;
        connectionError.value = $t('websocket.connection.failed', {
          error: $t('websocket.error.connectionFailed'),
        });

        if (!hasShownConnectionErrorNotification) {
          notification.error({
            message: $t('system.websocket.connectionFailedTitle'),
            description: $t('system.websocket.connectionFailedDescription'),
            duration: 0,
          });
          hasShownConnectionErrorNotification = true;
        }

        if (reconnectAttempts.value >= MAX_RECONNECT_ATTEMPTS) {
          connectionError.value = $t('websocket.connection.failed', {
            error: $t('websocket.error.connectionFailed'),
          });
          isConnecting.value = false;
          es.close();
          if (eventSource.value === es) {
            eventSource.value = null;
          }
        }
      });

      eventSource.value = es;
    } catch (error: any) {
      isConnected.value = false;
      isConnecting.value = false;
      connectionError.value = $t('websocket.connection.failed', {
        error: error?.message || $t('websocket.error.connectionFailed'),
      });
      notification.error({
        message: $t('system.websocket.connectionFailedTitle'),
        description:
          error?.message || $t('system.websocket.connectionFailedDescription'),
        duration: 0,
      });
    }
  }

  function disconnect() {
    activeConnectionId += 1;

    if (eventSource.value) {
      eventSource.value.close();
      eventSource.value = null;
    }

    isConnected.value = false;
    isConnecting.value = false;
    connectionError.value = null;
    reconnectAttempts.value = 0;
  }

  function $reset() {
    disconnect();
    onlineUsers.value = [];
    onlineUserCount.value = 0;
    serverStats.value = null;
    sessionChangeCount.value = 0;
    lastSessionChange.value = null;
    sessionStates.value = [];
    currentSessionState.value = null;
  }

  return {
    isConnected: computed(() => isConnected.value),
    isConnecting: computed(() => isConnecting.value),
    connectionError: computed(() => connectionError.value),
    reconnectAttempts: computed(() => reconnectAttempts.value),

    onlineUsers: computed(() => onlineUsers.value),
    onlineUserCount: computed(() => onlineUserCount.value),
    serverStats: computed(() => serverStats.value),

    sessionChangeCount: computed(() => sessionChangeCount.value),
    lastSessionChange: computed(() => lastSessionChange.value),
    sessionStates: computed(() => sessionStates.value),
    currentSessionState: computed(() => currentSessionState.value),

    connect,
    disconnect,

    $reset,
  };
});

function createSseUrl(path: string): string {
  const envUrl =
    import.meta.env.VITE_SSE_URL ||
    import.meta.env.VITE_WEBSOCKET_URL ||
    import.meta.env.VITE_GLOB_API_URL ||
    '';

  const defaultOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost';

  let baseUrl = envUrl || defaultOrigin;

  if (!/^https?:\/\//i.test(baseUrl)) {
    const protocol =
      typeof window !== 'undefined' && window.location?.protocol
        ? window.location.protocol
        : 'http:';
    baseUrl = `${protocol}//${baseUrl.replace(/^\/\//, '')}`;
  }

  try {
    return new URL(path, baseUrl).toString();
  } catch {
    try {
      return new URL(path, defaultOrigin).toString();
    } catch {
      return path;
    }
  }
}

function parseSseMessage(event: MessageEvent<string>): ParsedSseMessage | null {
  const rawText = (event?.data ?? '').trim();
  if (!rawText) {
    return null;
  }

  let parsed: any = rawText;

  if (typeof rawText === 'string') {
    try {
      parsed = JSON.parse(rawText);
    } catch (error) {
      console.warn('[SSE] Failed to parse message:', rawText, error);
      return null;
    }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return null;
  }

  let type: string | undefined;
  if (typeof parsed.type === 'string') {
    type = parsed.type;
  } else if (typeof parsed.event === 'string') {
    type = parsed.event;
  } else if (event.type && event.type !== 'message') {
    type = event.type;
  }

  let payload: any;
  if ('payload' in parsed) {
    payload = parsed.payload;
  } else if ('data' in parsed) {
    payload = parsed.data;
  } else {
    payload = parsed;
  }

  if (!type) {
    console.warn('[SSE] Unknown message type:', parsed);
    return null;
  }

  return { type, payload };
}
