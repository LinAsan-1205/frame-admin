<script setup lang="ts">
import { ref } from 'vue';

import { DualPaneLayout } from '#/components/dual-pane-layout';

import ConfigGroupCategory from './modules/config-group-category.vue';
import ConfigGroupItem from './modules/config-group-item.vue';

const groupId = ref<number | undefined>();
</script>

<template>
  <DualPaneLayout :left-max-width="15">
    <!-- 左侧：配置组分类 -->
    <template #left>
      <div
        class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-4"
      >
        <ConfigGroupCategory v-model="groupId" />
      </div>
    </template>
    <div
      class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-4"
    >
      <ConfigGroupItem v-model:group-id="groupId" />
    </div>
  </DualPaneLayout>
</template>
