import type { VbenFormProps } from '#/adapter/form';

import { $t } from '#/locales';

/**
 * 调度日志搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['startTime', ['createFormDate', 'createToDate']]],
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
      {
        component: 'RangePicker',
        fieldName: 'startTime',
        label: $t('schedule.log.executionTime'),
      },
    ],
  };
}