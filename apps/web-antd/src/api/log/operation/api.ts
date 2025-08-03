import type { Operation } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取操作日志列表数据
 * @param params
 * @returns
 */
export function queryOperationLogpage(
  pageCursor: Api.PageCursor = {},
  condition: Operation.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Operation.View>>(
    '/admin/operation-log/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 删除操作日志
 * @param id
 * @returns
 */
export function deleteById(id: number) {
  return requestClient.delete(`/admin/operation-log/${id}`);
}
