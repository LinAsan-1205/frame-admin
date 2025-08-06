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
 * 添加存储配置
 * @param data
 */
function addStorageConfig(data: StorageConfig.Post) {
  return requestClient.post<boolean>('/system/storage/config', data);
}

/**
 * 更新存储配置
 * @param configId 存储配置ID
 * @param data
 */
function setStorageConfig(configId: number, data: StorageConfig.Post) {
  return requestClient.put<boolean>(`/system/storage/config/${configId}`, data);
}

/**
 * 设置存储配置状态
 * @param configId 存储配置ID
 * @param status
 */
function setStorageConfigStatus(
  configId: number,
  status: StorageConfig.Status,
) {
  return requestClient.post<boolean>(`/system/storage/config/status`, {
    configId,
    status,
  });
}

/**
 * 设置存储配置状态
 * @param configId 存储配置ID
 * @param isDefault
 */
function setStorageConfigIsDefault(
  configId: number,
  isDefault: StorageConfig.IsDefault,
) {
  return requestClient.post<boolean>(`/system/storage/config/is-default`, {
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

export {
  addStorageConfig,
  delStorageConfigById,
  queryStorageConfigPage,
  setStorageConfig,
  setStorageConfigIsDefault,
  setStorageConfigStatus,
};
