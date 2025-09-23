import { Enum } from 'enum-plus';

/**
 * 表单类型枚举
 */
export const FormType = Enum({
  Input: { value: 'Input', label: '文本框' },
  Textarea: { value: 'Textarea', label: '文本域' },
  InputNumber: { value: 'InputNumber', label: '数字框' },
  Select: { value: 'Select', label: '下拉框' },
  RadioGroup: { value: 'RadioGroup', label: '单选框' },
  CheckboxGroup: { value: 'CheckboxGroup', label: '复选框' },
  DatePicker: { value: 'DatePicker', label: '日期选择' },
  DateRangePicker: { value: 'DateRangePicker', label: '日期范围' },
  TimePicker: { value: 'TimePicker', label: '时间选择' },
  Switch: { value: 'Switch', label: '开关' },
  Upload: { value: 'Upload', label: '文件上传' },
  ApiSelect: { value: 'ApiSelect', label: '远程下拉' },
  ApiTreeSelect: { value: 'ApiTreeSelect', label: '树形选择' },
  ApiCascader: { value: 'ApiCascader', label: '级联选择' },
  IconPicker: { value: 'IconPicker', label: '图标选择' },
} as const);

/**
 * 查询类型枚举
 */
export const QueryType = Enum({
  EQ: { value: 'EQ', label: '等于' },
  NE: { value: 'NE', label: '不等于' },
  GT: { value: 'GT', label: '大于' },
  GTE: { value: 'GTE', label: '大于等于' },
  LT: { value: 'LT', label: '小于' },
  LTE: { value: 'LTE', label: '小于等于' },
  LIKE: { value: 'LIKE', label: '模糊' },
  NOT_LIKE: { value: 'NOT_LIKE', label: '不包含' },
  IN: { value: 'IN', label: '包含' },
  NOT_IN: { value: 'NOT_IN', label: '不包含' },
  BETWEEN: { value: 'BETWEEN', label: '范围' },
  IS_NULL: { value: 'IS_NULL', label: '为空' },
  IS_NOT_NULL: { value: 'IS_NOT_NULL', label: '不为空' },
} as const);

/**
 * 后端生成选项枚举
 */
export const BackendOption = Enum({
  Entity: { value: 'entity', label: 'Entity 实体' },
  Dto: { value: 'dto', label: 'DTO 数据传输对象' },
  Service: { value: 'service', label: 'Service 服务层' },
  Controller: { value: 'controller', label: 'Controller 控制层' },
  Module: { value: 'module', label: 'Module 模块' },
} as const);

/**
 * 前端生成选项枚举
 */
export const FrontendOption = Enum({
  Api: { value: 'api', label: 'API 接口' },
  Types: { value: 'types', label: 'Types 类型定义' },
  Enum: { value: 'enum', label: 'Enum 枚举' },
  List: { value: 'list', label: '列表页面' },
  Form: { value: 'form', label: '表单组件' },
  Detail: { value: 'detail', label: '详情组件' },
  TableColumns: { value: 'table-columns', label: '表格列配置' },
  FormSchemas: { value: 'form-schemas', label: '表单配置' },
  SearchConfig: { value: 'search-config', label: '搜索配置' },
} as const);

/**
 * 功能选项枚举
 */
export const FeatureOption = Enum({
  Add: { value: 'add', label: '新增' },
  Edit: { value: 'edit', label: '编辑' },
  Delete: { value: 'delete', label: '删除' },
  BatchDelete: { value: 'batchDelete', label: '批量删除' },
  Export: { value: 'export', label: '导出' },
  Import: { value: 'import', label: '导入' },
  Print: { value: 'print', label: '打印' },
  Detail: { value: 'detail', label: '详情' },
  Status: { value: 'status', label: '状态切换' },
  Sort: { value: 'sort', label: '排序' },
} as const);
