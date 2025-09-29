import type { Package } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 查询套餐分页列表
 */
function queryPackagePage(
  pageCursor: Api.PageCursor = {},
  condition: Package.QueryParams = {},
) {
  return requestClient.get<Api.PaginationResult<Package.View[]>>(
    '/tenant/package/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 查询套餐列表
 */
function queryPackageList() {
  return requestClient.get<Package.View[]>('/tenant/package/list');
}

/**
 * 获取套餐详情
 * @param id 套餐ID
 */
function getPackageById(id: number) {
  return requestClient.get<Package.View>(`/tenant/package/${id}`);
}

/**
 * 新增套餐
 * @param data 套餐数据
 */
function addPackage(data: Package.Edit) {
  return requestClient.post<boolean>('/tenant/package', data);
}

/**
 * 更新套餐
 * @param id 套餐ID
 * @param data 套餐数据
 */
function setPackage(id: number, data: Package.Edit) {
  return requestClient.put<boolean>(`/tenant/package/${id}`, data);
}

/**
 * 删除套餐
 * @param id 套餐ID
 */
function delPackageById(id: number) {
  return requestClient.delete<boolean>(`/tenant/package/${id}`);
}

/**
 * 批量删除套餐
 * @param packageIds 套餐ID列表
 */
function delPackageByIds(packageIds: number[]) {
  return requestClient.post<boolean>('/tenant/package/batch-delete', {
    packageIds,
  });
}

/**
 * 设置套餐状态
 * @param packageId 套餐ID
 * @param status 状态
 */
function setPackageStatus(packageId: number, status: Package.StatusType) {
  return requestClient.post<boolean>('/tenant/package/status', {
    packageId,
    status,
  });
}

export {
  addPackage,
  delPackageById,
  delPackageByIds,
  getPackageById,
  queryPackageList,
  queryPackagePage,
  setPackage,
  setPackageStatus,
};