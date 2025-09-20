import type { VbenFormSchema } from '#/adapter/form';

import { Status } from '#/api/system/role';
import { $t } from '#/locales';

/**
 * 角色表单配置
 * @returns 角色表单字段配置数组
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.role.roleName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.role.code'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: Status.toSelect(),
        optionType: 'button',
      },
      defaultValue: Status.Normal,
      fieldName: 'status',
      label: $t('system.role.status'),
    },
    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: $t('system.role.sort'),
      defaultValue: 1,
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
  ];
}

/**
 * 权限分配表单配置
 * @returns 权限分配表单字段配置数组
 */
export function usePermissionAssignFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'name',
      label: $t('system.role.roleName'),
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'code',
      label: $t('system.role.code'),
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: $t('system.role.assignedAuth'),
      modelPropName: 'modelValue',
    },
  ];
}
