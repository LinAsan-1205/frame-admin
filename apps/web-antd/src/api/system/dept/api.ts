import type { Dept } from './types';

import { requestClient } from '#/api/request';

/**
 * 获取部门列表数据
 */
function getDeptList(params: Dept.Condition) {
  return requestClient.get<Array<Dept.View>>('/system/dept/list', {
    params,
  });
}

/**
 * 查询部门树
 * @returns 部门树
 */
function queryDeptTree() {
  return requestClient.get<Array<Dept.View>>('/system/dept/tree');
}

/**
 * 创建部门
 * @param data 部门数据
 */
function addDept(data: Omit<Dept.View, 'children' | 'id'>) {
  return requestClient.post('/system/dept', data);
}

/**
 * 更新部门
 *
 * @param id 部门 ID
 * @param data 部门数据
 */
function setDeptById(id: number, data: Omit<Dept.View, 'children' | 'id'>) {
  return requestClient.put(`/system/dept/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
function deleteDeptById(id: number) {
  return requestClient.delete(`/system/dept/${id}`);
}

export { addDept, deleteDeptById, getDeptList, queryDeptTree, setDeptById };
