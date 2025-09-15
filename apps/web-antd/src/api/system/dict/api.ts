import type { Dict, DictData } from '#/api/system/dict';
import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 查询字典分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryDictPage(
  pageCursor: Api.PageCursor = {},
  condition: Dict.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Dict.View[]>>(
    '/system/dict/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 查询字典列表
 * @param condition 查询条件
 */
function queryDictList(condition: Dict.Condition = {}) {
  return requestClient.get<Dict.View[]>('/system/dict/list', {
    params: condition,
  });
}

/**
 * 根据ID获取字典详情
 * @param dictId 字典ID
 */
function getDictById(dictId: number) {
  return requestClient.get<Dict.View>(`/system/dict/${dictId}`);
}

/**
 * 根据字典类型获取字典
 * @param dictType 字典类型
 */
function getDictByType(dictType: string) {
  return requestClient.get<Dict.View>(`/system/dict/type/${dictType}`);
}

/**
 * 新增字典
 * @param dict 字典信息
 */
function addDict(dict: Dict.Post) {
  return requestClient.post<boolean>('/system/dict', dict);
}

/**
 * 更新字典
 * @param dictId 字典ID
 * @param dict 字典信息
 */
function setDictById(dictId: number, dict: Partial<Dict.Post>) {
  return requestClient.put<boolean>(`/system/dict/${dictId}`, dict);
}

/**
 * 设置字典状态
 * @param dictId 字典ID
 * @param status 状态
 */
function setDictStatus(dictId: number, status: Dict.Status) {
  return requestClient.post<boolean>('/system/dict/status', {
    dictId,
    status,
  });
}

/**
 * 删除字典
 * @param dictId 字典ID
 */
function delDictById(dictId: number) {
  return requestClient.delete<boolean>(`/system/dict/${dictId}`);
}

/**
 * 批量删除字典
 * @param dictIds 字典ID列表
 */
function delDictByIds(dictIds: number[]) {
  return requestClient.post<boolean>('/system/dict/batch-delete', {
    dictIds,
  });
}

/**
 * 查询字典数据分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryDictDataPage(
  pageCursor: Api.PageCursor = {},
  condition: DictData.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<DictData.View[]>>(
    '/system/dict-data/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 查询字典数据列表
 * @param condition 查询条件
 */
function queryDictDataList(condition: DictData.Condition = {}) {
  return requestClient.get<DictData.View[]>('/system/dict-data/list', {
    params: condition,
  });
}

/**
 * 根据字典类型获取字典数据列表
 * @param dictType 字典类型
 */
function queryDictDataByType(dictType: string) {
  return requestClient.get<DictData.View[]>(
    `/system/dict-data/type/${dictType}`,
  );
}

/**
 * 根据ID获取字典数据详情
 * @param dictDataId 字典数据ID
 */
function getDictDataById(dictDataId: number) {
  return requestClient.get<DictData.View>(`/system/dict-data/${dictDataId}`);
}

/**
 * 新增字典数据
 * @param dictData 字典数据信息
 */
function addDictData(dictData: DictData.Post) {
  return requestClient.post<boolean>('/system/dict-data', dictData);
}

/**
 * 更新字典数据
 * @param dictDataId 字典数据ID
 * @param dictData 字典数据信息
 */
function setDictDataById(dictDataId: number, dictData: Partial<DictData.Post>) {
  return requestClient.put<boolean>(
    `/system/dict-data/${dictDataId}`,
    dictData,
  );
}

/**
 * 设置字典数据状态
 * @param dictDataId 字典数据ID
 * @param status 状态
 */
function setDictDataStatus(dictDataId: number, status: DictData.Status) {
  return requestClient.post<boolean>('/system/dict-data/status', {
    dictDataId,
    status,
  });
}

/**
 * 删除字典数据
 * @param dictDataId 字典数据ID
 */
function delDictDataById(dictDataId: number) {
  return requestClient.delete<boolean>(`/system/dict-data/${dictDataId}`);
}

/**
 * 批量删除字典数据
 * @param dictDataIds 字典数据ID列表
 */
function delDictDataByIds(dictDataIds: number[]) {
  return requestClient.post<boolean>('/system/dict-data/batch-delete', {
    dictDataIds,
  });
}

export {
  addDict,
  addDictData,
  delDictById,
  delDictByIds,
  delDictDataById,
  delDictDataByIds,
  getDictById,
  getDictByType,
  getDictDataById,
  queryDictDataByType,
  queryDictDataList,
  queryDictDataPage,
  queryDictList,
  queryDictPage,
  setDictById,
  setDictDataById,
  setDictDataStatus,
  setDictStatus,
};
