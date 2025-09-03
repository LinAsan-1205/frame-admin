import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '@vben/locales';

import { FileCategoryStatusEnum } from '#/api/system/file/category';

export function useCategoryFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.fileCategory.name'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.fileCategory.code'),
      rules: 'required',
    },
    {
      component: 'IconPicker',
      fieldName: 'icon',
      label: $t('system.fileCategory.icon'),
    },
    {
      component: 'Input',
      fieldName: 'allowedMimeTypes',
      label: $t('system.fileCategory.allowedMimeTypes'),
      help: $t('system.fileCategory.allowedMimeTypesHelp'),
    },
    {
      component: 'InputNumber',
      fieldName: 'maxFileSize',
      label: $t('system.fileCategory.maxFileSize'),
      help: $t('system.fileCategory.maxFileSizeHelp'),
      componentProps: {
        class: 'w-full',
        min: 0,
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: FileCategoryStatusEnum.toSelect(),
      },
      fieldName: 'status',
      defaultValue: FileCategoryStatusEnum.Normal,
      label: $t('system.fileCategory.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: $t('system.fileCategory.description'),
    },
  ];
}
