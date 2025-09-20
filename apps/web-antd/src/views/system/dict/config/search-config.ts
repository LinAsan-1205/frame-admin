import type { VbenFormProps } from '#/adapter/form';

import { Status } from '#/api/system/dict';
import { $t } from '#/locales';

/**
 * 字典搜索表单配置
 * @returns 字典搜索表单配置对象
 */
export function useDictSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('system.dict.dictNamePlaceholder'),
        },
        fieldName: 'dictName',
        label: $t('system.dict.dictName'),
      },
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('system.dict.dictTypePlaceholder'),
        },
        fieldName: 'dictType',
        label: $t('system.dict.dictType'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: Status.toSelect(),
          placeholder: $t('system.dict.statusPlaceholder'),
        },
        fieldName: 'status',
        label: $t('system.dict.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'createTime',
        label: $t('system.dict.createTime'),
      },
    ],
  };
}

/**
 * 字典数据搜索表单配置
 * @returns 字典数据搜索表单配置对象
 */
export function useDictDataSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('system.dictData.dictLabelPlaceholder'),
        },
        fieldName: 'dictLabel',
        label: $t('system.dictData.dictLabel'),
      },
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('system.dictData.dictValuePlaceholder'),
        },
        fieldName: 'dictValue',
        label: $t('system.dictData.dictValue'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: Status.toSelect(),
          placeholder: $t('system.dictData.statusPlaceholder'),
        },
        fieldName: 'status',
        label: $t('system.dictData.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'createTime',
        label: $t('system.dictData.createTime'),
      },
    ],
  };
}
