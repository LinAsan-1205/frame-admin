<script lang="ts" setup>
import type { ConfigGroup } from '#/api/system/config/types';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm, z } from '#/adapter/form';
import { addConfigGroup, setConfigGroupById } from '#/api/system/config';
import { ConfigGroupStatus } from '#/api/system/config/enum';
import { $t } from '#/locales';

const emits = defineEmits(['success']);

const formData = ref<ConfigGroup.View>();
const id = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.configGroup.groupNamePlaceholder'),
        maxlength: 50,
      },
      fieldName: 'groupName',
      label: $t('system.config.configGroup.groupName'),
      rules: z
        .string()
        .min(1, $t('system.config.configGroup.groupNamePlaceholder'))
        .max(50, '组名称不能超过50个字符'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('system.config.configGroup.remarkPlaceholder'),
        rows: 3,
        maxlength: 200,
      },
      fieldName: 'remark',
      label: $t('system.config.configGroup.remark'),
      rules: z.string().max(200, '备注不能超过200个字符').optional(),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        placeholder: $t('system.config.configGroup.statusPlaceholder'),
        options: ConfigGroupStatus.toOriginItems(),
      },
      fieldName: 'status',
      label: $t('system.config.configGroup.status'),
      defaultValue: ConfigGroupStatus.Normal,
      rules: z
        .string()
        .min(1, $t('system.config.configGroup.statusPlaceholder')),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('system.config.configGroup.sortOrderPlaceholder'),
        min: 0,
        max: 9999,
      },
      fieldName: 'sortOrder',
      label: $t('system.config.configGroup.sortOrder'),
      rules: z
        .number()
        .min(0, '排序值必须在0-9999之间')
        .max(9999, '排序值必须在0-9999之间'),
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: ConfigGroup.View = await formApi.getValues();
    modalApi.lock();
    try {
      await (id.value
        ? setConfigGroupById(id.value, values)
        : addConfigGroup(values));
      emits('success');
      modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<ConfigGroup.View>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues({
          groupName: data.groupName,
          remark: data.remark,
          status: data.status,
          sortOrder: data.sortOrder,
        });
      } else {
        id.value = undefined;
        formApi.setValues({
          status: ConfigGroupStatus.Normal,
          sortOrder: 0,
        });
      }
    }
  },
});

const getModalTitle = computed(() => {
  return `${formData.value?.id ? $t('common.edit') : $t('common.create')}${$t('system.config.configGroup.name')}`;
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>

<style lang="css" scoped></style>
