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
          placeholder: $t('tenant.form.tenantName'),
        },
        fieldName: 'tenantName',
        label: $t('tenant.form.tenantName'),
      },
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('tenant.form.domain'),
        },
        fieldName: 'domain',
        label: $t('tenant.form.domain'),
      },
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('tenant.form.phone'),
        },
        fieldName: 'phone',
        label: $t('tenant.form.phone'),
      },
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('tenant.form.email'),
        },
        fieldName: 'email',
        label: $t('tenant.form.email'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: [
            { label: $t('tenant.status.normal'), value: '0' },
            { label: $t('tenant.status.disabled'), value: '1' },
            { label: $t('tenant.status.expired'), value: '2' },
          ],
          placeholder: $t('tenant.form.status'),
        },
        fieldName: 'status',
        label: $t('tenant.form.status'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: [
            { label: $t('tenant.subscription.oneYear'), value: '1' },
            { label: $t('tenant.subscription.fixedPeriod'), value: '2' },
            { label: $t('tenant.subscription.permanent'), value: '3' },
          ],
          placeholder: $t('tenant.form.subscriptionType'),
        },
        fieldName: 'subscriptionType',
        label: $t('tenant.form.subscriptionType'),
      },
    ],
    showDefaultActions: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
}