<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import FileCategory from './modules/file-category.vue';
import FileList from './modules/file-list.vue';

/**
 * 文件管理页面
 * 左侧显示分类树，右侧显示文件列表
 */
const categoryId = ref<number | undefined>();
</script>

<template>
  <Page>
    <div class="flex w-full">
      <div class="min-w-64 flex-shrink-0">
        <FileCategory v-model="categoryId" />
      </div>
      <div class="min-w-0 flex-1">
        <FileList />
      </div>
    </div>
  </Page>
</template>
