import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

/**
 * 执行日志搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useExecutionLogSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        fieldName: 'taskName',
        label: $t('schedule.log.taskName'),
        componentProps: {
          allowClear: true,
        },
      },
    ],
  };
}

/**
 * 执行日志表格列配置
 * @returns 表格列配置数组
 */
export function useExecutionLogColumns(): VxeTableGridOptions['columns'] {
  return [
    { title: '#', type: 'seq', width: 50 },
    {
      field: 'taskName',
      title: $t('schedule.log.taskName'),
    },
    {
      field: 'error',
      cellRender: {
        name: 'CellFormatEmpty',
      },
      title: $t('schedule.log.error'),
    },
    {
      field: 'startTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('schedule.log.startTime'),
    },
    {
      field: 'endTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('schedule.log.endTime'),
    },
    {
      field: 'duration',
      title: $t('schedule.log.duration'),
    },
    {
      field: 'result',
      title: $t('schedule.log.result'),
    },
    {
      field: 'retryCount',
      title: $t('schedule.log.retryCount'),
    },
  ];
}
