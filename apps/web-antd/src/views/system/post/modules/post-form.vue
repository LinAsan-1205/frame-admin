<script lang="ts" setup>
import type { Post } from '#/api/system/post';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addPost, setPostById } from '#/api/system/post';
import { $t } from '#/locales';

import { useFormSchema } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<Post.View>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref();
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: Post.Create = await formApi.getValues();
    modalApi.lock();
    (id.value ? setPostById(id.value, values) : addPost(values))
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
      const data = modalApi.getData<Post.View>();
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
  return formData.value?.id ? $t('system.post.edit') : $t('system.post.add');
});
</script>
<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
