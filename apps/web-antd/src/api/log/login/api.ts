import type { LoginLog } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取操作日志列表数据
 */
export function queryLoginLogPage(
  pageCursor: Api.PageCursor = {},
  condition: LoginLog.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<LoginLog.View>>(
    '/admin/log/login/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 批量删除登录日志
 * @param ids
 */
export function deleteByIds(ids: number[]) {
  return requestClient.post(`/admin/log/login/delete-batch`, {
    ids,
  });
}
