import type { StorageConfig } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 查询存储配置分页列表
 * @param pageCursor 分页参数，包含页码、每页大小等信息
 * @param condition 查询条件，支持按类型、状态、名称等筛选
 * @returns 返回分页的存储配置列表数据
 */
function queryStorageConfigPage(
  pageCursor: Api.PageCursor = {},
  condition: StorageConfig.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<StorageConfig.View[]>>(
    '/system/storage/config/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 获取启用的存储配置列表
 * @returns 返回所有启用状态的存储配置列表
 */
function queryEnabledStorageConfigs() {
  return requestClient.get<StorageConfig.View[]>('/system/storage/config/list');
}

/**
 * 获取存储配置详情
 * @param configId 存储配置唯一标识ID
 * @returns 返回指定ID的存储配置详细信息
 */
function getStorageConfigById(configId: number) {
  return requestClient.get<StorageConfig.View>(
    `/system/storage/config/${configId}`,
  );
}

/**
 * 添加存储配置
 * @param data 存储配置创建数据，包含名称、编码、类型等必填信息
 * @returns 返回新创建的存储配置信息
 */
function addStorageConfig(data: StorageConfig.Create) {
  return requestClient.post<StorageConfig.View>('/system/storage/config', data);
}

/**
 * 更新存储配置
 * @param configId 存储配置唯一标识ID
 * @param data 存储配置更新数据，只更新提供的字段
 * @returns 返回更新操作是否成功
 */
function setStorageConfig(configId: number, data: StorageConfig.Update) {
  return requestClient.put<boolean>(`/system/storage/config/${configId}`, data);
}

/**
 * 设置存储配置状态
 * @param configId 存储配置唯一标识ID
 * @param status 目标状态：Enabled(启用) 或 Disabled(禁用)
 * @returns 返回状态设置操作是否成功
 */
function setStorageConfigStatus(
  configId: number,
  status: StorageConfig.Status,
) {
  return requestClient.post<boolean>('/system/storage/config/status', {
    configId,
    status,
  });
}

/**
 * 设置存储配置是否默认
 * @param configId 存储配置唯一标识ID
 * @param isDefault 是否设为默认：Yes(是) 或 No(否)
 * @returns 返回默认设置操作是否成功
 */
function setStorageConfigIsDefault(
  configId: number,
  isDefault: StorageConfig.IsDefault,
) {
  return requestClient.post<boolean>('/system/storage/config/is-default', {
    configId,
    isDefault,
  });
}

/**
 * 删除存储配置
 * @param configId 存储配置唯一标识ID
 * @returns 返回删除操作是否成功
 */
function delStorageConfigById(configId: number) {
  return requestClient.delete<boolean>(`/system/storage/config/${configId}`);
}

/**
 * 批量删除存储配置
 * @param configIds 存储配置ID数组，支持一次性删除多个配置
 * @returns 返回批量删除操作是否成功
 */
function batchDeleteStorageConfigs(configIds: number[]) {
  return requestClient.post<boolean>('/system/storage/config/batch-delete', {
    configIds,
  });
}

/**
 * 获取存储配置统计信息
 * @returns 返回存储配置的统计概览数据，包含总数、各状态数量等
 */
function getStorageConfigStatistics() {
  return requestClient.get<StorageConfig.Statistics>(
    '/system/storage/config/statistics/overview',
  );
}

export {
  addStorageConfig,
  batchDeleteStorageConfigs,
  delStorageConfigById,
  getStorageConfigById,
  getStorageConfigStatistics,
  queryEnabledStorageConfigs,
  queryStorageConfigPage,
  setStorageConfig,
  setStorageConfigIsDefault,
  setStorageConfigStatus,
};
