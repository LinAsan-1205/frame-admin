<script setup lang="ts">
import { ref } from 'vue';

import DualPaneLayout from '#/components/dual-pane-layout';

import DictCategory from './modules/dict-category.vue';
import DictDataList from './modules/dict-data-list.vue';

const dictId = ref<number | undefined>();
</script>

<template>
  <DualPaneLayout>
    <template #left>
      <div
        class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-4"
      >
        <DictCategory v-model="dictId" />
      </div>
    </template>
    <DictDataList v-model:dict-id="dictId" />
  </DualPaneLayout>
</template>
