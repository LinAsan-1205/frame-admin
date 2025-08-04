import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { User } from '#/api/system/user';

import { h } from 'vue';

import { z } from '#/adapter/form';
import { getDeptList } from '#/api/system/dept';
import { Sex, Status, UserType } from '#/api/system/user/enum';
import DisplayBlock from '#/components/model/display-block.vue';
import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nickName',
      label: $t('system.user.nickName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('system.user.userName'),
      rules: 'required',
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.password'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
      rules: z
        .string()
        .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号')
        .optional(),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
      rules: z.string().email('请输入正确的邮箱').optional(),
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
        api: getDeptList,
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
        buttonStyle: 'solid',
        options: Status.toSelect(),
        optionType: 'button',
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
      },
      {
        component: 'Input',
        fieldName: 'nickName',
        label: $t('system.user.nickName'),
      },
      {
        component: 'Input',
        fieldName: 'phone',
        label: $t('system.user.phone'),
      },
      {
        component: 'Input',
        fieldName: 'email',
        label: $t('system.user.email'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: [
            { label: $t('common.enabled'), value: '0' },
            { label: $t('common.disabled'), value: '1' },
          ],
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
      fixed: 'left',
      width: 140,
    },
    {
      field: 'userName',
      title: $t('system.user.userName'),
      width: 200,
    },

    {
      field: 'userType',
      slots: {
        default({ row }) {
          return h(DisplayBlock, row.userTypeDisplay);
        },
      },
      title: $t('system.user.userType'),
      width: 140,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      width: 200,
    },

    {
      field: 'sex',
      slots: {
        default({ row }) {
          return h(DisplayBlock, row.sexDisplay);
        },
      },
      title: $t('system.user.sex'),
      width: 140,
    },
    {
      field: 'dept.name',
      title: $t('system.user.dept'),
      width: 200,
    },
    {
      field: 'status',
      slots: {
        default({ row }) {
          return h(DisplayBlock, row.statusDisplay);
        },
      },
      title: $t('system.user.status'),
      width: 140,
    },
    {
      field: 'remark',
      title: $t('system.user.remark'),
    },
    {
      field: 'loginIp',
      title: $t('system.user.loginIp'),
    },
    {
      field: 'loginDate',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.user.loginDate'),
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.user.createTime'),
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
        options: [
          'edit',
          {
            code: 'delete',
            disabled: (row: User.View) => {
              return row.userType === UserType.Admin;
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 130,
    },
  ];
}
