import type { VbenFormSchema } from '@vben/common-ui';

import { z } from '@vben/common-ui';

import { $t } from '#/locales';

export function useFormSchema() {
  return z.object({
    packageName: z
      .string({ required_error: $t('tenant.package.form.packageNameRequired') })
      .min(1, { message: $t('tenant.package.form.packageNameRequired') }),
    price: z
      .number({ required_error: $t('tenant.package.form.priceRequired') })
      .min(0, { message: $t('tenant.package.form.priceRequired') }),
    originalPrice: z
      .number({ required_error: $t('tenant.package.form.originalPriceRequired') })
      .min(0, { message: $t('tenant.package.form.originalPriceRequired') }),
    description: z.string().optional(),
    menuIds: z.array(z.number()).default([]),
    remark: z.string().optional(),
  });
}

export function useFormSchemaConfig() {
  return (): VbenFormSchema[] => [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('tenant.package.form.packageNamePlaceholder'),
      },
      fieldName: 'packageName',
      label: $t('tenant.package.form.packageName'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('tenant.package.form.pricePlaceholder'),
        precision: 2,
      },
      fieldName: 'price',
      label: $t('tenant.package.form.price'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('tenant.package.form.originalPricePlaceholder'),
        precision: 2,
      },
      fieldName: 'originalPrice',
      label: $t('tenant.package.form.originalPrice'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('tenant.package.form.descriptionPlaceholder'),
        rows: 3,
      },
      fieldName: 'description',
      label: $t('tenant.package.form.description'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('tenant.package.form.remarkPlaceholder'),
        rows: 3,
      },
      fieldName: 'remark',
      label: $t('common.remark'),
    },
  ];
}