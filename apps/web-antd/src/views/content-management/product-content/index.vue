<script setup lang="ts">
import { ref } from 'vue';

import { DualPaneLayout } from '#/components/dual-pane-layout';
import ProductCategoryTree from '#/components/product-category/product-category-tree.vue';

import ProductContentList from './product-content-list.vue';

const categoryId = ref<number | undefined>();
</script>

<template>
  <DualPaneLayout>
    <template #left>
      <div
        class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-4"
      >
        <ProductCategoryTree v-model="categoryId" />
      </div>
    </template>

    <ProductContentList v-model:category-id="categoryId" />
  </DualPaneLayout>
</template>
