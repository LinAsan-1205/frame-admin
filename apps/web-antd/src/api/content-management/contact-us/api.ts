import type { ContactUs } from './types';

import { requestClient } from '#/api/request';

/**
 * 获取联系记录分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
export function getContactUsPage(
  pageCursor: Api.PageCursor = {},
  condition: ContactUs.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<ContactUs.View>>(
    '/contact-us/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 获取联系记录详情
 * @param contactId 联系记录ID
 */
export function getContactUsById(contactId: number) {
  return requestClient.get<ContactUs.View>(`/contact-us/${contactId}`);
}

/**
 * 新增联系记录
 * @param data 联系记录信息
 */
export function addContactUs(data: ContactUs.Create) {
  return requestClient.post<boolean>('/contact-us', data);
}

/**
 * 更新联系记录
 * @param contactId 联系记录ID
 * @param data 联系记录信息
 */
export function setContactUsById(contactId: number, data: ContactUs.Update) {
  return requestClient.put<boolean>(`/contact-us/${contactId}`, data);
}

/**
 * 删除联系记录
 * @param contactId 联系记录ID
 */
export function deleteContactUsById(contactId: number) {
  return requestClient.delete<boolean>(`/contact-us/${contactId}`);
}

/**
 * 批量删除联系记录
 * @param data 批量删除参数
 */
export function batchDeleteContactUs(data: ContactUs.BatchDelete) {
  return requestClient.post<boolean>('/contact-us/batch-delete', data);
}
