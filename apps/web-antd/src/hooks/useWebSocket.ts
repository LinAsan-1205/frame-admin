import { computed } from 'vue';

import { useWebSocketStore } from '#/store/websocket';

/**
 * SSE/实时事件组合式函数
 * 提供便捷的实时事件访问能力
 */
export function useWebSocket() {
  const websocketStore = useWebSocketStore();

  const isConnected = computed(() => websocketStore.isConnected);
  const isConnecting = computed(() => websocketStore.isConnecting);
  const connectionError = computed(() => websocketStore.connectionError);
  const reconnectAttempts = computed(() => websocketStore.reconnectAttempts);

  const onlineUsers = computed(() => websocketStore.onlineUsers);
  const onlineUserCount = computed(() => websocketStore.onlineUserCount);
  const serverStats = computed(() => websocketStore.serverStats);

  const sessionStates = computed(() => websocketStore.sessionStates);
  const currentSessionState = computed(
    () => websocketStore.currentSessionState,
  );
  const sessionChangeCount = computed(() => websocketStore.sessionChangeCount);
  const lastSessionChange = computed(() => websocketStore.lastSessionChange);

  const connect = () => websocketStore.connect();
  const disconnect = () => websocketStore.disconnect();

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
