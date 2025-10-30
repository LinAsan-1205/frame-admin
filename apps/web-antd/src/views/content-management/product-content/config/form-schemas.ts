import type { VbenFormSchema } from '#/adapter/form';

import { getProductCategoryTree } from '#/api/content-management/product-category';
import {
  ProductContentStatus,
  ProductContentStatusLabels,
  ProductContentType,
  ProductContentTypeLabels,
} from '#/api/content-management/product-content';
import { $t } from '#/locales';

/**
 * 产品内容表单配置
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.content.titlePlaceholder'),
      },
      fieldName: 'title',
      label: $t('content-management.content.title'),
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: false,
        api: getProductCategoryTree,
        fieldNames: {
          label: 'name',
          value: 'id',
        },
        placeholder: $t('content-management.content.categoryIdPlaceholder'),
        resultField: 'data',
      },
      fieldName: 'categoryId',
      label: $t('content-management.content.categoryId'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: Object.values(ProductContentType).map((value) => ({
          label: ProductContentTypeLabels[value],
          value,
        })),
        placeholder: $t('content-management.content.typePlaceholder'),
      },
      fieldName: 'type',
      label: $t('content-management.content.type'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.content.coverImagePlaceholder'),
      },
      fieldName: 'coverImage',
      label: $t('content-management.content.coverImage'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('content-management.content.summaryPlaceholder'),
        rows: 3,
      },
      fieldName: 'summary',
      label: $t('content-management.content.summary'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('content-management.content.contentPlaceholder'),
        rows: 6,
      },
      fieldName: 'content',
      label: $t('content-management.content.content'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('content-management.content.sortPlaceholder'),
        style: { width: '100%' },
      },
      fieldName: 'sort',
      label: $t('content-management.content.sort'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: $t('content-management.content.publishedAtPlaceholder'),
        showTime: true,
        style: { width: '100%' },
      },
      fieldName: 'publishedAt',
      label: $t('content-management.content.publishedAt'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: Object.values(ProductContentStatus).map((value) => ({
          label: ProductContentStatusLabels[value],
          value,
        })),
      },
      fieldName: 'status',
      label: $t('content-management.content.status'),
    },
  ];
}
