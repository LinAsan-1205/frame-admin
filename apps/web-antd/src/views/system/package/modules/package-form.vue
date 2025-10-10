<script setup lang="ts">
import type { Package } from '#/api/system/package';

import { computed, nextTick, ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { addPackage, setPackage } from '#/api/system/package';
import { $t } from '#/locales';

import { useFormSchemaConfig } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<Package.View>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  schema: useFormSchemaConfig(),
  showDefaultActions: false,
});

const id = ref();
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: Package.Edit = await formApi.getValues();
    modalApi.lock();
    (id.value ? setPackage(id.value, values) : addPackage(values))
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
      const data = modalApi.getData<Package.View>();
      formApi.resetForm();

      if (data) {
        formData.value = data;
        id.value = data.id;
      } else {
        id.value = undefined;
      }

      // Wait for Vue to flush DOM updates (form fields mounted)
      await nextTick();
      if (data) {
        formApi.setValues(data);
      }
    }
  },
});

const getModalTitle = computed(() => {
  return formData.value?.id
    ? `${$t('common.edit')} ${$t('tenant.package.name')}`
    : `${$t('common.create')} ${$t('tenant.package.name')}`;
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
