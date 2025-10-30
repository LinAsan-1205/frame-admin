import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { JoinUs } from '#/api/content-management/join-us';

import { JobStatus, JobType } from '#/api/content-management/join-us';
import { $t } from '#/locales';

/**
 * 招聘职位表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = JoinUs.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 60,
    },
    {
      type: 'seq',
      width: 60,
    },
    {
      field: 'title',
      minWidth: 200,
      title: $t('content-management.joinUs.jobTitle'),
    },
    {
      field: 'department',
      title: $t('content-management.joinUs.department'),
      width: 150,
    },
    {
      field: 'location',
      title: $t('content-management.joinUs.location'),
      width: 150,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: JobType.toOriginItems(),
      },
      field: 'type',
      title: $t('content-management.joinUs.type'),
      width: 120,
    },
    {
      field: 'salaryRange',
      title: $t('content-management.joinUs.salaryRange'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      width: 130,
    },
    {
      field: 'headcount',
      title: $t('content-management.joinUs.headcount'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      width: 100,
    },
    {
      field: 'sort',
      title: $t('content-management.joinUs.sort'),
      width: 80,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: JobStatus.toOriginItems(),
      },
      field: 'status',
      title: $t('content-management.joinUs.status'),
      width: 100,
    },
    {
      cellRender: { name: 'CellFormatDate' },
      field: 'publishedAt',
      title: $t('content-management.joinUs.publishedAt'),
      width: 180,
    },
    {
      cellRender: { name: 'CellFormatDate' },
      field: 'deadline',
      title: $t('content-management.joinUs.deadline'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('content-management.joinUs.jobTitle'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: $t('common.edit'),
          },
          {
            code: 'delete',
            text: $t('common.delete'),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.action'),
      width: 160,
    },
  ];
}

