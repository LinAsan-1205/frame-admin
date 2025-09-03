<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

// import FileCategoryList from './list.vue';
import FileCategory from './modules/file-category.vue';

const categoryId = ref<number | undefined>();
</script>

<template>
  <Page auto-content-height>
    <div class="flex w-full">
      <div class="min-w-64 flex-shrink-0 pt-4">
        <FileCategory v-model="categoryId" />
      </div>
      <div class="min-w-0 flex-1">
        <!-- <UserList v-model:dept-id="deptId" /> -->
      </div>
    </div>
  </Page>
</template>
