import type { VbenFormSchema } from '#/adapter/form';

import { z } from '@vben/common-ui';

import { queryPackageList } from '#/api/system/package';
import { SubscriptionType } from '#/api/system/tenant';
import { $t } from '#/locales';

export function useFormSchema() {
  return z.object({
    tenantName: z
      .string({ required_error: $t('tenant.form.tenantNameRequired') })
      .min(1, { message: $t('tenant.form.tenantNameRequired') }),
    domain: z.string().optional(),
    phone: z
      .string({ required_error: $t('tenant.form.phoneRequired') })
      .min(11, { message: $t('tenant.form.phoneRequired') }),
    email: z
      .string({ required_error: $t('tenant.form.emailInvalid') })
      .email({ message: $t('tenant.form.emailInvalid') }),
    password: z
      .string()
      .min(6, { message: $t('tenant.form.passwordRequired') })
      .optional(),
    subscriptionType: z
      .string({ required_error: $t('tenant.form.subscriptionTypeRequired') })
      .min(1, { message: $t('tenant.form.subscriptionTypeRequired') }),
    fixedPeriodDays: z.number().min(1).optional(),
    expireTime: z.string().optional(),
    packageId: z.number().optional(),
    remark: z.string().optional(),
  });
}

export function useFormSchemaConfig(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('tenant.form.tenantNamePlaceholder'),
      },
      fieldName: 'tenantName',
      label: $t('tenant.form.tenantName'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('tenant.form.domainPlaceholder'),
      },
      fieldName: 'domain',
      label: $t('tenant.form.domain'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('tenant.form.phonePlaceholder'),
      },
      fieldName: 'phone',
      label: $t('tenant.form.phone'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('tenant.form.emailPlaceholder'),
      },
      fieldName: 'email',
      label: $t('tenant.form.email'),
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: $t('tenant.form.passwordPlaceholder'),
      },
      dependencies: {
        show: (values) => {
          return !values.id;
        },
        triggerFields: ['id'],
      },
      fieldName: 'password',
      label: $t('tenant.form.password'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: SubscriptionType.toSelect(),
        placeholder: $t('tenant.form.subscriptionTypePlaceholder'),
      },
      defaultValue: SubscriptionType.OneYear,
      fieldName: 'subscriptionType',
      label: $t('tenant.form.subscriptionType'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: $t('tenant.form.fixedPeriodDaysPlaceholder'),
      },
      dependencies: {
        show: (values) => values.subscriptionType === '2',
        triggerFields: ['subscriptionType'],
      },
      fieldName: 'fixedPeriodDays',
      label: $t('tenant.form.fixedPeriodDays'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        placeholder: $t('tenant.form.expireTimePlaceholder'),
        showTime: true,
      },
      dependencies: {
        show: (values) => values.subscriptionType !== '3',
        triggerFields: ['subscriptionType'],
      },
      fieldName: 'expireTime',
      label: $t('tenant.form.expireTime'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: queryPackageList,
        labelField: 'packageName',
        valueField: 'id',
        placeholder: $t('tenant.form.packagePlaceholder'),
      },
      fieldName: 'packageId',
      label: $t('tenant.form.package'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('tenant.form.remarkPlaceholder'),
        rows: 3,
      },
      fieldName: 'remark',
      label: $t('common.remark'),
    },
  ];
}
