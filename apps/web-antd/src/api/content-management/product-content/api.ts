import type { ProductContent } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取产品内容分页列表
 * @param pageCursor 分页参数（page、pageSize）
 * @param condition 查询条件
 * @returns 分页结果
 */
export function getProductContentPage(
  pageCursor: Api.PageCursor = {},
  condition: ProductContent.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<ProductContent.View[]>>(
    '/product-content/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 获取产品内容详情
 * @param id 内容ID
 * @returns 内容详情
 */
export function getProductContentById(id: number) {
  return requestClient.get<ProductContent.View>(`/product-content/${id}`);
}

/**
 * 新增产品内容
 * @param data 内容数据
 * @returns 操作结果
 */
export function addProductContent(data: ProductContent.Create) {
  return requestClient.post<boolean>('/product-content', data);
}

/**
 * 更新产品内容
 * @param id 内容ID
 * @param data 内容数据
 * @returns 操作结果
 */
export function setProductContentById(id: number, data: ProductContent.Update) {
  return requestClient.put<boolean>(`/product-content/${id}`, data);
}

/**
 * 删除产品内容
 * @param id 内容ID
 * @returns 操作结果
 */
export function deleteProductContentById(id: number) {
  return requestClient.delete<boolean>(`/product-content/${id}`);
}

/**
 * 批量删除产品内容
 * @param data 批量删除数据
 * @returns 操作结果
 */
export function batchDeleteProductContent(data: ProductContent.BatchDelete) {
  return requestClient.post<boolean>('/product-content/batch-delete', data);
}
