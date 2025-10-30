import type { ProductCategory } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取产品分类分页列表
 * @param pageCursor 分页参数（page、pageSize）
 * @param condition 查询条件
 * @returns 分页结果
 */
export function getProductCategoryPage(
  pageCursor: Api.PageCursor = {},
  condition: ProductCategory.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<ProductCategory.View[]>>(
    '/product-category/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 获取产品分类树形结构
 * @returns 树形分类列表
 */
export function getProductCategoryTree() {
  return requestClient.get<ProductCategory.View[]>('/product-category/tree');
}

/**
 * 获取产品分类详情
 * @param id 分类ID
 * @returns 分类详情
 */
export function getProductCategoryById(id: number) {
  return requestClient.get<ProductCategory.View>(`/product-category/${id}`);
}

/**
 * 新增产品分类
 * @param data 分类数据
 * @returns 操作结果
 */
export function addProductCategory(data: ProductCategory.Create) {
  return requestClient.post<boolean>('/product-category', data);
}

/**
 * 更新产品分类
 * @param id 分类ID
 * @param data 分类数据
 * @returns 操作结果
 */
export function setProductCategoryById(
  id: number,
  data: ProductCategory.Update,
) {
  return requestClient.put<boolean>(`/product-category/${id}`, data);
}

/**
 * 删除产品分类
 * @param id 分类ID
 * @returns 操作结果
 */
export function deleteProductCategoryById(id: number) {
  return requestClient.delete<boolean>(`/product-category/${id}`);
}

/**
 * 批量删除产品分类
 * @param data 批量删除数据
 * @returns 操作结果
 */
export function batchDeleteProductCategory(data: ProductCategory.BatchDelete) {
  return requestClient.post<boolean>('/product-category/batch-delete', data);
}
