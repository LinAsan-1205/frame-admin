import type { RedisCache } from './types';

import { requestClient } from '#/api/request';

/**
 * 获取Redis缓存监控信息
 */
function getRedisCacheInfo() {
  return requestClient.get<RedisCache.Info>('/cache-monitor/redis-info');
}

export { getRedisCacheInfo };
