import type { Role } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取角色分页列表
 * @param params 查询参数
 * @returns 角色分页列表
 */
export function queryRolePage(
  pageCursor: Api.PageCursor = {},
  condition: Role.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Role.View>>(
    '/system/role/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 创建角色
 * @param data 角色数据
 */
export function addRole(data: Role.Post) {
  return requestClient.post<boolean>('/system/role', data);
}

/**
 * 更新角色
 * @param roleId 角色ID
 * @param data 角色数据
 */
export function setRoleById(roleId: number, data: Role.Post) {
  return requestClient.put<boolean>(`/system/role/${roleId}`, data);
}

/**
 * 删除角色
 * @param roleId 角色ID
 */
export function deleteRoleById(roleId: number) {
  return requestClient.delete<boolean>(`/system/role/${roleId}`);
}

/**
 * 设置角色状态
 * @param roleId 角色ID
 * @param status 角色状态
 */
export function setRoleStatus(roleId: number, status: string) {
  return requestClient.post<boolean>(`/system/role/status`, {
    roleId,
    status,
  });
}
