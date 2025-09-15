import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Dict, DictData } from '#/api/system/dict';

import { Status } from '#/api/system/dict';
import { $t } from '#/locales';

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

export function useDictColumns<T = Dict.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('common.index'),
    },
    {
      field: 'dictName',
      title: $t('system.dict.dictName'),
      minWidth: 120,
    },
    {
      field: 'dictType',
      title: $t('system.dict.dictType'),
      minWidth: 120,
    },
    {
      field: 'status',
      title: $t('system.dict.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: Status.toOriginItems(),
      },
    },
    {
      field: 'remark',
      title: $t('system.dict.remark'),
      minWidth: 150,
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      width: 180,
      cellRender: { name: 'CellFormatDate' },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'dictName',
          nameTitle: $t('system.dict.dictName'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: $t('common.edit'),
          },
          {
            code: 'delete',
            text: $t('common.delete'),
          },
        ],
      },
      field: 'actions',
      fixed: 'right',
      title: $t('common.action'),
      width: 160,
    },
  ];
}

export function useDictDataColumns<T = DictData.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('common.index'),
    },
    {
      field: 'dictLabel',
      title: $t('system.dictData.dictLabel'),
      minWidth: 120,
    },
    {
      field: 'dictValue',
      title: $t('system.dictData.dictValue'),
      minWidth: 120,
    },
    {
      field: 'dictSort',
      title: $t('system.dictData.dictSort'),
      width: 100,
    },
    {
      field: 'status',
      title: $t('system.dictData.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: Status.toOriginItems(),
      },
    },
    {
      field: 'remark',
      title: $t('system.dictData.remark'),
      minWidth: 150,
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      width: 180,
      cellRender: { name: 'CellFormatDate' },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'dictLabel',
          nameTitle: $t('system.dictData.dictLabel'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: $t('common.edit'),
          },
          {
            code: 'delete',
            text: $t('common.delete'),
          },
        ],
      },
      field: 'actions',
      fixed: 'right',
      title: $t('common.action'),
      width: 160,
    },
  ];
}
