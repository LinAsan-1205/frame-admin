<script setup lang="ts">
import { ref } from 'vue';

import { DualPaneLayout } from '#/components/dual-pane-layout';

import FileCategory from './modules/file-category.vue';
import FileList from './modules/file-list.vue';

const categoryId = ref<number | undefined>();
</script>

<template>
  <DualPaneLayout :left-max-width="15">
    <template #left>
      <div
        class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-4"
      >
        <FileCategory v-model="categoryId" />
      </div>
    </template>

    <FileList v-model:category-id="categoryId" />
  </DualPaneLayout>
</template>
