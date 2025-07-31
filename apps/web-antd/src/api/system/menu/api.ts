import type { Menu } from './types';

import { requestClient } from '#/api/request';
/**
 * 获取菜单数据列表
 */
async function getMenuList() {
  return requestClient.get<Array<Menu.View>>('/system/menu/list');
}

/**
 * 创建菜单
 * @param data 菜单数据
 */
async function createMenu(data: Omit<Menu.View, 'children' | 'id'>) {
  return requestClient.post('/system/menu', data);
}

/**
 * 更新菜单
 *
 * @param id 菜单 ID
 * @param data 菜单数据
 */
async function updateMenu(
  id: string,
  data: Omit<Menu.View, 'children' | 'id'>,
) {
  return requestClient.put(`/system/menu/${id}`, data);
}

/**
 * 删除菜单
 * @param id 菜单 ID
 */
async function deleteMenu(id: string) {
  return requestClient.delete(`/system/menu/${id}`);
}

export { createMenu, deleteMenu, getMenuList, updateMenu };
