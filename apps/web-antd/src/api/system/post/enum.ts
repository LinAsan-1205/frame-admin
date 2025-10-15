import { Enum } from 'enum-plus';

/**
 * 岗位状态
 */
export const PostStatus = Enum({
  Normal: { value: '0', label: '正常', color: 'success' },
  Stop: { value: '1', label: '停用', color: 'error' },
} as const);
