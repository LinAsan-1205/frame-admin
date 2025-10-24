import { computed } from 'vue';

import { useWebSocketStore } from '#/store/websocket';

/**
 * WebSocket 组合式函数
 * 提供便捷的WebSocket功能访问
 */
export function useWebSocket() {
  const websocketStore = useWebSocketStore();

  // 连接状态
  const isConnected = computed(() => websocketStore.isConnected);
  const isConnecting = computed(() => websocketStore.isConnecting);
  const connectionError = computed(() => websocketStore.connectionError);
  const reconnectAttempts = computed(() => websocketStore.reconnectAttempts);

  // 在线用户信息
  const onlineUsers = computed(() => websocketStore.onlineUsers);
  const onlineUserCount = computed(() => websocketStore.onlineUserCount);
  const serverStats = computed(() => websocketStore.serverStats);

  // 会话相关数据（新增）
  const sessionStates = computed(() => websocketStore.sessionStates);
  const currentSessionState = computed(
    () => websocketStore.currentSessionState,
  );
  const sessionChangeCount = computed(() => websocketStore.sessionChangeCount);
  const lastSessionChange = computed(() => websocketStore.lastSessionChange);

  // 连接管理
  const connect = () => websocketStore.connect();
  const disconnect = () => websocketStore.disconnect();

  // 消息发送
  const sendMessage = (type: string, data?: any) =>
    websocketStore.sendMessage(type, data);

  // 获取在线用户列表
  const refreshOnlineUsers = () => websocketStore.getOnlineUsers();

  // 查询会话状态（新增）
  const querySessionStatus = () => websocketStore.querySessionStatus();

  // 强制登出指定设备（新增）
  const forceLogoutDevice = (targetDeviceId?: string, reason?: string) =>
    websocketStore.forceLogoutDevice(targetDeviceId, reason);

  // 发送心跳（手动）
  const sendHeartbeat = () => sendMessage('heartbeat');

  // 连接状态文本
  const connectionStatusText = computed(() => {
    if (isConnecting.value) return '连接中...';
    if (isConnected.value) return '已连接';
    if (connectionError.value) return `连接错误: ${connectionError.value}`;
    return '未连接';
  });

  // 连接状态颜色
  const connectionStatusColor = computed(() => {
    if (isConnecting.value) return 'orange';
    if (isConnected.value) return 'green';
    if (connectionError.value) return 'red';
    return 'gray';
  });

  return {
    // 状态
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

    // 方法
    connect,
    disconnect,
    sendMessage,
    refreshOnlineUsers,
    sendHeartbeat,
    querySessionStatus,
    forceLogoutDevice,
  };
}
