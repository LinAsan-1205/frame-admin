import type { VbenFormProps } from '#/adapter/form';

import { $t } from '#/locales';

/**
 * 产品分类搜索表单配置
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    schema: [
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('content-management.category.nameSearch'),
        },
        fieldName: 'name',
        label: $t('content-management.category.name'),
      },
    ],
  };
}
