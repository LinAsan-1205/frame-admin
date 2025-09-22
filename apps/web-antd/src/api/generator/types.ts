/**
 * 代码生成器类型定义
 */
export namespace Generator {
  /**
   * 数据库表信息
   */
  export interface TableInfo {
    tableName: string;
    tableComment?: string;
    createTime?: string;
    engine?: string;
    tableCollation?: string;
  }

  /**
   * 表字段信息
   */
  export interface ColumnInfo {
    columnName: string;
    columnComment?: string;
    dataType: string;
    columnType: string;
    isNullable: boolean;
    isPrimary: boolean;
    isAutoIncrement: boolean;
    maxLength?: number;
    numericPrecision?: number;
    numericScale?: number;
    defaultValue?: any;
    extra?: string;
    // 生成配置字段
    isRequired?: boolean;
    isInsert?: boolean;
    isEdit?: boolean;
    isList?: boolean;
    isQuery?: boolean;
    formType?: string;
    queryType?: string;
    dictType?: string;
  }

  /**
   * 生成配置
   */
  export interface Config {
    // 基本信息
    tableName: string;
    tableComment?: string;
    moduleName: string;
    businessName: string;
    modulePath: string;
    permissionPrefix: string;

    // 字段配置
    fields: ColumnInfo[];

    // 生成选项
    backendOptions?: string[];
    frontendOptions?: string[];
    features?: string[];

    // 其他配置
    author?: string;
    packageName?: string;
    parentMenuId?: number;
    remark?: string;
  }

  /**
   * 预览结果
   */
  export interface PreviewResult {
    previews: PreviewFile[];
  }

  /**
   * 预览文件
   */
  export interface PreviewFile {
    fileName: string;
    filePath: string;
    content: string;
    language: 'javascript' | 'typescript' | 'vue';
  }

  /**
   * 生成结果
   */
  export interface GenerateResult {
    success: boolean;
    message: string;
    generatedFiles?: GeneratedFile[];
  }

  /**
   * 生成的文件信息
   */
  export interface GeneratedFile {
    fileName: string;
    filePath: string;
    status: 'created' | 'skipped' | 'updated';
    message?: string;
  }

  /**
   * 批量生成配置
   */
  export interface BatchConfig {
    configs: Config[];
  }

  /**
   * 表单类型选项
   */
  export const FormTypes = [
    { value: 'Input', label: '文本框' },
    { value: 'Textarea', label: '文本域' },
    { value: 'InputNumber', label: '数字框' },
    { value: 'Select', label: '下拉框' },
    { value: 'RadioGroup', label: '单选框' },
    { value: 'CheckboxGroup', label: '复选框' },
    { value: 'DatePicker', label: '日期选择' },
    { value: 'DateRangePicker', label: '日期范围' },
    { value: 'TimePicker', label: '时间选择' },
    { value: 'Switch', label: '开关' },
    { value: 'Upload', label: '文件上传' },
    { value: 'ApiSelect', label: '远程下拉' },
    { value: 'ApiTreeSelect', label: '树形选择' },
    { value: 'ApiCascader', label: '级联选择' },
    { value: 'IconPicker', label: '图标选择' },
  ] as const;

  /**
   * 查询类型选项
   */
  export const QueryTypes = [
    { value: 'EQ', label: '等于' },
    { value: 'NE', label: '不等于' },
    { value: 'GT', label: '大于' },
    { value: 'GTE', label: '大于等于' },
    { value: 'LT', label: '小于' },
    { value: 'LTE', label: '小于等于' },
    { value: 'LIKE', label: '模糊' },
    { value: 'NOT_LIKE', label: '不包含' },
    { value: 'IN', label: '包含' },
    { value: 'NOT_IN', label: '不包含' },
    { value: 'BETWEEN', label: '范围' },
    { value: 'IS_NULL', label: '为空' },
    { value: 'IS_NOT_NULL', label: '不为空' },
  ] as const;

  /**
   * 后端生成选项
   */
  export const BackendOptions = [
    { value: 'entity', label: 'Entity 实体' },
    { value: 'dto', label: 'DTO 数据传输对象' },
    { value: 'service', label: 'Service 服务层' },
    { value: 'controller', label: 'Controller 控制层' },
    { value: 'module', label: 'Module 模块' },
  ] as const;

  /**
   * 前端生成选项
   */
  export const FrontendOptions = [
    { value: 'api', label: 'API 接口' },
    { value: 'types', label: 'Types 类型定义' },
    { value: 'enum', label: 'Enum 枚举' },
    { value: 'list', label: '列表页面' },
    { value: 'form', label: '表单组件' },
    { value: 'detail', label: '详情组件' },
    { value: 'table-columns', label: '表格列配置' },
    { value: 'form-schemas', label: '表单配置' },
    { value: 'search-config', label: '搜索配置' },
  ] as const;

  /**
   * 功能选项
   */
  export const FeatureOptions = [
    { value: 'add', label: '新增' },
    { value: 'edit', label: '编辑' },
    { value: 'delete', label: '删除' },
    { value: 'batchDelete', label: '批量删除' },
    { value: 'export', label: '导出' },
    { value: 'import', label: '导入' },
    { value: 'print', label: '打印' },
    { value: 'detail', label: '详情' },
    { value: 'status', label: '状态切换' },
    { value: 'sort', label: '排序' },
  ] as const;
}
