import type { Ref } from 'vue';

import type { VbenFormSchema } from '#/adapter/form';

import { z } from '#/adapter/form';
import { queryDeptTree } from '#/api/system/dept';
import { findAllEnabledRoles } from '#/api/system/role';
import { Sex, Status, UserType } from '#/api/system/user/enum';
import { $t } from '#/locales';

/**
 * 用户表单配置
 * @param id 用户ID（用于区分新增/编辑模式）
 * @returns 表单字段配置数组
 */
export function useFormSchema(id: Ref<number | undefined>): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nickName',
      label: $t('system.user.nickName'),
      rules: 'required',
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('system.user.userName'),
      rules: 'required',
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.password'),
      rules: 'required',
      dependencies: {
        show: () => !id.value,
        triggerFields: ['id'],
      },
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
      rules: z
        .string()
        .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号')
        .optional(),
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
      rules: z.string().email('请输入正确的邮箱').optional(),
      componentProps: {
        allowClear: true,
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: Sex.toSelect(),
      },
      defaultValue: Sex.Unknown,
      fieldName: 'sex',
      label: $t('system.user.sex'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: UserType.toSelect().filter((item) => item.value !== '02'),
      },
      defaultValue: UserType.System,
      fieldName: 'userType',
      label: $t('system.user.userType'),
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: queryDeptTree,
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
      },
      fieldName: 'deptId',
      label: $t('system.user.dept'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: Status.toSelect(),
      },
      defaultValue: Status.Normal,
      fieldName: 'status',
      label: $t('system.user.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
  ];
}

/**
 * 角色分配表单配置
 * @returns 角色分配表单字段配置数组
 */
export function useRoleAssignFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'userName',
      label: $t('system.user.userName'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          // 查询所有启用的角色
          const enabledRoleList = await findAllEnabledRoles();
          return enabledRoleList.map((roleItem) => ({
            label: roleItem.name,
            value: roleItem.id,
          }));
        },
        mode: 'multiple',
        class: 'w-full',
        allowClear: true,
      },
      fieldName: 'roleIdList',
      label: $t('system.role.name'),
    },
  ];
}
