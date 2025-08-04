import type { User } from '#/api/system/user';
import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 查询用户分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryUserPage(
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
function getMineProfile() {
  return requestClient.get<User.profile>('/system/user/mine/profile');
}

/**
 * 新增用户
 */
function addUser(user: User.Post) {
  return requestClient.post<boolean>('/system/user', user);
}

/**
 * 更新用户
 * @param userId
 * @param user
 */
function setUser(userId: number, user: User.Post) {
  return requestClient.put<boolean>(`/system/user/${userId}`, user);
}

/**
 * 删除用户
 * @param userId
 */
function delUserById(userId: number) {
  return requestClient.delete<boolean>(`/system/user/${userId}`);
}

export { addUser, delUserById, getMineProfile, queryUserPage, setUser };
