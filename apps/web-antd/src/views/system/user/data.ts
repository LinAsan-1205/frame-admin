import type { Ref } from 'vue';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { User } from '#/api/system/user';

import { z } from '#/adapter/form';
import { queryDeptTree } from '#/api/system/dept';
import { Sex, Status, UserType } from '#/api/system/user/enum';
import { $t } from '#/locales';

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
        options: UserType.toSelect(),
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

export function useSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        fieldName: 'userName',
        label: $t('system.user.userName'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'nickName',
        label: $t('system.user.nickName'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'phone',
        label: $t('system.user.phone'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'email',
        label: $t('system.user.email'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: Status.toSelect(),
        },
        fieldName: 'status',
        label: $t('system.role.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'createTime',
        label: $t('system.role.createTime'),
      },
    ],
  };
}

export function useColumns<T = User.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      slots: { default: 'userBlock' },
      field: 'userBlock',
      title: $t('system.user.userBlock'),
      showOverflow: false,
      width: 140,
    },
    {
      field: 'userName',
      title: $t('system.user.userName'),
      cellRender: {
        name: 'CellCopyText',
      },
      width: 200,
    },

    {
      field: 'userType',
      cellRender: {
        name: 'CellTag',
        options: UserType.toOriginItems(),
      },
      title: $t('system.user.userType'),
      width: 140,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      cellRender: {
        name: 'CellCopyText',
      },
      width: 200,
    },

    {
      field: 'sex',
      cellRender: {
        name: 'CellTag',
        options: Sex.toOriginItems(),
      },
      title: $t('system.user.sex'),
      width: 140,
    },
    {
      field: 'dept.name',
      title: $t('system.user.dept'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      width: 200,
    },
    {
      slots: { default: 'rolesBlock' },
      field: 'roles',
      title: $t('system.user.roles'),
      showOverflow: false,
      width: 140,
    },
    {
      field: 'status',
      cellRender: {
        name: 'CellTag',
        options: Status.toOriginItems(),
      },
      title: $t('system.user.status'),
      width: 140,
    },
    {
      field: 'remark',
      title: $t('system.user.remark'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      minWidth: 200,
    },
    {
      field: 'loginIp',
      cellRender: {
        name: 'CellFormatEmpty',
      },
      title: $t('system.user.loginIp'),
      width: 140,
    },
    {
      field: 'loginDate',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.user.loginDate'),
      width: 156,
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.user.createTime'),
      width: 156,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'userName',
          nameTitle: $t('system.user.userName'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'more'],
        props: {
          moreOptions: [
            {
              code: 'delete',
              text: $t('system.user.deleteUser'),
              disabled: (row: User.View) => {
                return row.userType === UserType.Admin;
              },
            },
            {
              code: 'assignedRole',
              text: $t('system.user.assignedRole'),
            },
            {
              code: 'initializePassword',
              text: $t('system.user.initializePassword'),
              disabled: (row: User.View) => {
                return row.userType === UserType.Admin;
              },
            },
          ],
        },
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 130,
    },
  ];
}
