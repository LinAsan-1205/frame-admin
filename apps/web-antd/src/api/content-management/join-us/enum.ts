import { Enum } from 'enum-plus';

/**
 * 职位类型枚举
 */
export const JobType = Enum({
  FullTime: { value: 'full-time', label: '全职', color: 'processing' },
  PartTime: { value: 'part-time', label: '兼职', color: 'warning' },
  Contract: { value: 'contract', label: '合同工', color: 'default' },
  Internship: { value: 'internship', label: '实习', color: 'cyan' },
} as const);

/**
 * 招聘状态枚举
 */
export const JobStatus = Enum({
  Show: { value: '1', label: '启用', color: 'success' },
  Hide: { value: '0', label: '禁用', color: 'error' },
} as const);
