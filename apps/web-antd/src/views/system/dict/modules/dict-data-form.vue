<script lang="ts" setup>
import type { DictData } from '#/api/system/dict';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

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

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: DictData.Post = await formApi.getValues();
    drawerApi.lock();
    (id.value ? setDictDataById(id.value, values) : addDictData(values))
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
      const data = drawerApi.getData<DictData.View>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        dictId.value = data.dictId;
        formApi.setValues(data);
      } else {
        id.value = undefined;
        // 获取预设的dictId（新增时）
        const presetData = drawerApi.getData<{ dictId?: number }>();
        if (presetData?.dictId) {
          dictId.value = presetData.dictId;
          formApi.setValues({ dictId: presetData.dictId });
        }
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
