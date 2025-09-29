import type { Tenant } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 查询租户分页列表
 */
function queryTenantPage(
  pageCursor: Api.PageCursor = {},
  condition: Tenant.QueryParams = {},
) {
  return requestClient.get<Api.PaginationResult<Tenant.View[]>>(
    '/tenant/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 查询租户列表
 */
function queryTenantList() {
  return requestClient.get<Tenant.View[]>('/tenant/list');
}

/**
 * 获取租户详情
 * @param id 租户ID
 */
function getTenantById(id: number) {
  return requestClient.get<Tenant.View>(`/tenant/${id}`);
}

/**
 * 新增租户
 * @param data 租户数据
 */
function addTenant(data: Tenant.Edit) {
  return requestClient.post<boolean>('/tenant', data);
}

/**
 * 更新租户
 * @param id 租户ID
 * @param data 租户数据
 */
function setTenant(id: number, data: Tenant.Edit) {
  return requestClient.put<boolean>(`/tenant/${id}`, data);
}

/**
 * 删除租户
 * @param id 租户ID
 */
function delTenantById(id: number) {
  return requestClient.delete<boolean>(`/tenant/${id}`);
}

/**
 * 批量删除租户
 * @param tenantIds 租户ID列表
 */
function delTenantByIds(tenantIds: number[]) {
  return requestClient.post<boolean>('/tenant/batch-delete', {
    tenantIds,
  });
}

/**
 * 设置租户状态
 * @param tenantId 租户ID
 * @param status 状态
 */
function setTenantStatus(tenantId: number, status: Tenant.StatusType) {
  return requestClient.post<boolean>('/tenant/status', {
    tenantId,
    status,
  });
}

export {
  addTenant,
  delTenantById,
  delTenantByIds,
  getTenantById,
  queryTenantList,
  queryTenantPage,
  setTenant,
  setTenantStatus,
};