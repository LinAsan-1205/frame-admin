import { Enum } from 'enum-plus';

/**
 * 任务类型
 */
export const TaskType = Enum({
  Cron: { value: 'cron', label: 'Cron任务', color: 'processing' },
  Interval: { value: 'interval', label: '间隔任务', color: 'success' },
} as const);

/**
 * 任务状态
 */
export const TaskStatus = Enum({
  Normal: { value: '0', label: '正常', color: 'processing' },
  Paused: { value: '1', label: '暂停', color: 'error' },
} as const);

/**
 * 任务执行状态
 */
export const TaskExecuteStatus = Enum({
  Pending: { value: '0', label: '待执行' },
  Running: { value: '1', label: '执行中' },
  Success: { value: '2', label: '执行成功' },
  Failed: { value: '3', label: '执行失败' },
} as const);

/**
 * 任务是否启用
 */
export const TaskEnabled = Enum({
  Enabled: { value: '0', label: '启用' },
  Disabled: { value: '1', label: '禁用' },
} as const);
