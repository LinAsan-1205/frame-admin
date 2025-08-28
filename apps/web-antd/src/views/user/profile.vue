<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Menu } from 'ant-design-vue';

const items = [
  {
    key: 'foundation',
    label: '基础设置',
  },
  {
    key: 'safe',
    label: '安全设置',
  },
];
const activeKey = ref(['foundation']);
</script>
<template>
  <Page>
    <div class="card-box p-5">
      <div class="flex gap-7">
        <div class="flex min-w-[200px] flex-shrink-0">
          <Menu
            :items="items"
            mode="inline"
            v-model:selected-keys="activeKey"
          />
        </div>
        <div class="flex flex-1">333</div>
      </div>
    </div>
  </Page>
</template>
