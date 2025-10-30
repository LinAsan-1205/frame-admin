<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { ArrowLeft } from '@vben/icons';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  addProductContent,
  getProductContentById,
  setProductContentById,
} from '#/api/content-management/product-content';
import { $t } from '#/locales';

import { useFormSchema } from './config/form-schemas';

const route = useRoute();
const router = useRouter();

const contentId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : undefined;
});

const isEdit = computed(() => !!contentId.value);
const pageTitle = computed(() =>
  isEdit.value
    ? $t('content-management.content.editTitle')
    : $t('content-management.content.addTitle'),
);

const loading = ref(false);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit,
  schema: useFormSchema(),
  wrapperClass: 'grid-cols-1',
});

/**
 * 加载数据
 */
async function loadData() {
  if (!contentId.value) return;

  loading.value = true;
  try {
    const data = await getProductContentById(contentId.value);
    await formApi.setValues({
      ...data,
      publishedAt: dayjs(data.publishedAt),
    });
  } catch (error) {
    message.error('加载数据失败');
    console.error('Load data error:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 提交表单
 */
async function handleSubmit() {
  loading.value = true;
  try {
    await formApi.validate();
    const values = await formApi.getValues();

    if (isEdit.value && contentId.value) {
      await setProductContentById(contentId.value, values as any);
      message.success($t('common.updateSuccess'));
    } else {
      await addProductContent(values as any);
      message.success($t('common.addSuccess'));
    }

    // 返回列表页
    handleBack();
  } catch (error: any) {
    if (error?.errorFields) {
      message.error('请检查表单填写是否正确');
    } else {
      message.error(isEdit.value ? '更新失败，请重试' : '新增失败，请重试');
    }
    console.error('Submit error:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 返回列表页
 */
function handleBack() {
  router.push('/content-management/product-content');
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <Page
    :description="
      isEdit
        ? $t('content-management.content.editDescription')
        : $t('content-management.content.addDescription')
    "
    :title="pageTitle"
  >
    <template #header-extra>
      <Button @click="handleBack">
        <ArrowLeft class="size-5" />
        {{ $t('common.back') }}
      </Button>
      <Button :loading="loading" type="primary" @click="handleSubmit">
        {{ $t('common.save') }}
      </Button>
    </template>

    <div class="bg-white">
      <Form class="p-6" />
    </div>
  </Page>
</template>
