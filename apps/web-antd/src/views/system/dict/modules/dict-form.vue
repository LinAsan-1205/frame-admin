<script lang="ts" setup>
import type { Dict } from '#/api/system/dict';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addDict, setDictById } from '#/api/system/dict';
import { $t } from '#/locales';

import { useDictFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<Dict.View>();
const id = ref();

const [Form, formApi] = useVbenForm({
  schema: useDictFormSchema(id),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: Dict.Post = await formApi.getValues();
    drawerApi.lock();
    (id.value ? setDictById(id.value, values) : addDict(values))
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<Dict.View>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id ? $t('common.edit') : $t('common.add');
});
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
<style lang="css" scoped></style>
