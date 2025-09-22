import type { VbenFormSchema } from '#/adapter/form';

import { z } from '#/adapter/form';
import { $t } from '#/locales';

/**
 * 代码生成器基本配置表单
 * @returns 表单schema配置数组
 */
export function useBasicFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'tableName',
      label: $t('generator.config.basic.tableName'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'tableComment',
      label: $t('generator.config.basic.tableComment'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'moduleName',
      label: $t('generator.config.basic.moduleName'),
      componentProps: {
        placeholder: $t('generator.config.basic.moduleNamePlaceholder'),
      },
      rules: z
        .string()
        .min(1, $t('ui.formRules.required'))
        .max(
          30,
          $t('ui.formRules.maxLength', [
            $t('generator.config.basic.moduleName'),
            30,
          ]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'businessName',
      label: $t('generator.config.basic.businessName'),
      componentProps: {
        placeholder: $t('generator.config.basic.businessNamePlaceholder'),
      },
      rules: z
        .string()
        .min(1, $t('ui.formRules.required'))
        .max(
          50,
          $t('ui.formRules.maxLength', [
            $t('generator.config.basic.businessName'),
            50,
          ]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'modulePath',
      label: $t('generator.config.basic.modulePath'),
      componentProps: {
        placeholder: $t('generator.config.basic.modulePathPlaceholder'),
      },
      rules: z
        .string()
        .min(1, $t('ui.formRules.required'))
        .max(
          100,
          $t('ui.formRules.maxLength', [
            $t('generator.config.basic.modulePath'),
            100,
          ]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'permissionPrefix',
      label: $t('generator.config.basic.permissionPrefix'),
      componentProps: {
        placeholder: $t('generator.config.basic.permissionPrefixPlaceholder'),
      },
      rules: z
        .string()
        .min(1, $t('ui.formRules.required'))
        .max(
          100,
          $t('ui.formRules.maxLength', [
            $t('generator.config.basic.permissionPrefix'),
            100,
          ]),
        ),
    },
  ];
}

/**
 * 代码生成器选项配置表单
 * @returns 表单schema配置数组
 */
export function useOptionsFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Divider',
      fieldName: 'backendDivider',
      formItemClass: 'col-span-2',
      hideLabel: true,
      renderComponentContent() {
        return {
          default: () => $t('generator.config.options.backend.title'),
        };
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'backendOptions',
      formItemClass: 'col-span-2',
      hideLabel: true,
      componentProps: {
        options: [
          {
            value: 'entity',
            label: $t('generator.config.options.backend.entity'),
          },
          { value: 'dto', label: $t('generator.config.options.backend.dto') },
          {
            value: 'service',
            label: $t('generator.config.options.backend.service'),
          },
          {
            value: 'controller',
            label: $t('generator.config.options.backend.controller'),
          },
          {
            value: 'module',
            label: $t('generator.config.options.backend.module'),
          },
        ],
      },
      defaultValue: ['entity', 'dto', 'service', 'controller', 'module'],
    },
    {
      component: 'Divider',
      fieldName: 'frontendDivider',
      formItemClass: 'col-span-2',
      hideLabel: true,
      renderComponentContent() {
        return {
          default: () => $t('generator.config.options.frontend.title'),
        };
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'frontendOptions',
      formItemClass: 'col-span-2',
      hideLabel: true,
      componentProps: {
        options: [
          { value: 'api', label: $t('generator.config.options.frontend.api') },
          {
            value: 'types',
            label: $t('generator.config.options.frontend.types'),
          },
          {
            value: 'enum',
            label: $t('generator.config.options.frontend.enum'),
          },
          {
            value: 'list',
            label: $t('generator.config.options.frontend.list'),
          },
          {
            value: 'form',
            label: $t('generator.config.options.frontend.form'),
          },
          {
            value: 'table-columns',
            label: $t('generator.config.options.frontend.tableColumns'),
          },
          {
            value: 'form-schemas',
            label: $t('generator.config.options.frontend.formSchemas'),
          },
          {
            value: 'search-config',
            label: $t('generator.config.options.frontend.searchConfig'),
          },
        ],
      },
      defaultValue: [
        'api',
        'types',
        'enum',
        'list',
        'form',
        'table-columns',
        'form-schemas',
        'search-config',
      ],
    },
    {
      component: 'Divider',
      fieldName: 'featuresDivider',
      formItemClass: 'col-span-2',
      hideLabel: true,
      renderComponentContent() {
        return {
          default: () => $t('generator.config.options.features.title'),
        };
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'features',
      formItemClass: 'col-span-2',
      hideLabel: true,
      componentProps: {
        options: [
          { value: 'add', label: $t('generator.config.options.features.add') },
          {
            value: 'edit',
            label: $t('generator.config.options.features.edit'),
          },
          {
            value: 'delete',
            label: $t('generator.config.options.features.delete'),
          },
          {
            value: 'batchDelete',
            label: $t('generator.config.options.features.batchDelete'),
          },
          {
            value: 'export',
            label: $t('generator.config.options.features.export'),
          },
          {
            value: 'import',
            label: $t('generator.config.options.features.import'),
          },
        ],
      },
      defaultValue: ['add', 'edit', 'delete', 'batchDelete'],
    },
  ];
}
