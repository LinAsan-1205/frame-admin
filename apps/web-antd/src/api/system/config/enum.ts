import { Enum } from 'enum-plus';

/**
 * 配置组状态枚举
 */
export const ConfigGroupStatus = Enum({
  Normal: { value: '0', label: '启用' },
  Disabled: { value: '1', label: '禁用' },
} as const);

/**
 * 输入组件类型枚举
 */
export const InputComponentType = Enum({
  Input: { value: 'Input', label: '文本输入框' },
  InputNumber: { value: 'InputNumber', label: '数字输入框' },
  InputPassword: { value: 'InputPassword', label: '密码输入框' },
  Textarea: { value: 'Textarea', label: '多行文本框' },
  Select: { value: 'Select', label: '下拉选择框' },
  Radio: { value: 'Radio', label: '单选框' },
  Checkbox: { value: 'Checkbox', label: '复选框' },
  Switch: { value: 'Switch', label: '开关' },
  DatePicker: { value: 'DatePicker', label: '日期选择器' },
  TimePicker: { value: 'TimePicker', label: '时间选择器' },
  Upload: { value: 'Upload', label: '文件上传' },
  Editor: { value: 'Editor', label: '富文本编辑器' },
  ColorPicker: { value: 'ColorPicker', label: '颜色选择器' },
} as const);
