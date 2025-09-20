import type { VbenFormSchema } from '#/adapter/form';

import { z } from '#/adapter/form';
import { getDeptList, Status } from '#/api/system/dept';
import { $t } from '#/locales';

/**
 * 部门表单配置
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 * @returns 部门表单字段配置数组
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: getDeptList,
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
      },
      fieldName: 'parentId',
      label: $t('system.dept.parentDept'),
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.dept.deptName'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.dept.deptName'), 2]))
        .max(
          20,
          $t('ui.formRules.maxLength', [$t('system.dept.deptName'), 20]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'leader',
      label: $t('system.dept.leader'),
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.dept.phone'),
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.dept.email'),
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: Status.toSelect(),
      },
      defaultValue: Status.Normal,
      fieldName: 'status',
      label: $t('system.dept.status'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
        class: 'w-full',
      },
      fieldName: 'orderNum',
      defaultValue: 0,
      label: $t('system.dept.orderNum'),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
        class: 'w-full',
      },
      fieldName: 'remark',
      label: $t('system.dept.remark'),
      rules: z
        .string()
        .max(50, $t('ui.formRules.maxLength', [$t('system.dept.remark'), 50]))
        .optional(),
    },
  ];
}
