import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { Operation } from '#/api/log/operation';

import { OperationStatus, OperationType } from '#/api/log/operation';
import { $t } from '#/locales';

export function userSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    schema: [
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('operationLog.usernamePlaceholder'),
        },
        fieldName: 'username',
        label: $t('operationLog.username'),
      },
      {
        component: 'RadioGroup',
        componentProps: {
          buttonStyle: 'solid',
          options: OperationStatus.toSelect(),
        },
        fieldName: 'status',
        label: $t('operationLog.status'),
      },
    ],
    submitOnChange: true,
  };
}

export function useColumns(
  onActionClick?: OnActionClickFn<Operation.View>,
): VxeTableGridOptions<Operation.View>['columns'] {
  return [
    {
      align: 'center',
      field: 'username',
      title: $t('operationLog.username'),
    },
    {
      align: 'center',
      field: 'module',
      title: $t('operationLog.module'),
    },
    {
      align: 'center',
      field: 'operationType',
      cellRender: {
        name: 'CellTag',
        options: OperationType.toOriginItems(),
      },
      title: $t('operationLog.operationType'),
    },
    {
      align: 'center',
      field: 'description',
      title: $t('operationLog.description'),
    },
    {
      align: 'center',
      field: 'method',
      title: $t('operationLog.method'),
    },
    {
      align: 'center',
      field: 'url',
      title: $t('operationLog.url'),
    },
    {
      align: 'center',
      field: 'params',
      title: $t('operationLog.params'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'result',
      title: $t('operationLog.result'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'ip',
      title: $t('operationLog.ip'),
    },
    {
      align: 'center',
      field: 'userAgent',
      title: $t('operationLog.userAgent'),
    },
    {
      field: 'status',
      cellRender: { name: 'CellTag', options: OperationStatus.toOriginItems() },
      title: $t('operationLog.status'),
      width: 100,
    },
    {
      align: 'center',
      field: 'costTime',
      title: $t('operationLog.costTime'),
    },
    {
      field: 'operationTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('operationLog.operationTime'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'delete',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('common.operation'),
      width: 100,
    },
  ];
}
