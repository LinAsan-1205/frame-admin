<script setup lang="ts">
import type { DualPaneLayoutProps } from './types';

import { reactive } from 'vue';

import { ColPage } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, Tooltip } from 'ant-design-vue';

defineOptions({
  name: 'DualPaneLayout',
});

const props = withDefaults(defineProps<DualPaneLayoutProps>(), {
  leftCollapsedWidth: 5,
  leftCollapsible: true,
  leftMaxWidth: 20,
  leftMinWidth: 20,
  leftWidth: 20,
  resizable: true,
  rightWidth: 80,
  splitHandle: false,
  splitLine: false,
  expandTooltip: '点击展开左侧',
});

// 合并props到响应式对象，用于传递给ColPage
const colPageProps = reactive({
  leftCollapsedWidth: props.leftCollapsedWidth,
  leftCollapsible: props.leftCollapsible,
  leftMaxWidth: props.leftMaxWidth,
  leftMinWidth: props.leftMinWidth,
  leftWidth: props.leftWidth,
  resizable: props.resizable,
  rightWidth: props.rightWidth,
  splitHandle: props.splitHandle,
  splitLine: props.splitLine,
});
</script>

<template>
  <ColPage v-bind="colPageProps" auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <div v-if="isCollapsed" @click="expand">
        <Tooltip :title="expandTooltip">
          <Button shape="circle" type="primary">
            <template #icon>
              <IconifyIcon class="text-2xl" icon="bi:arrow-right" />
            </template>
          </Button>
        </Tooltip>
      </div>
      <div v-else class="h-full">
        <!-- 左侧内容插槽 -->
        <slot name="left"></slot>
      </div>
    </template>

    <slot></slot>
  </ColPage>
</template>
