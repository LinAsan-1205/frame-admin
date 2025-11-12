import type { Ref } from 'vue';

import type { VbenFormSchema } from '#/adapter/form';
import type { StorageConfig } from '#/api/system/storage/config';

import { z } from '#/adapter/form';
import {
  StorageConfigIsDefault,
  StorageConfigType,
} from '#/api/system/storage/config';
import { $t } from '#/locales';

/**
 * 存储配置表单配置
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 * @param formData 表单数据引用
 * @returns 存储配置表单字段配置数组
 */
export function useFormSchema(
  formData: Ref<StorageConfig.View | undefined>,
): VbenFormSchema[] {
  return [
    {
      component: 'RadioGroup',
      componentProps: {
        options: StorageConfigType.toSelect(),
      },
      defaultValue: StorageConfigType.Local,
      fieldName: 'type',
      label: $t('system.storageConfig.type'),
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.storageConfig.names'),
      rules: 'required',
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.storageConfig.code'),
      rules: 'required',
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'storagePath',
      label: $t('system.storageConfig.storagePath'),
      dependencies: {
        show: (values) => {
          return values.type === StorageConfigType.Local;
        },
        triggerFields: ['type'],
      },
      rules: z.string().nonempty($t('ui.formRules.required')),
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'accessPath',
      label: $t('system.storageConfig.accessPath'),
      dependencies: {
        show: (values) => {
          return values.type === StorageConfigType.Local;
        },
        triggerFields: ['type'],
      },
      rules: z
        .string()
        .nonempty($t('ui.formRules.required'))
        .regex(/^[\w/]+$/, $t('ui.formRules.invalid')),
    },

    {
      component: 'Input',
      fieldName: 'accessKey',
      label: $t('system.storageConfig.accessKey'),
      dependencies: {
        show: (values) => {
          return values.type === StorageConfigType.OSS;
        },
        triggerFields: ['type'],
      },
      rules: 'required',
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'secretKey',
      label: $t('system.storageConfig.secretKey'),
      dependencies: {
        show: (values) => {
          return values.type === StorageConfigType.OSS;
        },
        triggerFields: ['type'],
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'bucket',
      label: $t('system.storageConfig.bucket'),
      dependencies: {
        show: (values) => {
          return values.type === StorageConfigType.OSS;
        },
        triggerFields: ['type'],
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'endpoint',
      label: $t('system.storageConfig.endpoint'),
      dependencies: {
        show: (values) => {
          return values.type === StorageConfigType.OSS;
        },
        triggerFields: ['type'],
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'domain',
      label: $t('system.storageConfig.domain'),
      dependencies: {
        show: (values) => {
          return values.type === StorageConfigType.OSS;
        },
        triggerFields: ['type'],
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: StorageConfigIsDefault.toSelect(),
      },
      defaultValue: StorageConfigIsDefault.No,
      fieldName: 'isDefault',
      label: $t('system.storageConfig.isDefault'),
      dependencies: {
        show: () => {
          return !formData.value?.id;
        },
        triggerFields: ['type'],
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
        class: 'w-full',
      },
      fieldName: 'sort',
      defaultValue: 0,
      label: $t('system.storageConfig.sort'),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
        class: 'w-full',
      },
      fieldName: 'description',
      label: $t('system.storageConfig.description'),
      rules: z
        .string()
        .max(
          50,
          $t('ui.formRules.maxLength', [
            $t('system.storageConfig.description'),
            50,
          ]),
        )
        .optional(),
    },
  ];
}
