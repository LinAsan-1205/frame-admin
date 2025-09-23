<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Codemirror } from 'vue-codemirror';

import { useVbenDrawer } from '@vben/common-ui';

import { javascript } from '@codemirror/lang-javascript';
import { vue } from '@codemirror/lang-vue';
import { oneDark } from '@codemirror/theme-one-dark';
import { TabPane, Tabs } from 'ant-design-vue';

const activeKey = ref('0');
const data = ref<any>(null);

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-1/2',
  showConfirmButton: false,
  showCancelButton: false,
  onCancel() {
    drawerApi.close();
  },

  onOpenChange(isOpen) {
    if (isOpen) {
      data.value = drawerApi.getData();
    }
  },
});

const extensions = computed(() => {
  const current = data.value?.previews?.[Number(activeKey.value)];
  if (current?.language === 'vue') {
    return [vue(), oneDark];
  }
  return [javascript({ typescript: true }), oneDark];
});
</script>

<template>
  <Drawer>
    <div class="code-preview">
      <Tabs v-model:active-key="activeKey" class="h-full">
        <TabPane
          v-for="(file, index) in data.previews"
          :key="String(index)"
          :tab="file.fileName"
          class="h-full"
        >
          <div class="code-container">
            <Codemirror
              v-model="file.content"
              :extensions="extensions"
              :style="{ height: '100%' }"
              :autofocus="false"
              :indent-with-tab="true"
              :tab-size="4"
              disabled
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  </Drawer>
</template>

<style lang="scss" scoped>
.code-preview {
  height: 100%;

  :deep(.ant-tabs-content) {
    height: 100%;
  }

  .code-container {
    height: 100%;
    overflow: auto;
  }
}
</style>
