import type { FileCategory } from './types';

import { requestClient } from '#/api/request';

/**
 * 查询文件分类列表
 */
function queryFileCategoryList() {
  return requestClient.get<Array<FileCategory.View>>(
    '/system/file/category/list',
  );
}

/**
 * 新增文件分类
 * @param fileCategoryData 文件分类新增数据
 */
function addFileCategory(fileCategoryData: FileCategory.Post) {
  return requestClient.post<boolean>('/system/file/category', fileCategoryData);
}

/**
 * 修改文件分类
 * @param fileCategoryId 文件分类ID
 * @param fileCategoryData 文件分类修改数据
 */
function setFileCategory(
  fileCategoryId: number,
  fileCategoryData: FileCategory.Post,
) {
  return requestClient.put<boolean>(
    `/system/file/category/${fileCategoryId}`,
    fileCategoryData,
  );
}

/**
 * 删除文件分类
 * @param fileCategoryId 文件分类ID
 */
function deleteFileCategory(fileCategoryId: number) {
  return requestClient.delete<boolean>(
    `/system/file/category/${fileCategoryId}`,
  );
}

export {
  addFileCategory,
  deleteFileCategory,
  queryFileCategoryList,
  setFileCategory,
};
