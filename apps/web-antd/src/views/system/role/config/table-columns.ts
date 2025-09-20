import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Role } from '#/api/system/role';

import { $t } from '#/locales';

/**
 * 角色表格列配置
 * @param onActionClick 操作按钮点击回调
 * @param onStatusChange 状态变更回调
 * @returns 表格列配置数组
 */
export function useColumns<T = Role.View>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '#', type: 'seq', width: 50 },
    {
      field: 'name',
      title: $t('system.role.roleName'),
    },
    {
      field: 'code',
      cellRender: {
        name: 'CellFormatEmpty',
      },
      title: $t('system.role.code'),
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('system.role.status'),
    },
    {
      field: 'remark',
      minWidth: 100,
      title: $t('system.role.remark'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.role.createTime'),
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'more'],
        props: {
          moreOptions: [
            {
              code: 'assignedAuth',
              text: $t('system.role.assignedAuth'),
            },
            {
              code: 'delete',
              text: $t('system.role.delete'),
              disabled: (row: Role.View) => {
                return row.type === 'system';
              },
            },
          ],
        },
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 130,
    },
  ];
}
