import type { User } from '#/api/system/user';
import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 查询用户分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 * @returns
 */
export function queryUserPage(
  pageCursor: Api.PageCursor = {},
  condition: User.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<User.View[]>>(
    '/system/user/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}
/**
 * 获取用户信息
 */
export function getMineProfile() {
  return requestClient.get<User.profile>('/system/user/mine/profile');
}
