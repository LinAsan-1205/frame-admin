import type { Role } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取角色分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryRolePage(
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
 * 获取所有启用的角色
 * @returns 角色列表
 */
function findAllEnabledRoles() {
  return requestClient.get<Role.View[]>('/system/role/list');
}

/**
 * 创建角色
 * @param data 角色数据
 */
function addRole(data: Role.Post) {
  return requestClient.post<boolean>('/system/role', data);
}

/**
 * 更新角色
 * @param roleId 角色ID
 * @param data 角色数据
 */
function setRoleById(roleId: number, data: Role.Post) {
  return requestClient.put<boolean>(`/system/role/${roleId}`, data);
}

/**
 * 删除角色
 * @param roleId 角色ID
 */
function deleteRoleById(roleId: number) {
  return requestClient.delete<boolean>(`/system/role/${roleId}`);
}

/**
 * 设置角色状态
 * @param roleId 角色ID
 * @param status 角色状态
 */
function setRoleStatus(roleId: number, status: string) {
  return requestClient.post<boolean>('/system/role/status', {
    roleId,
    status,
  });
}

/**
 * 分配角色菜单
 * @param roleId 角色ID
 * @param menuIds 菜单ID列表
 */
function assignRoleMenu(roleId: number, menuIds: string[]) {
  return requestClient.post<boolean>('/system/role/assign-role-menu', {
    roleId,
    menuIds,
  });
}

export {
  addRole,
  assignRoleMenu,
  deleteRoleById,
  findAllEnabledRoles,
  queryRolePage,
  setRoleById,
  setRoleStatus,
};
