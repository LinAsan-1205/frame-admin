<script lang="ts" setup>
import type { Session } from '#/api/system/session';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Alert, Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  getLoginStrategyConfig,
  updateLoginStrategyConfig,
} from '#/api/system/session';
import { $t } from '#/locales';

const emits = defineEmits(['success']);

const loading = ref(false);
const config = ref<Session.LoginStrategyConfig>();
const currentStrategy = ref<Session.LoginStrategyType>('multi');

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
    labelWidth: 140,
  },
  handleValuesChange: (values) => {
    if (values.strategy) {
      currentStrategy.value = values.strategy;
    }
  },
  schema: [
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('system.session.strategy.multi'), value: 'multi' },
          { label: $t('system.session.strategy.single'), value: 'single' },
          {
            label: $t('system.session.strategy.deviceType'),
            value: 'device-type',
          },
        ],
      },
      defaultValue: 'multi',
      fieldName: 'strategy',
      label: $t('system.session.strategyType'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 999,
        placeholder: $t('system.session.maxConcurrentSessionsPlaceholder'),
      },
      defaultValue: 999,
      dependencies: {
        show: (values) => values.strategy === 'multi',
        triggerFields: ['strategy'],
      },
      fieldName: 'maxConcurrentSessions',
      label: $t('system.session.maxConcurrentSessions'),
      rules: 'required',
    },
    {
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        show: (values) => values.strategy === 'device-type',
        triggerFields: ['strategy'],
      },
      fieldName: 'enforceDeviceLimit',
      label: $t('system.session.enforceDeviceLimit'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 99,
        placeholder: $t('system.session.deviceLimitPlaceholder'),
      },
      defaultValue: 5,
      dependencies: {
        show: (values) =>
          values.strategy === 'device-type' && values.enforceDeviceLimit,
        triggerFields: ['strategy', 'enforceDeviceLimit'],
      },
      fieldName: 'deviceLimitWeb',
      label: $t('system.session.deviceLimitWeb'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 99,
        placeholder: $t('system.session.deviceLimitPlaceholder'),
      },
      defaultValue: 3,
      dependencies: {
        show: (values) =>
          values.strategy === 'device-type' && values.enforceDeviceLimit,
        triggerFields: ['strategy', 'enforceDeviceLimit'],
      },
      fieldName: 'deviceLimitMobile',
      label: $t('system.session.deviceLimitMobile'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 99,
        placeholder: $t('system.session.deviceLimitPlaceholder'),
      },
      defaultValue: 2,
      dependencies: {
        show: (values) =>
          values.strategy === 'device-type' && values.enforceDeviceLimit,
        triggerFields: ['strategy', 'enforceDeviceLimit'],
      },
      fieldName: 'deviceLimitDesktop',
      label: $t('system.session.deviceLimitDesktop'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 99,
        placeholder: $t('system.session.deviceLimitPlaceholder'),
      },
      defaultValue: 2,
      dependencies: {
        show: (values) =>
          values.strategy === 'device-type' && values.enforceDeviceLimit,
        triggerFields: ['strategy', 'enforceDeviceLimit'],
      },
      fieldName: 'deviceLimitTablet',
      label: $t('system.session.deviceLimitTablet'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
      },
      defaultValue: 0,
      fieldName: 'isEnabled',
      label: $t('system.session.isEnabled'),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxlength: 500,
        placeholder: $t('system.session.remarkPlaceholder'),
        rows: 4,
        showCount: true,
      },
      fieldName: 'remark',
      label: $t('system.session.remark'),
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values: Session.UpdateLoginStrategyConfigParams =
      await formApi.getValues();

    modalApi.lock();
    updateLoginStrategyConfig(values)
      .then(() => {
        emits('success');
        modalApi.close();
      })
      .catch(() => {
        modalApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
      await loadConfig();

      // Wait for Vue to flush DOM updates
      await nextTick();

      if (config.value) {
        formApi.setValues(config.value);
        // 初始化 currentStrategy
        currentStrategy.value = config.value.strategy;
      }
    }
  },
});

async function loadConfig() {
  loading.value = true;
  try {
    config.value = await getLoginStrategyConfig();
  } finally {
    loading.value = false;
  }
}

const strategyDescription = computed(() => {
  switch (currentStrategy.value) {
    case 'device-type': {
      return $t('system.session.strategyDescriptionDeviceType');
    }
    case 'multi': {
      return $t('system.session.strategyDescriptionMulti');
    }
    case 'single': {
      return $t('system.session.strategyDescriptionSingle');
    }
    default: {
      return '';
    }
  }
});
</script>

<template>
  <Modal :title="$t('system.session.loginStrategyConfig')">
    <Spin :spinning="loading" wrapper-class-name="w-full">
      <Alert
        v-if="strategyDescription"
        :message="strategyDescription"
        type="info"
        show-icon
        class="mb-4"
      />
      <Form />
    </Spin>
  </Modal>
</template>
