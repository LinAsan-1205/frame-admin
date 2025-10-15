import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Post } from '#/api/system/post';

import { $t } from '#/locales';

/**
 * 岗位表格列配置
 * @param onActionClick 操作按钮点击回调
 * @param onStatusChange 状态变更回调
 * @returns 表格列配置数组
 */
export function useColumns<T = Post.View>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '#', type: 'seq', width: 50 },
    {
      field: 'postCode',
      title: $t('system.post.postCode'),
      width: 150,
    },
    {
      field: 'postName',
      title: $t('system.post.postName'),
    },
    {
      field: 'dept.name',
      cellRender: {
        name: 'CellFormatEmpty',
      },
      title: $t('system.post.dept'),
    },
    {
      field: 'postSort',
      title: $t('system.post.postSort'),
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('system.post.status'),
    },
    {
      field: 'remark',
      title: $t('system.post.remark'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.post.createTime'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'postName',
          nameTitle: $t('system.post.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.post.operation'),
      width: 130,
    },
  ];
}
