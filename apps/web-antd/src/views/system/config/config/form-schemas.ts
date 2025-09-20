import type { VbenFormSchema } from '#/adapter/form';

import { z } from '#/adapter/form';
import {
  ConfigGroupStatus,
  InputComponentType,
} from '#/api/system/config/enum';
import { $t } from '#/locales';

/**
 * 配置组表单schema
 * @returns 表单schema配置数组
 */
export function useConfigGroupFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.configGroup.groupNamePlaceholder'),
        maxlength: 50,
      },
      fieldName: 'groupName',
      label: $t('system.config.configGroup.groupName'),
      rules: z
        .string()
        .min(1, $t('system.config.configGroup.groupNamePlaceholder'))
        .max(50, '组名称不能超过50个字符'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.configGroup.configKeyPlaceholder'),
        maxlength: 50,
      },
      fieldName: 'configKey',
      label: $t('system.config.configGroup.configKey'),
      rules: z
        .string()
        .min(1, $t('system.config.configGroup.configKeyPlaceholder'))
        .max(50, '配置组标识不能超过50个字符'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('system.config.configGroup.remarkPlaceholder'),
        rows: 3,
        maxlength: 200,
      },
      fieldName: 'remark',
      label: $t('system.config.configGroup.remark'),
      rules: z.string().max(200, '备注不能超过200个字符').optional(),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        placeholder: $t('system.config.configGroup.statusPlaceholder'),
        options: ConfigGroupStatus.toOriginItems(),
      },
      fieldName: 'status',
      label: $t('system.config.configGroup.status'),
      defaultValue: ConfigGroupStatus.Normal,
      rules: z
        .string()
        .min(1, $t('system.config.configGroup.statusPlaceholder')),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('system.config.configGroup.sortOrderPlaceholder'),
        min: 0,
        max: 9999,
      },
      fieldName: 'sortOrder',
      label: $t('system.config.configGroup.sortOrder'),
      rules: z
        .number()
        .min(0, '排序值必须在0-9999之间')
        .max(9999, '排序值必须在0-9999之间'),
    },
  ];
}

/**
 * 配置项添加表单schema
 * @returns 表单schema配置数组
 */
export function useConfigItemAddFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.configItem.titlePlaceholder'),
        maxlength: 100,
      },
      fieldName: 'title',
      label: $t('system.config.configItem.title_field'),
      rules: z
        .string()
        .min(1, $t('system.config.configItem.titlePlaceholder'))
        .max(100, '配置标题不能超过100个字符'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.configItem.configKeyPlaceholder'),
        maxlength: 100,
      },
      fieldName: 'configKey',
      label: $t('system.config.configItem.configKey'),
      rules: z
        .string()
        .min(1, $t('system.config.configItem.configKeyPlaceholder'))
        .max(100, '配置键不能超过100个字符')
        .regex(
          /^[a-z][\w.-]*$/i,
          '配置键必须以字母开头，只能包含字母、数字、点、下划线、横线',
        ),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('system.config.configItem.configValuePlaceholder'),
        rows: 3,
        maxlength: 2000,
      },
      fieldName: 'configValue',
      label: $t('system.config.configItem.configValue'),
      rules: z.string().max(2000, '配置值不能超过2000个字符').optional(),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: $t('system.config.configItem.inputComponentPlaceholder'),
        options: InputComponentType.toOriginItems(),
      },
      fieldName: 'inputComponent',
      label: $t('system.config.configItem.inputComponent'),
      defaultValue: InputComponentType.Input,
      rules: z
        .string()
        .min(1, $t('system.config.configItem.inputComponentPlaceholder')),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('system.config.configItem.descriptionPlaceholder'),
        rows: 2,
        maxlength: 500,
      },
      fieldName: 'description',
      label: $t('system.config.configItem.description'),
      rules: z.string().max(500, '描述不能超过500个字符').optional(),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('system.config.configItem.sortOrderPlaceholder'),
        min: 0,
        max: 9999,
      },
      fieldName: 'sortOrder',
      label: $t('system.config.configItem.sortOrder'),
      defaultValue: 0,
      rules: z
        .number()
        .min(0, '排序值必须在0-9999之间')
        .max(9999, '排序值必须在0-9999之间'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '输入JSON格式的组件属性配置',
        rows: 3,
        maxlength: 1000,
      },
      fieldName: 'componentProps',
      label: $t('system.config.configItem.componentProps'),
      help: '例如: {"placeholder": "请输入值", "maxlength": 50}',
      rules: z.string().max(1000, '组件属性不能超过1000个字符').optional(),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '输入JSON格式的选项配置',
        rows: 3,
        maxlength: 1000,
      },
      dependencies: {
        triggerFields: ['inputComponent'],
        show: (values) => {
          return values.inputComponent === InputComponentType.Select;
        },
      },
      fieldName: 'options',
      label: $t('system.config.configItem.options'),
      help: '例如: [{"label": "选项1", "value": "1"}, {"label": "选项2", "value": "2"}]',
      rules: z.string().max(1000, '选项配置不能超过1000个字符').optional(),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '输入JSON格式的验证规则',
        rows: 2,
        maxlength: 500,
      },
      fieldName: 'validationRules',
      label: $t('system.config.configItem.validationRules'),
      help: '例如: {"required": true, "message": "不能为空"}',
      rules: z.string().max(500, '验证规则不能超过500个字符').optional(),
    },
  ];
}
