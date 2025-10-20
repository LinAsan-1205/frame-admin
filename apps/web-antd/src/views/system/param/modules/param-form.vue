<script lang="ts" setup>
import type { Param } from '#/api/system/param';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addParam, setParamById } from '#/api/system/param';
import { $t } from '#/locales';

import { useFormSchema } from '../config/form-schemas';

const emit = defineEmits(['success']);

const formData = ref<Param.View>();
const getTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.param.name')])
    : $t('ui.actionTitle.create', [$t('system.param.name')]),
);

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = (await formApi.getValues()) as Param.Post;
    await (formData.value?.id
      ? setParamById(formData.value.id, values)
      : addParam(values));
    emit('success');
    modalApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<Param.View>();
      formData.value = data;
      formApi.resetForm();
      if (data) formApi.setValues(data);
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
