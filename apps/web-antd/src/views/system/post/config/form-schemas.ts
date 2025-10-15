import type { VbenFormSchema } from '#/adapter/form';

import { queryDeptTree } from '#/api/system/dept';
import { PostStatus } from '#/api/system/post';
import { $t } from '#/locales';

/**
 * 岗位表单配置
 * @returns 表单schema配置数组
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.post.postCodePlaceholder'),
      },
      fieldName: 'postCode',
      label: $t('system.post.postCode'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.post.postNamePlaceholder'),
      },
      fieldName: 'postName',
      label: $t('system.post.postName'),
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        api: queryDeptTree,
        allowClear: true,
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        placeholder: $t('system.post.deptPlaceholder'),
      },
      fieldName: 'deptId',
      label: $t('system.post.dept'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('system.post.postSortPlaceholder'),
      },
      defaultValue: 0,
      fieldName: 'postSort',
      label: $t('system.post.postSort'),
    },
    {
      component: 'Select',
      componentProps: {
        options: PostStatus.toSelect(),
        placeholder: $t('system.post.statusPlaceholder'),
      },
      defaultValue: PostStatus.Normal,
      fieldName: 'status',
      label: $t('system.post.status'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('system.post.remarkPlaceholder'),
        rows: 3,
      },
      fieldName: 'remark',
      label: $t('system.post.remark'),
    },
  ];
}
