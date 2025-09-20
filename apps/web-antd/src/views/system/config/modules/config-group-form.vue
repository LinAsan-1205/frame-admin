<script lang="ts" setup>
import type { ConfigGroup } from '#/api/system/config/types';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addConfigGroup, setConfigGroupById } from '#/api/system/config';
import { ConfigGroupStatus } from '#/api/system/config/enum';
import { $t } from '#/locales';

import { useConfigGroupFormSchema } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<ConfigGroup.View>();
const id = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  schema: useConfigGroupFormSchema(),
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
          configKey: data.configKey,
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
