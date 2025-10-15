import type { ServerMonitor } from '#/api/system/monitor';

import { requestClient } from '#/api/request';

/**
 * 获取服务器监控信息
 */
function getServerInfo() {
  return requestClient.get<ServerMonitor.Info>('/system/monitor/server');
}

export { getServerInfo };
