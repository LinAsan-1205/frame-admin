import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Session } from '#/api/system/session';

import { useUserStore } from '@vben/stores';

import { DeviceType, SessionStatus } from '#/api/system/session';
import { $t } from '#/locales';

/**
 * 会话表格列配置
 * @param onActionClick 操作按钮点击回调
 * @returns 表格列配置数组
 */
export function useColumns<T = Session.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '#', type: 'seq', width: 50 },
    {
      slots: { default: 'userBlock' },
      field: 'user',
      title: $t('system.session.user'),
    },
    {
      field: 'deviceName',
      title: $t('system.session.deviceName'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'deviceType',
      title: $t('system.session.deviceType'),
      cellRender: {
        name: 'CellTag',
        options: DeviceType.toOriginItems(),
      },
    },
    {
      field: 'ipAddress',
      title: $t('system.session.ipAddress'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'os',
      title: $t('system.session.os'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'status',
      title: $t('system.session.status'),
      cellRender: { name: 'CellTag', options: SessionStatus.toOriginItems() },
    },
    {
      field: 'loginAt',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.session.loginTime'),
    },
    {
      field: 'lastActiveAt',
      title: $t('system.session.lastActiveAt'),
      cellRender: { name: 'CellFormatDate' },
    },
    {
      field: 'logoutAt',
      title: $t('system.session.logoutAt'),
      cellRender: { name: 'CellFormatDate' },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'deviceName',
          nameTitle: $t('system.session.deviceName'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'forceLogout',
            text: $t('system.session.forceLogout'),
            disabled: (row: Session.View) => {
              const userStore = useUserStore();
              return (
                row.status !== SessionStatus.Active ||
                row.userId === userStore.userInfo?.id
              );
            },
          },
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 130,
    },
  ];
}
