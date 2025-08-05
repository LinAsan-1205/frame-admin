import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { LoginLog } from '#/api/log/login';

import { LoginStatus } from '#/api/log/login';
import { $t } from '#/locales';

export function userSearchFormOptions(): VbenFormProps {
  return {
    collapsed: true,
    fieldMappingTime: [['loginTime', ['createFormDate', 'createToDate']]],
    schema: [
      {
        component: 'Input',
        fieldName: 'username',
        label: $t('loginLog.username'),
      },
      {
        component: 'Input',
        fieldName: 'ip',
        label: $t('loginLog.ip'),
      },
      {
        component: 'RadioGroup',
        componentProps: {
          buttonStyle: 'solid',
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
    {
      align: 'center',
      field: 'username',
      title: $t('loginLog.username'),
    },
    {
      align: 'center',
      field: 'ip',
      title: $t('loginLog.ip'),
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
      field: 'loginTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('loginLog.loginTime'),
    },
  ];
}
