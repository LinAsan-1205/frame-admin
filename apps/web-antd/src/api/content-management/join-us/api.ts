import { requestClient } from '#/api/request';

import type { JoinUs } from './types';

/**
 * 获取招聘职位分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
export function getJoinUsPage(
  pageCursor: Api.PageCursor = {},
  condition: JoinUs.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<JoinUs.View>>(
    '/join-us/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 获取招聘职位详情
 * @param jobId 职位ID
 */
export function getJoinUsById(jobId: number) {
  return requestClient.get<JoinUs.View>(`/join-us/${jobId}`);
}

/**
 * 新增招聘职位
 * @param data 职位信息
 */
export function addJoinUs(data: JoinUs.Create) {
  return requestClient.post<boolean>('/join-us', data);
}

/**
 * 更新招聘职位
 * @param jobId 职位ID
 * @param data 职位信息
 */
export function setJoinUsById(jobId: number, data: JoinUs.Update) {
  return requestClient.put<boolean>(`/join-us/${jobId}`, data);
}

/**
 * 删除招聘职位
 * @param jobId 职位ID
 */
export function deleteJoinUsById(jobId: number) {
  return requestClient.delete<boolean>(`/join-us/${jobId}`);
}

/**
 * 批量删除招聘职位
 * @param data 批量删除参数
 */
export function batchDeleteJoinUs(data: JoinUs.BatchDelete) {
  return requestClient.post<boolean>('/join-us/batch-delete', data);
}

