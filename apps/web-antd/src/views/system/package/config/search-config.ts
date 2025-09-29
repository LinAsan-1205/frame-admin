import type { VbenFormProps } from '@vben/common-ui';

import { $t } from '#/locales';

export function useSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    collapsedRows: 1,
    schema: [
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('tenant.package.form.packageName'),
        },
        fieldName: 'packageName',
        label: $t('tenant.package.form.packageName'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: [
            { label: $t('tenant.package.status.normal'), value: '0' },
            { label: $t('tenant.package.status.disabled'), value: '1' },
          ],
          placeholder: $t('tenant.package.form.status'),
        },
        fieldName: 'status',
        label: $t('tenant.package.form.status'),
      },
    ],
    showDefaultActions: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
}