import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function useSearchFormOptions(): VbenFormProps {
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

export function useColumns(): VxeTableGridOptions['columns'] {
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
      title: $t('schedule.log.startTime'),
    },
    {
      field: 'endTime',
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
