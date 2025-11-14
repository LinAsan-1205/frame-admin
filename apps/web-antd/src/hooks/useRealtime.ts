import { computed } from 'vue';

import { useRealtimeStore } from '#/store/realtime';

/**
 * SSE/实时事件组合式函数
 * 提供便捷的实时事件访问能力
 */
export function useRealtime() {
  const realtimeStore = useRealtimeStore();

  const isConnected = computed(() => realtimeStore.isConnected);
  const isConnecting = computed(() => realtimeStore.isConnecting);
  const connectionError = computed(() => realtimeStore.connectionError);
  const reconnectAttempts = computed(() => realtimeStore.reconnectAttempts);

  const onlineUsers = computed(() => realtimeStore.onlineUsers);
  const onlineUserCount = computed(() => realtimeStore.onlineUserCount);
  const serverStats = computed(() => realtimeStore.serverStats);

  const sessionStates = computed(() => realtimeStore.sessionStates);
  const currentSessionState = computed(() => realtimeStore.currentSessionState);
  const sessionChangeCount = computed(() => realtimeStore.sessionChangeCount);
  const lastSessionChange = computed(() => realtimeStore.lastSessionChange);

  const connect = () => realtimeStore.connect();
  const disconnect = () => realtimeStore.disconnect();

  const connectionStatusText = computed(() => {
    if (isConnecting.value) return '连接中...';
    if (isConnected.value) return '已连接';
    if (connectionError.value) return `连接错误: ${connectionError.value}`;
    return '未连接';
  });

  const connectionStatusColor = computed(() => {
    if (isConnecting.value) return 'orange';
    if (isConnected.value) return 'green';
    if (connectionError.value) return 'red';
    return 'gray';
  });

  return {
    isConnected,
    isConnecting,
    connectionError,
    reconnectAttempts,
    onlineUsers,
    onlineUserCount,
    serverStats,
    sessionStates,
    currentSessionState,
    sessionChangeCount,
    lastSessionChange,
    connectionStatusText,
    connectionStatusColor,
    connect,
    disconnect,
  };
}
