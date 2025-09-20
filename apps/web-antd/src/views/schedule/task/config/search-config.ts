import type { VbenFormProps } from '#/adapter/form';

import { TaskEnabled, TaskStatus, TaskType } from '#/api/schedule/task';
import { $t } from '#/locales';

/**
 * 调度任务搜索表单配置
 * @returns 搜索表单配置对象
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
