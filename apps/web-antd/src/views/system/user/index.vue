<script setup lang="ts">
import { ref } from 'vue';

import { DualPaneLayout } from '#/components/dual-pane-layout';

import DeptTree from './modules/dept-tree.vue';
import UserList from './user-list.vue';

const deptId = ref<number | undefined>();
</script>

<template>
  <DualPaneLayout>
    <template #left>
      <div
        class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-4"
      >
        <DeptTree v-model="deptId" />
      </div>
    </template>

    <UserList v-model:dept-id="deptId" />
  </DualPaneLayout>
</template>
