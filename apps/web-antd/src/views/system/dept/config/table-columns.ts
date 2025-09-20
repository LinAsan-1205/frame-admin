import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { Dept } from '#/api/system/dept';

import { Status } from '#/api/system/dept';
import { $t } from '#/locales';

/**
 * 部门表格列配置
 * @param onActionClick 操作按钮点击回调
 * @returns 表格列配置数组
 */
export function useColumns(
  onActionClick?: OnActionClickFn<Dept.View>,
): VxeTableGridOptions<Dept.View>['columns'] {
  return [
    { title: '#', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'center',
      field: 'name',
      fixed: 'left',
      title: $t('system.dept.deptName'),
      treeNode: true,
    },
    {
      align: 'center',
      field: 'leader',
      title: $t('system.dept.leader'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'phone',
      title: $t('system.dept.phone'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'email',
      title: $t('system.dept.email'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      cellRender: { name: 'CellTag', options: Status.toOriginItems() },
      field: 'status',
      title: $t('system.dept.status'),
      width: 100,
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.dept.createTime'),
    },
    {
      field: 'remark',
      title: $t('system.dept.remark'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
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
          {
            code: 'append',
            text: '新增下级',
          },
          'edit',
          {
            code: 'delete',
            disabled: (row: Dept.View) => {
              return !!(row.children && row.children.length > 0);
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.dept.operation'),
      width: 200,
    },
  ];
}
