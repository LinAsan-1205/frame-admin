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
      <!-- 调试信息 -->
      <div v-if="!data" class="debug-info">
        <p>❌ 未接收到数据 (data is {{ data }})</p>
      </div>
      <div v-else-if="!data.previews" class="debug-info">
        <p>❌ 数据中没有 previews 字段</p>
        <p>数据内容: {{ JSON.stringify(data, null, 2) }}</p>
      </div>
      <div v-else-if="data.previews.length === 0" class="debug-info">
        <p>❌ previews 数组为空</p>
      </div>

      <!-- 正常显示 -->
      <Tabs v-else v-model:active-key="activeKey">
        <TabPane
          v-for="(file, index) in data.previews"
          :key="String(index)"
          :tab="file.fileName"
        >
          <div class="code-container">
            <Codemirror
              v-model="file.content"
              :extensions="extensions"
              :style="{ height: '600px' }"
              :autofocus="false"
              :indent-with-tab="true"
              :tab-size="2"
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

  .debug-info {
    padding: 20px;
    margin: 20px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;

    p {
      margin: 10px 0;
      font-size: 14px;
    }
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-size: 14px;
    color: #999;
  }

  .code-container {
    height: 600px;
    overflow: auto;
  }
}
</style>
