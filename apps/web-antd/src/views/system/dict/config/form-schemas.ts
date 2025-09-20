import type { VbenFormSchema } from '#/adapter/form';

import { Status } from '#/api/system/dict';
import { $t } from '#/locales';

/**
 * 字典表单配置
 * @returns 字典表单字段配置数组
 */
export function useDictFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'dictName',
      label: $t('system.dict.dictName'),
      rules: 'required',
      componentProps: {
        allowClear: true,
        placeholder: $t('system.dict.dictNamePlaceholder'),
      },
    },
    {
      component: 'Input',
      fieldName: 'dictType',
      label: $t('system.dict.dictType'),
      rules: 'required',
      componentProps: {
        allowClear: true,
        placeholder: $t('system.dict.dictTypePlaceholder'),
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: Status.toSelect(),
      },
      defaultValue: Status.Normal,
      fieldName: 'status',
      label: $t('system.dict.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.dict.remark'),
      componentProps: {
        allowClear: true,
        placeholder: $t('system.dict.remarkPlaceholder'),
        rows: 3,
      },
    },
  ];
}

/**
 * 字典数据表单配置
 * @returns 字典数据表单字段配置数组
 */
export function useDictDataFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'dictLabel',
      label: $t('system.dictData.dictLabel'),
      rules: 'required',
      componentProps: {
        allowClear: true,
        placeholder: $t('system.dictData.dictLabelPlaceholder'),
      },
    },
    {
      component: 'Input',
      fieldName: 'dictValue',
      label: $t('system.dictData.dictValue'),
      rules: 'required',
      componentProps: {
        allowClear: true,
        placeholder: $t('system.dictData.dictValuePlaceholder'),
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'dictSort',
      label: $t('system.dictData.dictSort'),
      defaultValue: 0,
      componentProps: {
        min: 0,
        placeholder: $t('system.dictData.dictSortPlaceholder'),
        style: 'width: 100%',
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: Status.toSelect(),
      },
      defaultValue: Status.Normal,
      fieldName: 'status',
      label: $t('system.dictData.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.dictData.remark'),
      componentProps: {
        allowClear: true,
        placeholder: $t('system.dictData.remarkPlaceholder'),
        rows: 3,
      },
    },
  ];
}
