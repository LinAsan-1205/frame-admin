import type { VbenFormProps } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Session } from '#/api/system/session';

import { useUserStore } from '@vben/stores';

import {
  ActiveStatus,
  DeviceType,
  PlatformType,
  SessionStatus,
} from '#/api/system/session';
import { $t } from '#/locales';

/**
 * 搜索表单配置
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['loginTime', ['startTime', 'endTime']]],
    submitOnChange: true,
    schema: [
      {
        component: 'InputNumber',
        fieldName: 'userId',
        label: $t('system.session.userId'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'deviceId',
        label: $t('system.session.deviceId'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: PlatformType.toSelect(),
        },
        fieldName: 'platform',
        label: $t('system.session.platform'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: DeviceType.toSelect(),
        },
        fieldName: 'deviceType',
        label: $t('system.session.deviceType'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: ActiveStatus.toSelect(),
        },
        fieldName: 'isActive',
        label: $t('system.session.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'loginTime',
        label: $t('system.session.loginTime'),
      },
    ],
  };
}

/**
 * 表格列配置
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
