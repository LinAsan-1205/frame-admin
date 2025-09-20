import type { VbenFormProps } from '#/adapter/form';

import {
  StorageConfigIsDefault,
  StorageConfigStatus,
  StorageConfigType,
} from '#/api/system/storage/config';
import { $t } from '#/locales';

/**
 * 存储配置搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('system.storageConfig.names'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'code',
        label: $t('system.storageConfig.code'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: StorageConfigType.toSelect(),
        },
        fieldName: 'type',
        label: $t('system.storageConfig.type'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: StorageConfigStatus.toSelect(),
        },
        fieldName: 'status',
        label: $t('system.storageConfig.status'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: StorageConfigIsDefault.toSelect(),
        },
        fieldName: 'isDefault',
        label: $t('system.storageConfig.isDefault'),
      },
      {
        component: 'RangePicker',
        fieldName: 'createTime',
        label: $t('system.storageConfig.createTime'),
      },
    ],
    submitOnChange: true,
  };
}
