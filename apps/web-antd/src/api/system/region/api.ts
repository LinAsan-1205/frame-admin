import type { Region } from './types';

import { requestClient } from '#/api/request';

/**
 * 获取行政区域分页列表
 * @param params 查询参数
 */
function getRegionPage(params: Region.Condition) {
  return requestClient.get<{
    items: Region.View[];
    total: number;
  }>('/system/region/page', {
    params,
  });
}

/**
 * 获取行政区域列表
 * @param params 查询参数
 */
function getRegionList(params?: Region.Condition) {
  return requestClient.get<Array<Region.View>>('/system/region/list', {
    params,
  });
}

/**
 * 根据ID获取行政区域详情
 * @param id 行政区域ID
 */
function getRegionById(id: number) {
  return requestClient.get<Region.View>(`/system/region/${id}`);
}

/**
 * 创建行政区域
 * @param data 行政区域数据
 */
function addRegion(data: Region.Post) {
  return requestClient.post('/system/region', data);
}

/**
 * 更新行政区域
 * @param id 行政区域ID
 * @param data 行政区域数据
 */
function setRegionById(id: number, data: Region.Post) {
  return requestClient.put(`/system/region/${id}`, data);
}

/**
 * 删除行政区域
 * @param id 行政区域ID
 */
function deleteRegionById(id: number) {
  return requestClient.delete(`/system/region/${id}`);
}

/**
 * 批量删除行政区域
 * @param regionIds 行政区域ID列表
 */
function batchDeleteRegion(regionIds: number[]) {
  return requestClient.post('/system/region/batch-delete', { regionIds });
}

export {
  addRegion,
  batchDeleteRegion,
  deleteRegionById,
  getRegionById,
  getRegionList,
  getRegionPage,
  setRegionById,
};
