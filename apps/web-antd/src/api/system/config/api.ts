import type { ConfigGroup, ConfigItem } from '#/api/system/config';
import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 查询配置组分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryConfigGroupPage(
  pageCursor: Api.PageCursor = {},
  condition: ConfigGroup.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<ConfigGroup.View[]>>(
    '/system/config-group/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 查询配置组列表
 * @param condition 查询条件
 */
function queryConfigGroupList(condition: ConfigGroup.Condition = {}) {
  return requestClient.get<ConfigGroup.View[]>('/system/config-group/list', {
    params: condition,
  });
}

/**
 * 根据ID获取配置组详情
 * @param groupId 配置组ID
 */
function getConfigGroupById(groupId: number) {
  return requestClient.get<ConfigGroup.View>(`/system/config-group/${groupId}`);
}

/**
 * 新增配置组
 * @param configGroup 配置组信息
 */
function addConfigGroup(configGroup: ConfigGroup.Post) {
  return requestClient.post<boolean>('/system/config-group', configGroup);
}

/**
 * 更新配置组
 * @param groupId 配置组ID
 * @param configGroup 配置组信息
 */
function setConfigGroupById(
  groupId: number,
  configGroup: Partial<ConfigGroup.Post>,
) {
  return requestClient.put<boolean>(
    `/system/config-group/${groupId}`,
    configGroup,
  );
}

/**
 * 设置配置组状态
 * @param groupId 配置组ID
 * @param status 状态
 */
function setConfigGroupStatus(groupId: number, status: ConfigGroup.Status) {
  return requestClient.post<boolean>('/system/config-group/status', {
    groupId,
    status,
  });
}

/**
 * 删除配置组
 * @param groupId 配置组ID
 */
function delConfigGroupById(groupId: number) {
  return requestClient.delete<boolean>(`/system/config-group/${groupId}`);
}

/**
 * 批量删除配置组
 * @param groupIds 配置组ID列表
 */
function delConfigGroupByIds(groupIds: number[]) {
  return requestClient.post<boolean>('/system/config-group/batch-delete', {
    groupIds,
  });
}

/**
 * 查询配置项分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryConfigItemPage(
  pageCursor: Api.PageCursor = {},
  condition: ConfigItem.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<ConfigItem.View[]>>(
    '/system/config-item/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 根据组ID获取配置项列表
 * @param groupId 配置组ID
 */
function queryConfigItemByGroupId(groupId: number) {
  return requestClient.get<ConfigItem.View[]>(
    `/system/config-item/group/${groupId}`,
  );
}

/**
 * 根据配置键获取配置值
 * @param configKey 配置键
 */
function getConfigValueByKey(configKey: string) {
  return requestClient.get<string>(`/system/config-item/key/${configKey}`);
}

/**
 * 批量获取配置值
 * @param configKeys 配置键列表
 */
function getConfigValuesByKeys(configKeys: string[]) {
  return requestClient.post<Record<string, string>>(
    '/system/config-item/values',
    {
      configKeys,
    },
  );
}

/**
 * 根据ID获取配置项详情
 * @param itemId 配置项ID
 */
function getConfigItemById(itemId: number) {
  return requestClient.get<ConfigItem.View>(`/system/config-item/${itemId}`);
}

/**
 * 新增配置项
 * @param configItem 配置项信息
 */
function addConfigItem(configItem: ConfigItem.Post) {
  return requestClient.post<boolean>('/system/config-item', configItem);
}

/**
 * 更新配置项
 * @param itemId 配置项ID
 * @param configItem 配置项信息
 */
function setConfigItemById(
  itemId: number,
  configItem: Partial<ConfigItem.Post>,
) {
  return requestClient.put<boolean>(
    `/system/config-item/${itemId}`,
    configItem,
  );
}

/**
 * 更新配置值
 * @param configKey 配置键
 * @param configValue 配置值
 */
function setConfigValueByKey(configKey: string, configValue: string) {
  return requestClient.put<boolean>(
    `/system/config-item/key/${configKey}/value`,
    {
      configValue,
    },
  );
}

/**
 * 批量更新配置值
 * @param items 配置项列表
 */
function batchUpdateConfigValues(items: ConfigItem.BatchUpdateValues) {
  return requestClient.put<boolean>('/system/config-item/batch-update', items);
}

/**
 * 删除配置项
 * @param itemId 配置项ID
 */
function delConfigItemById(itemId: number) {
  return requestClient.delete<boolean>(`/system/config-item/${itemId}`);
}

/**
 * 批量删除配置项
 * @param itemIds 配置项ID列表
 */
function delConfigItemByIds(itemIds: number[]) {
  return requestClient.post<boolean>('/system/config-item/batch-delete', {
    itemIds,
  });
}

export {
  addConfigGroup,
  addConfigItem,
  batchUpdateConfigValues,
  delConfigGroupById,
  delConfigGroupByIds,
  delConfigItemById,
  delConfigItemByIds,
  getConfigGroupById,
  getConfigItemById,
  getConfigValueByKey,
  getConfigValuesByKeys,
  queryConfigGroupList,
  queryConfigGroupPage,
  queryConfigItemByGroupId,
  queryConfigItemPage,
  setConfigGroupById,
  setConfigGroupStatus,
  setConfigItemById,
  setConfigValueByKey,
};
