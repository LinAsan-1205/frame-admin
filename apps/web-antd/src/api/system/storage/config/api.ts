import type { StorageConfig } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 查询存储配置分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
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
 */
function queryEnabledStorageConfigs() {
  return requestClient.get<StorageConfig.View[]>('/system/storage/config/list');
}

/**
 * 获取存储配置详情
 * @param configId 存储配置ID
 */
function getStorageConfigById(configId: number) {
  return requestClient.get<StorageConfig.View>(
    `/system/storage/config/${configId}`,
  );
}

/**
 * 添加存储配置
 * @param data 存储配置数据
 */
function addStorageConfig(data: StorageConfig.Create) {
  return requestClient.post<StorageConfig.View>('/system/storage/config', data);
}

/**
 * 更新存储配置
 * @param configId 存储配置ID
 * @param data 存储配置数据
 */
function setStorageConfig(configId: number, data: StorageConfig.Update) {
  return requestClient.put<boolean>(`/system/storage/config/${configId}`, data);
}

/**
 * 设置存储配置状态
 * @param configId 存储配置ID
 * @param status 状态
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
 * @param configId 存储配置ID
 * @param isDefault 是否默认
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
 * @param configId 存储配置ID
 */
function delStorageConfigById(configId: number) {
  return requestClient.delete<boolean>(`/system/storage/config/${configId}`);
}

/**
 * 批量删除存储配置
 * @param configIds 存储配置ID列表
 */
function batchDeleteStorageConfigs(configIds: number[]) {
  return requestClient.post<boolean>('/system/storage/config/batch-delete', {
    configIds,
  });
}

/**
 * 获取存储配置统计信息
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
