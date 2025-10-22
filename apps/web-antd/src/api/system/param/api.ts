import type { Param } from './types';

import type { Api } from '#/api/types';

import { omit } from 'es-toolkit';

import { requestClient } from '#/api/request';

const prefix = '/system/param';

/** 分页查询参数 */
function getParamPage(
  pageCursor: Api.PageCursor = {},
  condition: Param.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Param.View>>(`${prefix}/page`, {
    params: { ...pageCursor, ...condition },
  });
}

/** 列表查询参数 */
function getParamList(condition: Param.Condition = {}) {
  return requestClient.get<Param.View[]>(`${prefix}/list`, {
    params: condition,
  });
}

/** 获取参数详情 */
function getParamById(paramId: number) {
  return requestClient.get<Param.View>(`${prefix}/${paramId}`);
}

/** 通过键获取参数值 */
function getParamValueByKey(key: string) {
  return requestClient.get<null | string>(`${prefix}/value`, {
    params: { key },
  });
}

/** 新增参数 */
function addParam(data: Param.Post) {
  return requestClient.post<boolean>(prefix, data);
}

/** 更新参数 */
function setParamById(paramId: number, data: Param.Post) {
  const omitIsSystem = omit(data, ['isSystem']);
  return requestClient.put<boolean>(`${prefix}/${paramId}`, omitIsSystem);
}

/** 删除参数 */
function deleteParamById(paramId: number) {
  return requestClient.delete<boolean>(`${prefix}/${paramId}`);
}

/** 批量删除参数 */
function batchDeleteParam(data: Param.BatchDelete) {
  return requestClient.post<boolean>(`${prefix}/batch-delete`, data);
}

export {
  addParam,
  batchDeleteParam,
  deleteParamById,
  getParamById,
  getParamList,
  getParamPage,
  getParamValueByKey,
  setParamById,
};
