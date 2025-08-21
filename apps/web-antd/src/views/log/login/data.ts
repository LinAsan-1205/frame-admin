import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { LoginLog } from '#/api/log/login';

import { LoginStatus } from '#/api/log/login';
import { $t } from '#/locales';

export function userSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    fieldMappingTime: [['loginTime', ['createFormDate', 'createToDate']]],
    schema: [
      {
        component: 'Input',
        fieldName: 'username',
        label: $t('loginLog.username'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'behavior',
        label: $t('loginLog.behavior'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'ip',
        label: $t('loginLog.ip'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: LoginStatus.toSelect(),
        },
        fieldName: 'status',
        label: $t('loginLog.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'loginTime',
        label: $t('loginLog.loginTime'),
      },
    ],
    submitOnChange: true,
  };
}

export function useColumns(): VxeTableGridOptions<LoginLog.View>['columns'] {
  return [
    { align: 'center', type: 'checkbox', width: 100 },
    { title: '#', type: 'seq', width: 50 },
    {
      field: 'loginTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('loginLog.loginTime'),
    },
    {
      align: 'center',
      field: 'username',
      title: $t('loginLog.username'),
    },
    {
      align: 'center',
      field: 'behavior',
      title: $t('loginLog.behavior'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'status',
      cellRender: {
        name: 'CellTag',
        options: LoginStatus.toOriginItems(),
      },
      title: $t('loginLog.status'),
      width: 100,
    },
    {
      align: 'center',
      field: 'ip',
      title: $t('loginLog.ip'),
    },
    {
      align: 'center',
      field: 'address',
      title: $t('loginLog.address'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'browser',
      title: $t('loginLog.browser'),
    },
    {
      align: 'center',
      field: 'os',
      title: $t('loginLog.os'),
    },
  ];
}
