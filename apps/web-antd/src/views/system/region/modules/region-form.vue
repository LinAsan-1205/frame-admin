<script lang="ts" setup>
import type { Region } from '#/api/system/region';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addRegion, setRegionById } from '#/api/system/region';
import { $t } from '#/locales';

import { useFormSchema } from '../config/form-schemas';

const emit = defineEmits(['success']);
const formData = ref<Region.View>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.region.name')])
    : $t('ui.actionTitle.create', [$t('system.region.name')]);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data: Region.View = await formApi.getValues();
      try {
        await (formData.value?.id
          ? setRegionById(formData.value.id, data)
          : addRegion(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<Region.View>();
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
