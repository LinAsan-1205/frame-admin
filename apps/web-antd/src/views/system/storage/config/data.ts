import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { StorageConfig } from '#/api/system/storage/config';

import { z } from '#/adapter/form';
import {
  StorageConfigIsDefault,
  StorageConfigStatus,
  StorageConfigType,
} from '#/api/system/storage/config';
import { $t } from '#/locales';

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
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
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.storageConfig.code'),
      rules: 'required',
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
      rules: z
        .string()
        .nonempty($t('ui.formRules.required'))
        .regex(/^[\w/]+$/, $t('ui.formRules.invalid')),
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

export function userSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('system.storageConfig.names'),
      },
      {
        component: 'Input',
        fieldName: 'code',
        label: $t('system.storageConfig.code'),
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

export function useColumns<T = StorageConfig.View>(
  onActionClick?: OnActionClickFn<T>,
  onIsDefaultChange?: (
    newStatus: any,
    row: T,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<T>['columns'] {
  return [
    {
      align: 'center',
      field: 'name',
      title: $t('system.storageConfig.names'),
    },
    {
      align: 'center',
      field: 'code',
      title: $t('system.storageConfig.code'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      cellRender: {
        name: 'CellTag',
        options: StorageConfigType.toOriginItems(),
      },
      field: 'type',
      title: $t('system.storageConfig.type'),
      width: 100,
    },

    {
      align: 'center',
      field: 'storagePath',
      title: $t('system.storageConfig.storagePath'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'accessPath',
      title: $t('system.storageConfig.accessPath'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'accessKey',
      title: $t('system.storageConfig.accessKey'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'secretKey',
      title: $t('system.storageConfig.secretKey'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'bucket',
      title: $t('system.storageConfig.bucket'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'endpoint',
      title: $t('system.storageConfig.endpoint'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'domain',
      title: $t('system.storageConfig.domain'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },

    {
      field: 'description',
      title: $t('system.storageConfig.description'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      cellRender: {
        name: 'CellTag',
        options: StorageConfigStatus.toOriginItems(),
      },
      field: 'status',
      title: $t('system.storageConfig.status'),
      width: 100,
    },
    {
      cellRender: {
        attrs: { beforeChange: onIsDefaultChange },
        name: 'CellSwitch',
        props: {
          checkedValue: StorageConfigIsDefault.Yes,
          unCheckedValue: StorageConfigIsDefault.No,
          checkedChildren: $t('system.storageConfig.isDefaultText'),
          inactiveText: $t('system.storageConfig.notDefaultText'),
        },
      },
      field: 'isDefault',
      title: $t('system.storageConfig.isDefault'),
      width: 100,
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.storageConfig.createTime'),
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.dept.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
          {
            code: 'delete',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.dept.operation'),
      width: 120,
    },
  ];
}
