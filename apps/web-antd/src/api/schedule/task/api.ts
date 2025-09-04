import type { Task } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取任务列表数据
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryTaskPage(
  pageCursor: Api.PageCursor = {},
  condition: Task.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Task.View>>(
    '/schedule/task/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 添加任务
 * @param data 任务数据
 */
function addTask(data: Task.Post) {
  return requestClient.post('/schedule/task', data);
}

/**
 * 更新任务
 * @param id 任务ID
 * @param data 任务数据
 */
function setTask(id: number, data: Task.Post) {
  return requestClient.put(`/schedule/task/${id}`, data);
}

/**
 * 删除任务
 * @param id 任务ID
 */
function deleteTask(id: number) {
  return requestClient.delete(`/schedule/task/${id}`);
}

/**
 * 执行任务
 * @param id 任务ID
 */
function executeTask(id: number) {
  return requestClient.post(`/schedule/task/${id}/execute`);
}

function setTaskStatus(id: number, status: string) {
  return requestClient.put(`/schedule/task/${id}/status`, { status });
}

export {
  addTask,
  deleteTask,
  executeTask,
  queryTaskPage,
  setTask,
  setTaskStatus,
};
