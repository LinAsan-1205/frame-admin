import type { ConfigItem } from '#/api/system/config/types';

import { InputComponentType } from '#/api/system/config/enum';

/**
 * 根据配置项构建表单 schema
 * @param item 配置项
 * @returns 表单字段配置
 */
export function buildFormSchemaFromConfigItem(item: ConfigItem.View) {
  const baseSchema = {
    fieldName: `config_${item.id}`,
    label: item.title,
    helpMessage: item.description,
    defaultValue: item.configValue || '',
  };

  const componentProps = item.componentProps
    ? JSON.parse(item.componentProps)
    : {};

  const options = item.options ? JSON.parse(item.options) : [];

  // 组件类型映射配置
  const componentConfig: any = {
    [InputComponentType.Input]: {
      component: 'Input',
      componentProps,
    },
    [InputComponentType.InputNumber]: {
      component: 'InputNumber',
      componentProps,
    },
    [InputComponentType.InputPassword]: {
      component: 'InputPassword',
      componentProps,
    },
    [InputComponentType.Textarea]: {
      component: 'Textarea',
      componentProps: {
        rows: 3,
        ...componentProps,
      },
    },
    [InputComponentType.Select]: {
      component: 'Select',
      componentProps: {
        options,
        ...componentProps,
      },
    },
    [InputComponentType.Switch]: {
      component: 'Switch',
      componentProps,
    },
  };

  const config =
    componentConfig[item.inputComponent] ||
    componentConfig[InputComponentType.Input];

  return {
    ...baseSchema,
    ...config,
  };
}

/**
 * 批量构建表单 schema
 * @param configItems 配置项列表
 * @returns 表单 schema 数组
 */
export function buildFormSchemasFromConfigItems(
  configItems: ConfigItem.View[],
) {
  return configItems.map((element) => buildFormSchemaFromConfigItem(element));
}
