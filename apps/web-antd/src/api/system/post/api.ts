import type { Post } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取岗位分页列表
 */
function getPostPage(
  pageCursor: Api.PageCursor = {},
  condition: Post.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Post.View>>(
    '/system/post/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 获取岗位列表
 */
function getPostList(params?: Post.Condition) {
  return requestClient.get<Post.View[]>('/system/post/list', {
    params,
  });
}

/**
 * 根据ID获取岗位详情
 * @param id 岗位ID
 */
function getPostById(id: number) {
  return requestClient.get<Post.View>(`/system/post/${id}`);
}

/**
 * 创建岗位
 * @param data 岗位数据
 */
function addPost(data: Post.Create) {
  return requestClient.post('/system/post', data);
}

/**
 * 更新岗位
 * @param id 岗位ID
 * @param data 岗位数据
 */
function setPostById(id: number, data: Omit<Post.Update, 'id'>) {
  return requestClient.put(`/system/post/${id}`, data);
}

/**
 * 设置岗位状态
 * @param data 状态数据
 */
function setPostStatus(data: Post.SetStatus) {
  return requestClient.post('/system/post/status', data);
}

/**
 * 删除岗位
 * @param id 岗位ID
 */
function deletePostById(id: number) {
  return requestClient.delete(`/system/post/${id}`);
}

/**
 * 批量删除岗位
 * @param data 岗位ID列表
 */
function batchDeletePost(data: Post.BatchDelete) {
  return requestClient.post('/system/post/batch-delete', data);
}

export {
  addPost,
  batchDeletePost,
  deletePostById,
  getPostById,
  getPostList,
  getPostPage,
  setPostById,
  setPostStatus,
};
