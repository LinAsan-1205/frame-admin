<script lang="ts" setup>
import type { Region } from '#/api/system/region';
import type { CascaderOption } from '#/components/region/region-cascader.vue';

import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addRegion, RegionType, setRegionById } from '#/api/system/region';
import { $t } from '#/locales';

import { useFormSchema } from '../config/form-schemas';

const emit = defineEmits(['success']);
const formData = ref<Region.View>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.region.name')])
    : $t('ui.actionTitle.create', [$t('system.region.name')]);
});

const parentItem = ref<CascaderOption>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  layout: 'horizontal',
  schema: useFormSchema(parentItem),
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

watch(
  parentItem,
  async (newVal) => {
    if (!newVal) return;

    const parentLevel = Number(newVal.level ?? 0);
    const nextLevel = parentLevel + 1;
    formApi.setFieldValue('level', nextLevel);

    let nextType: Region.RegionTypeType = RegionType.Province;

    if (parentLevel >= 2) {
      const data = (await formApi.getValues()) as Region.View | undefined;
      const title = data?.title ?? '';
      nextType = title.includes('街道') ? RegionType.Street : RegionType.Area;
    } else if (parentLevel === 1) {
      nextType = RegionType.City;
    }

    formApi.setFieldValue('type', nextType);
  },
  { immediate: true },
);
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
