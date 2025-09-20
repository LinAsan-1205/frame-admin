<script lang="ts" setup>
import type { StorageConfig } from '#/api/system/storage/config';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  addStorageConfig,
  setStorageConfig,
} from '#/api/system/storage/config';
import { $t } from '#/locales';

import { useFormSchema } from '../config/form-schemas';

const emit = defineEmits(['success']);
const formData = ref<StorageConfig.View>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.storageConfig.name')])
    : $t('ui.actionTitle.create', [$t('system.storageConfig.name')]);
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useFormSchema(formData),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data: StorageConfig.View = await formApi.getValues();
      try {
        await (formData.value?.id
          ? setStorageConfig(formData.value.id, data)
          : addStorageConfig(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<StorageConfig.View>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value);
      }
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
