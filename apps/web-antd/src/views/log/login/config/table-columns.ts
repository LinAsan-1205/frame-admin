import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { LoginLog } from '#/api/log/login';

import { LoginStatus } from '#/api/log/login';
import { $t } from '#/locales';

/**
 * 登录日志表格列配置
 * @returns 表格列配置数组
 */
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
      field: 'errorMsg',
      title: $t('loginLog.errorMsg'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      titleSuffix: {
        content: $t('loginLog.errorMsgHelper'),
      },
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
