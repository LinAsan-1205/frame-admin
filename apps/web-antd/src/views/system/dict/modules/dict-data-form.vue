<script lang="ts" setup>
import type { DictData } from '#/api/system/dict';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addDictData, setDictDataById } from '#/api/system/dict';
import { $t } from '#/locales';

import { useDictDataFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<DictData.View>();
const id = ref();
const dictId = ref();

const [Form, formApi] = useVbenForm({
  schema: useDictDataFormSchema(dictId),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: DictData.Post = await formApi.getValues();
    modalApi.lock();
    (id.value ? setDictDataById(id.value, values) : addDictData(values))
      .then(() => {
        emits('success');
        modalApi.close();
      })
      .catch(() => {
        modalApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<DictData.View>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        dictId.value = data.dictId;
        formApi.setValues(data);
      } else {
        id.value = undefined;
        // 获取预设的dictId（新增时）
        const presetData = modalApi.getData<{ dictId?: number }>();
        if (presetData?.dictId) {
          dictId.value = presetData.dictId;
          formApi.setValues({ dictId: presetData.dictId });
        }
      }
    }
  },
});

const getModalTitle = computed(() => {
  return `${formData.value?.id ? $t('common.edit') : $t('common.create')}字典数据`;
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>

<style lang="css" scoped></style>
