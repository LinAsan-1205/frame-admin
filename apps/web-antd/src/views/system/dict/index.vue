<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ColPage } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, Tooltip } from 'ant-design-vue';

import DictCategory from './modules/dict-category.vue';
import DictDataList from './modules/dict-data-list.vue';

const dictId = ref<number | undefined>();

const props = reactive({
  leftCollapsedWidth: 5,
  leftCollapsible: true,
  leftMaxWidth: 50,
  leftMinWidth: 20,
  leftWidth: 20,
  resizable: true,
  rightWidth: 80,
  splitHandle: false,
  splitLine: false,
});
</script>

<template>
  <ColPage v-bind="props" auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <div v-if="isCollapsed" @click="expand">
        <Tooltip title="点击展开左侧">
          <Button shape="circle" type="primary">
            <template #icon>
              <IconifyIcon class="text-2xl" icon="bi:arrow-right" />
            </template>
          </Button>
        </Tooltip>
      </div>
      <div
        v-else
        class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-4"
      >
        <DictCategory v-model="dictId" />
      </div>
    </template>
    <DictDataList v-model:dict-id="dictId" />
  </ColPage>
</template>
