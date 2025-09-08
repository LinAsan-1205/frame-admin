<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import FileCategory from './modules/file-category.vue';
import FileList from './modules/file-list.vue';

const categoryId = ref<number | undefined>();
</script>

<template>
  <Page>
    <div class="flex w-full space-x-2">
      <div class="min-w-64 flex-shrink-0">
        <FileCategory v-model="categoryId" />
      </div>
      <div class="min-w-0 flex-1">
        <FileList v-model:category-id="categoryId" />
      </div>
    </div>
  </Page>
</template>
