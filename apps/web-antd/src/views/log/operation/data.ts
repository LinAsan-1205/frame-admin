import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { Operation } from '#/api/log/operation';

import { $t } from '#/locales';

export function userSearchFormOptions(): VbenFormProps {
  return {
    collapsed: true,
    schema: [
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('operationLog.usernamePlaceholder'),
        },
        fieldName: 'username',
        label: $t('operationLog.username'),
      },
      {
        component: 'RadioGroup',
        componentProps: {
          buttonStyle: 'solid',
          options: [
            { label: $t('common.all'), value: undefined },
            { label: $t('common.success'), value: '0' },
            { label: $t('common.failed'), value: '1' },
          ],
        },
        fieldName: 'status',
        label: $t('operationLog.status'),
      },
    ],
    submitOnChange: true,
  };
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
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
    },
    {
      align: 'center',
      field: 'result',
      title: $t('operationLog.result'),
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
      slots: { default: 'status' },
      title: $t('loginLog.status'),
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
