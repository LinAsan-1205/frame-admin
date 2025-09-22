<script setup lang="ts">
import { ref } from 'vue';

import { DualPaneLayout } from '#/components/dual-pane-layout';
import { $t } from '#/locales';

import GeneratorTable from './generator-table.vue';
import GeneratorConfig from './modules/generator-config.vue';

const selectedTable = ref<any>(null);

function handleTableSelect(table: any) {
  selectedTable.value = table;
}

function handleGenerate() {
  // 重新加载表列表
  selectedTable.value = null;
}
</script>

<template>
  <DualPaneLayout>
    <template #left>
      <div
        class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-4"
      >
        <GeneratorTable @select="handleTableSelect" />
      </div>
    </template>

    <div class="h-full">
      <GeneratorConfig
        v-if="selectedTable"
        :table-info="selectedTable"
        @success="handleGenerate"
      />
      <div v-else class="flex h-full items-center justify-center text-gray-500">
        {{ $t('generator.config.selectPrompt') }}
      </div>
    </div>
  </DualPaneLayout>
</template>
