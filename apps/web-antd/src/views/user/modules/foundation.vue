<script setup lang="ts">
import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { setFoundation, Sex } from '#/api/system/user';
import { $t } from '#/locales';
import { useAuthStore } from '#/store/auth';

const authStore = useAuthStore();
const userStore = useUserStore();

const [BaseForm, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-2',
  actionPosition: 'left',
  actionLayout: 'inline',
  handleSubmit: onSubmit,
  schema: [
    {
      fieldName: 'userName',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      label: $t('system.user.userName'),
      defaultValue: userStore.userInfo?.userName,
    },
    {
      fieldName: 'avatar',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      label: $t('system.user.avatar'),
      defaultValue: userStore.userInfo?.avatar,
    },
    {
      fieldName: 'phone',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      formItemClass: 'col-span-2',
      label: $t('system.user.phone'),
      defaultValue: userStore.userInfo?.phone,
    },
    {
      fieldName: 'email',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      formItemClass: 'col-span-2',
      label: $t('system.user.email'),
      defaultValue: userStore.userInfo?.email,
    },
    {
      fieldName: 'nickName',
      component: 'Input',
      label: $t('system.user.nickName'),
      formItemClass: 'col-span-2',
      defaultValue: userStore.userInfo?.nickName,
      rules: z
        .string()
        .min(2, $t('system.user.nickNameMin'))
        .max(20, $t('system.user.nickNameMax'))
        .optional(),
    },
    {
      fieldName: 'sex',
      component: 'RadioGroup',
      componentProps: {
        options: Sex.toSelect(),
      },
      formItemClass: 'col-span-2',
      label: $t('system.user.sex'),
      defaultValue: userStore.userInfo?.sex,
    },
  ],
  submitButtonOptions: {
    content: '更新基本信息',
  },
  resetButtonOptions: {
    show: false,
  },
  submitOnEnter: true,
  commonConfig: {
    controlClass: 'w-[328px]',
  },
});
async function onSubmit(values: Record<string, any>) {
  const { nickName, sex, avatar } = values;
  const hideLoading = message.loading();
  await setFoundation({
    nickName,
    sex,
    avatar,
  }).finally(() => {
    hideLoading();
  });
  message.success({
    content: $t('ui.actionMessage.operationSuccess'),
  });
  const userInfo = await authStore.fetchUserInfo();
  formApi.setValues(userInfo);
}
</script>

<template>
  <BaseForm />
</template>
