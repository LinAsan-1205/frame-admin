import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Task } from '#/api/schedule/task';

import { TaskType } from '#/api/schedule/task';
import { $t } from '#/locales';

/**
 * 调度任务表格列配置
 * @param onActionClick 操作点击回调
 * @param onStatusChange 状态改变回调
 * @returns 表格列配置数组
 */
export function useColumns<T = Task.View>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '#', type: 'seq', width: 50 },
    {
      field: 'name',
      title: $t('schedule.task.name'),
    },
    {
      field: 'description',
      title: $t('schedule.task.description'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'type',
      title: $t('schedule.task.type'),
      cellRender: {
        name: 'CellTag',
        options: TaskType.toOriginItems(),
      },
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('schedule.task.status'),
    },
    {
      field: 'processor',
      title: $t('schedule.task.processor'),
    },
    {
      field: 'executeCount',
      title: $t('schedule.task.executeCount'),
    },
    {
      field: 'successCount',
      title: $t('schedule.task.successCount'),
    },
    {
      field: 'failCount',
      title: $t('schedule.task.failCount'),
    },
    {
      field: 'lastExecuteTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('schedule.task.lastExecuteTime'),
    },
    {
      field: 'nextExecuteTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('schedule.task.nextExecuteTime'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('schedule.task.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'more'],
        props: {
          moreOptions: [
            {
              code: 'execute',
              text: $t('schedule.task.execute'),
            },
            {
              code: 'executionLog',
              text: $t('schedule.task.executionLog'),
            },
            {
              code: 'delete',
              text: $t('schedule.task.delete'),
            },
          ],
        },
      },
      field: 'operation',
      fixed: 'right',
      title: $t('schedule.task.operation'),
      width: 150,
    },
  ];
}
