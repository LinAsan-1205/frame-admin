import type { VbenFormProps } from '#/adapter/form';

import { getProductCategoryTree } from '#/api/content-management/product-category';
import {
  ProductContentStatus,
  ProductContentStatusLabels,
  ProductContentType,
  ProductContentTypeLabels,
} from '#/api/content-management/product-content';
import { $t } from '#/locales';

/**
 * 产品内容搜索表单配置
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    schema: [
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('content-management.content.titleSearch'),
        },
        fieldName: 'title',
        label: $t('content-management.content.title'),
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
          placeholder: $t('content-management.content.categoryIdSearch'),
          resultField: 'data',
        },
        fieldName: 'categoryId',
        label: $t('content-management.content.categoryId'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: Object.values(ProductContentType).map((value) => ({
            label: ProductContentTypeLabels[value],
            value,
          })),
          placeholder: $t('content-management.content.typeSearch'),
        },
        fieldName: 'type',
        label: $t('content-management.content.type'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: Object.values(ProductContentStatus).map((value) => ({
            label: ProductContentStatusLabels[value],
            value,
          })),
          placeholder: $t('content-management.content.statusSearch'),
        },
        fieldName: 'status',
        label: $t('content-management.content.status'),
      },
    ],
  };
}
