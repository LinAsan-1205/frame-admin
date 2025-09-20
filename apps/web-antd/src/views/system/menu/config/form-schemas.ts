import type { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface';

import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

import { h, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $te } from '@vben/locales';
import { getPopupContainer } from '@vben/utils';

import { z } from '#/adapter/form';
import {
  BadgeType,
  getMenuTreeList,
  Menu,
  MenuType,
  Status,
} from '#/api/system/menu';
import { $t } from '#/locales';
import { componentKeys } from '#/router/routes';

/**
 * 获取菜单类型选项
 * @returns 菜单类型选项数组
 */
export function getMenuTypeOptions() {
  return [...MenuType.items];
}

/**
 * 菜单表单配置
 * @param titleSuffix 标题后缀的响应式引用
 * @returns 表单schema配置数组
 */
export function useFormSchema(
  titleSuffix: ReturnType<typeof ref<string | undefined>>,
): VbenFormSchema[] {
  return [
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getMenuTypeOptions(),
        optionType: 'button',
      },
      defaultValue: 'menu',
      fieldName: 'type',
      formItemClass: 'col-span-2 md:col-span-2',
      label: $t('system.menu.type'),
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.menu.menuName'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.menu.menuName'), 2]))
        .max(
          30,
          $t('ui.formRules.maxLength', [$t('system.menu.menuName'), 30]),
        ),
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        api: getMenuTreeList,
        class: 'w-full',
        filterTreeNode(input: string, node: Recordable<any>) {
          if (!input || input.length === 0) {
            return true;
          }
          const title: string = node.meta?.title ?? '';
          if (!title) return false;
          return title.includes(input) || $t(title).includes(input);
        },
        getPopupContainer,
        labelField: 'meta.title',
        showSearch: true,
        treeDefaultExpandAll: true,
        valueField: 'id',
        childrenField: 'children',
      },
      fieldName: 'parentId',
      label: $t('system.menu.parent'),
      renderComponentContent() {
        return {
          title({ label, meta }: { label: string; meta: Recordable<any> }) {
            const coms = [];
            if (!label) return '';
            if (meta?.icon) {
              coms.push(h(IconifyIcon, { class: 'size-4', icon: meta.icon }));
            }
            coms.push(h('span', { class: '' }, $t(label || '')));
            return h('div', { class: 'flex items-center gap-1' }, coms);
          },
        };
      },
    },
    {
      component: 'Input',
      componentProps() {
        return {
          addonAfter: titleSuffix.value,
          onChange({ target: { value } }: ChangeEvent) {
            titleSuffix.value = value && $te(value) ? $t(value) : undefined;
          },
        };
      },
      fieldName: 'title',
      label: $t('system.menu.menuTitle'),
      rules: 'required',
    },
    {
      component: 'Input',
      dependencies: {
        show: (values) => {
          return ['catalog', 'embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'path',
      label: $t('system.menu.path'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.menu.path'), 2]))
        .max(100, $t('ui.formRules.maxLength', [$t('system.menu.path'), 100]))
        .refine(
          (value: string) => {
            return value.startsWith('/');
          },
          $t('ui.formRules.startWith', [$t('system.menu.path'), '/']),
        ),
    },
    {
      component: 'Input',
      dependencies: {
        show: (values) => {
          return ['embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'activePath',
      help: $t('system.menu.activePathHelp'),
      label: $t('system.menu.activePath'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.menu.path'), 2]))
        .max(100, $t('ui.formRules.maxLength', [$t('system.menu.path'), 100]))
        .refine(
          (value: string) => {
            return value.startsWith('/');
          },
          $t('ui.formRules.startWith', [$t('system.menu.path'), '/']),
        )
        .optional(),
    },
    {
      component: 'IconPicker',
      componentProps: {
        prefix: 'carbon',
      },
      dependencies: {
        show: (values) => {
          return ['catalog', 'embedded', 'link', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'icon',
      label: $t('system.menu.icon'),
    },
    {
      component: 'IconPicker',
      componentProps: {
        prefix: 'carbon',
      },
      dependencies: {
        show: (values) => {
          return ['catalog', 'embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'activeIcon',
      label: $t('system.menu.activeIcon'),
    },
    {
      component: 'AutoComplete',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption(input: string, option: { value: string }) {
          return option.value.toLowerCase().includes(input.toLowerCase());
        },
        options: componentKeys.map((v) => ({ value: v })),
      },
      dependencies: {
        rules: (values) => {
          return values.type === MenuType.Menu ? 'required' : null;
        },
        show: (values) => {
          return values.type === MenuType.Menu;
        },
        triggerFields: ['type'],
      },
      fieldName: 'component',
      label: $t('system.menu.component'),
    },
    {
      component: 'InputNumber',
      dependencies: {
        show: (values) => {
          return !['button'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      componentProps: {
        class: 'w-full',
      },
      defaultValue: -1,
      fieldName: 'order',
      label: $t('system.menu.orderNum'),
    },
    {
      component: 'Input',
      dependencies: {
        show: (values) => {
          return ['embedded', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'link',
      label: $t('system.menu.linkSrc'),
      rules: z.string().url($t('ui.formRules.invalidURL')),
    },
    {
      component: 'Input',
      dependencies: {
        rules: (values) => {
          return values.type === MenuType.Button ? 'required' : null;
        },
        show: (values) => {
          return ['button', 'catalog', 'embedded', 'menu'].includes(
            values.type,
          );
        },
        triggerFields: ['type'],
      },
      fieldName: 'authCode',
      label: $t('system.menu.authCode'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: Status.toSelect(),
        optionType: 'button',
      },
      defaultValue: Status.Normal,
      fieldName: 'status',
      label: $t('system.menu.status'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        options: BadgeType.toSelect(),
      },
      dependencies: {
        show: (values) => {
          return values.type !== MenuType.Button;
        },
        triggerFields: ['type'],
      },
      fieldName: 'badgeType',
      label: $t('system.menu.badgeType.title'),
    },
    {
      component: 'Input',
      componentProps: (values) => {
        return {
          allowClear: true,
          class: 'w-full',
          disabled: values?.badgeType !== BadgeType.Text,
        };
      },
      dependencies: {
        show: (values) => {
          return values.type !== MenuType.Button;
        },
        triggerFields: ['type'],
      },
      fieldName: 'badge',
      label: $t('system.menu.badge'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        options: Menu.BadgeVariants.map((v) => ({
          label: v,
          value: v,
        })),
      },
      dependencies: {
        show: (values) => {
          return values.type !== MenuType.Button;
        },
        triggerFields: ['type'],
      },
      fieldName: 'badgeVariants',
      label: $t('system.menu.badgeVariants'),
    },
    {
      component: 'Divider',
      dependencies: {
        show: (values) => {
          return !['button', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'divider1',
      formItemClass: 'col-span-2 md:col-span-2 pb-0',
      hideLabel: true,
      renderComponentContent() {
        return {
          default: () => $t('system.menu.advancedSettings'),
        };
      },
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return ['menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'keepAlive',
      renderComponentContent() {
        return {
          default: () => $t('system.menu.keepAlive'),
        };
      },
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return ['embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'affixTab',
      renderComponentContent() {
        return {
          default: () => $t('system.menu.affixTab'),
        };
      },
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return !['button'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'hideInMenu',
      renderComponentContent() {
        return {
          default: () => $t('system.menu.hideInMenu'),
        };
      },
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return ['catalog', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'hideChildrenInMenu',
      renderComponentContent() {
        return {
          default: () => $t('system.menu.hideChildrenInMenu'),
        };
      },
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return !['button', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'hideInBreadcrumb',
      renderComponentContent() {
        return {
          default: () => $t('system.menu.hideInBreadcrumb'),
        };
      },
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return !['button', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'hideInTab',
      renderComponentContent() {
        return {
          default: () => $t('system.menu.hideInTab'),
        };
      },
    },
  ];
}
