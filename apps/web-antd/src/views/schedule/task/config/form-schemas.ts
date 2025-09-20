import type { VbenFormSchema } from '#/adapter/form';

import { TaskType } from '#/api/schedule/task';
import { $t } from '#/locales';

/**
 * 调度任务表单配置
 * @returns 表单schema配置数组
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