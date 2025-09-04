import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Task } from '#/api/schedule/task';

import { TaskEnabled, TaskStatus, TaskType } from '#/api/schedule/task';
import { $t } from '#/locales';

/**
 * 获取表单配置
 * @returns 表单配置
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('schedule.task.name'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: $t('schedule.task.description'),
    },
    {
      component: 'Select',
      componentProps: {
        options: TaskType.toSelect(),
      },
      fieldName: 'type',
      label: $t('schedule.task.type'),
      rules: 'required',
      defaultValue: TaskType.Cron,
    },

    {
      component: 'Input',
      fieldName: 'processor',
      label: $t('schedule.task.processor'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'cronExpression',
      label: $t('schedule.task.cronExpression'),
      defaultValue: '0 0 0 * * ?',
      dependencies: {
        show: (values) => {
          return values.type === TaskType.Cron;
        },
        triggerFields: ['type'],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'interval',
      label: $t('schedule.task.interval'),
      defaultValue: 1000,
      dependencies: {
        show: (values) => {
          return values.type === TaskType.Interval;
        },
        triggerFields: ['type'],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'maxRetry',
      label: $t('schedule.task.maxRetry'),
      defaultValue: 3,
    },
    {
      component: 'InputNumber',
      fieldName: 'timeout',
      label: $t('schedule.task.timeout'),
      defaultValue: 30_000,
    },
    {
      component: 'Textarea',
      fieldName: 'params',
      label: $t('schedule.task.params'),
    },
  ];
}

/**
 * 获取搜索表单配置
 * @returns 搜索表单配置
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('schedule.task.name'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'description',
        label: $t('schedule.task.description'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: TaskType.toSelect(),
        },
        fieldName: 'type',
        label: $t('schedule.task.type'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: TaskStatus.toSelect(),
        },
        fieldName: 'status',
        label: $t('schedule.task.status'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: TaskEnabled.toSelect(),
        },
        fieldName: 'enabled',
        label: $t('schedule.task.enabled'),
      },
      {
        component: 'RangePicker',
        fieldName: 'createTime',
        label: $t('common.createTime'),
      },
    ],
  };
}

/**
 * 获取表格列配置
 * @param onActionClick 操作点击回调
 * @param onStatusChange 状态改变回调
 * @returns 表格列配置
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
