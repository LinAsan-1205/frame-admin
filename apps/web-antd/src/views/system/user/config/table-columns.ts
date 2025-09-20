import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { User } from '#/api/system/user';

import { Sex, Status, UserType } from '#/api/system/user/enum';
import { $t } from '#/locales';

/**
 * 用户表格列配置
 * @param onActionClick 操作按钮点击回调
 * @returns 表格列配置数组
 */
export function useColumns<T = User.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      slots: { default: 'userBlock' },
      field: 'userBlock',
      title: $t('system.user.userBlock'),
      showOverflow: false,
      width: 140,
    },
    {
      field: 'userName',
      title: $t('system.user.userName'),
      cellRender: {
        name: 'CellCopyText',
      },
      width: 200,
    },

    {
      field: 'userType',
      cellRender: {
        name: 'CellTag',
        options: UserType.toOriginItems(),
      },
      title: $t('system.user.userType'),
      width: 140,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      cellRender: {
        name: 'CellCopyText',
      },
      width: 200,
    },

    {
      field: 'sex',
      cellRender: {
        name: 'CellTag',
        options: Sex.toOriginItems(),
      },
      title: $t('system.user.sex'),
      width: 140,
    },
    {
      field: 'dept.name',
      title: $t('system.user.dept'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      width: 200,
    },
    {
      slots: { default: 'rolesBlock' },
      field: 'roles',
      title: $t('system.user.roles'),
      showOverflow: false,
      width: 140,
    },
    {
      field: 'status',
      cellRender: {
        name: 'CellTag',
        options: Status.toOriginItems(),
      },
      title: $t('system.user.status'),
      width: 140,
    },
    {
      field: 'remark',
      title: $t('system.user.remark'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      minWidth: 200,
    },
    {
      field: 'loginIp',
      cellRender: {
        name: 'CellFormatEmpty',
      },
      title: $t('system.user.loginIp'),
      width: 140,
    },
    {
      field: 'loginDate',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.user.loginDate'),
      width: 156,
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.user.createTime'),
      width: 156,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'userName',
          nameTitle: $t('system.user.userName'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: $t('common.edit'),
            disabled: (row: User.View) => {
              return row.userType === UserType.Admin;
            },
          },
          'more',
        ],
        props: {
          moreDisabled: (row: User.View) => {
            return row.userType === UserType.Admin;
          },
          moreOptions: [
            {
              code: 'delete',
              text: $t('system.user.deleteUser'),
              disabled: (row: User.View) => {
                return row.userType === UserType.Admin;
              },
            },
            {
              code: 'assignedRole',
              text: $t('system.user.assignedRole'),
              disabled: (row: User.View) => {
                return row.userType === UserType.Admin;
              },
            },
            {
              code: 'initializePassword',
              text: $t('system.user.initializePassword'),
              disabled: (row: User.View) => {
                return row.userType === UserType.Admin;
              },
            },
          ],
        },
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 130,
    },
  ];
}
