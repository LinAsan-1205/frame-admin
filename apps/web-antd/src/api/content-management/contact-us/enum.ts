import { Enum } from 'enum-plus';

/**
 * 联系类型枚举
 */
export const ContactType = Enum({
  General: { value: '0', label: '一般咨询', color: 'default' },
  Product: { value: '1', label: '产品咨询', color: 'processing' },
  Sales: { value: '2', label: '销售咨询', color: 'success' },
  Support: { value: '3', label: '技术支持', color: 'warning' },
  Cooperation: { value: '4', label: '商务合作', color: 'cyan' },
  Other: { value: '9', label: '其他', color: 'default' },
} as const);
