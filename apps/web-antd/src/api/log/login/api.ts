import type { LoginLog } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取操作日志列表数据
 * @param params
 * @returns
 */
export function queryLoginLogPage(params?: LoginLog.Condition) {
  return requestClient.get<Api.Pagination<LoginLog.View>>(
    '/admin/log/login/page',
    {
      params,
    },
  );
}
