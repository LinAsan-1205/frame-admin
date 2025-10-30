import type { VbenFormSchema } from '#/adapter/form';

import { getProductCategoryTree } from '#/api/content-management/product-category';
import { $t } from '#/locales';

/**
 * 产品分类表单配置
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.category.namePlaceholder'),
      },
      dependencies: {
        triggerFields: ['name'],
        show: () => true,
      },
      fieldName: 'name',
      label: $t('content-management.category.name'),
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: getProductCategoryTree,
        fieldNames: {
          label: 'name',
          value: 'id',
        },
        placeholder: $t('content-management.category.parentIdPlaceholder'),
        resultField: 'data',
      },
      fieldName: 'parentId',
      label: $t('content-management.category.parentId'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('content-management.category.sortPlaceholder'),
        style: { width: '100%' },
      },
      fieldName: 'sort',
      label: $t('content-management.category.sort'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('content-management.category.remarkPlaceholder'),
        rows: 3,
      },
      fieldName: 'remark',
      label: $t('content-management.category.remark'),
    },
  ];
}
