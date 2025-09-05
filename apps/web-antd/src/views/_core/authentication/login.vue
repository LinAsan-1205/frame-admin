<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, ref, useTemplateRef } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

import FoundationCaptcha from './components/foundation-captcha.vue';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captchaId = ref('');

const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationLogin>>('loginRef');

const formSchema = computed((): VbenFormSchema[] => {
  return [
    // {
    //   component: 'VbenSelect',
    //   componentProps: {
    //     options: MOCK_USER_OPTIONS,
    //     placeholder: $t('authentication.selectAccount'),
    //   },
    //   fieldName: 'selectAccount',
    //   label: $t('authentication.selectAccount'),
    //   rules: z
    //     .string()
    //     .min(1, { message: $t('authentication.selectAccount') })
    //     .optional()
    //     .default('vben'),
    // },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      defaultValue: 'admin',
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      defaultValue: '123456',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(FoundationCaptcha),
      componentProps: {
        placeholder: $t('authentication.verifyCode'),
        onReload: (id: string) => {
          captchaId.value = id;
        },
      },

      fieldName: 'verifyCode',
      label: $t('authentication.verifyCode'),
      rules: z
        .string()
        .nonempty({ message: $t('authentication.verifyCodeTip') })
        .min(4, { message: $t('authentication.maxVerifyCodeTip') })
        .max(4, { message: $t('authentication.maxVerifyCodeTip') }),
    },
  ];
});

const authLogin = (values: any) => {
  authStore
    .authLogin({
      ...values,
      captchaId: captchaId.value,
    })
    .catch(() => {
      const formApi = loginRef.value?.getFormApi();
      formApi
        ?.getFieldComponentRef<
          InstanceType<typeof FoundationCaptcha>
        >('verifyCode')
        ?.resume();
    });
};
</script>

<template>
  <AuthenticationLogin
    :show-register="false"
    :show-third-party-login="false"
    :show-forget-password="false"
    :show-qrcode-login="false"
    :show-code-login="false"
    ref="loginRef"
    :title="$t('authentication.welcomeBack')"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authLogin"
  />
</template>
