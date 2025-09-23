import { z } from '#/adapter/form';
import {
  BackendOption,
  FeatureOption,
  FrontendOption,
} from '#/api/generator/enum';
import { $t } from '#/locales';

/**
 * 基础配置表单Schema
 */
export const createBasicFormSchema = () => [
  {
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    fieldName: 'tableName',
    label: $t('generator.config.basic.tableName'),
  },
  {
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    fieldName: 'tableComment',
    label: $t('generator.config.basic.tableComment'),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: $t('generator.config.basic.moduleNamePlaceholder'),
    },
    fieldName: 'moduleName',
    label: $t('generator.config.basic.moduleName'),
    rules: z
      .string()
      .min(2, '模块名称长度至少2个字符')
      .max(50, '模块名称长度不超过50个字符')
      .regex(/^[a-z]\w*$/i, '模块名称只能包含字母、数字和下划线，且以字母开头'),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: $t('generator.config.basic.businessNamePlaceholder'),
    },
    fieldName: 'businessName',
    label: $t('generator.config.basic.businessName'),
    rules: z
      .string()
      .min(2, '业务名称长度至少2个字符')
      .max(50, '业务名称长度不超过50个字符'),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: $t('generator.config.basic.modulePathPlaceholder'),
    },
    fieldName: 'modulePath',
    label: $t('generator.config.basic.modulePath'),
    rules: z
      .string()
      .min(1, '请输入模块路径')
      .regex(/^[\w/]+$/, '模块路径只能包含字母、数字、下划线和斜杠'),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: $t('generator.config.basic.permissionPrefixPlaceholder'),
    },
    fieldName: 'permissionPrefix',
    label: $t('generator.config.basic.permissionPrefix'),
    rules: z
      .string()
      .min(1, '请输入权限前缀')
      .regex(/^[\w:]+$/, '权限前缀只能包含字母、数字、下划线和冒号'),
  },
];

/**
 * 生成选项表单Schema
 */
export const createOptionsFormSchema = () => [
  {
    component: 'CheckboxGroup',
    componentProps: {
      options: BackendOption.toSelect(),
    },
    fieldName: 'backendOptions',
    label: $t('generator.config.options.backend.title'),
    rules: z.array(z.string()).min(1, '请至少选择一个后端选项'),
  },
  {
    component: 'CheckboxGroup',
    componentProps: {
      options: FrontendOption.toSelect(),
    },
    fieldName: 'frontendOptions',
    label: $t('generator.config.options.frontend.title'),
    rules: z.array(z.string()).min(1, '请至少选择一个前端选项'),
  },
  {
    component: 'CheckboxGroup',
    componentProps: {
      options: FeatureOption.toSelect(),
    },
    fieldName: 'features',
    label: $t('generator.config.options.features.title'),
    rules: z.array(z.string()).min(1, '请至少选择一个功能特性'),
  },
];
