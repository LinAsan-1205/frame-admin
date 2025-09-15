<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import DictCategory from './modules/dict-category.vue';
import DictDataList from './modules/dict-data-list.vue';

const dictId = ref<number | undefined>();
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full w-full space-x-2">
      <div class="min-w-64 flex-shrink-0">
        <DictCategory v-model="dictId" />
      </div>
      <div class="min-w-0 flex-1">
        <DictDataList v-model:dict-id="dictId" />
      </div>
    </div>
  </Page>
</template>
