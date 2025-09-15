# DualPaneLayout 双栏布局组件

一个基于 `@vben/common-ui` 的 `ColPage` 组件封装的双栏布局组件，支持左右分栏、可折叠、可拖拽调整大小等功能。

## 特性

- 🎨 双栏布局，左右分栏显示
- 📱 左侧面板可折叠，节省空间
- 🔧 支持拖拽调整左右面板大小
- 🎯 完整的 TypeScript 类型支持
- 🔌 插槽模式，灵活自定义内容

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { DualPaneLayout } from '@/components/dual-pane-layout';
import DictCategory from './modules/dict-category.vue';
import DictDataList from './modules/dict-data-list.vue';

// 可选：自定义配置
const layoutProps = {
  leftWidth: 25,
  rightWidth: 75,
  leftMinWidth: 15,
  leftMaxWidth: 40,
};
</script>

<template>
  <DualPaneLayout v-bind="layoutProps">
    <!-- 左侧内容 -->
    <template #left>
      <DictCategory @select="handleCategorySelect" />
    </template>

    <!-- 右侧内容 -->
    <template #right>
      <DictDataList :dict-id="selectedDictId" />
    </template>
  </DualPaneLayout>
</template>
```

### 使用默认配置

```vue
<script setup lang="ts">
import { DualPaneLayout } from '@/components/dual-pane-layout';
import DictCategory from './modules/dict-category.vue';
import DictDataList from './modules/dict-data-list.vue';

const selectedDictId = ref<number>();

const handleCategorySelect = (dictId: number) => {
  selectedDictId.value = dictId;
};
</script>

<template>
  <!-- 使用默认配置 -->
  <DualPaneLayout>
    <template #left>
      <DictCategory @select="handleCategorySelect" />
    </template>

    <template #right>
      <DictDataList :dict-id="selectedDictId" />
    </template>
  </DualPaneLayout>
</template>
```

## Props 配置

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `leftCollapsedWidth` | `number` | `5` | 左侧面板折叠后的宽度百分比 |
| `leftCollapsible` | `boolean` | `true` | 左侧面板是否可折叠 |
| `leftMaxWidth` | `number` | `50` | 左侧面板最大宽度百分比 |
| `leftMinWidth` | `number` | `20` | 左侧面板最小宽度百分比 |
| `leftWidth` | `number` | `20` | 左侧面板默认宽度百分比 |
| `resizable` | `boolean` | `true` | 是否支持拖拽调整大小 |
| `rightWidth` | `number` | `80` | 右侧面板宽度百分比 |
| `splitHandle` | `boolean` | `false` | 是否显示分割线拖拽手柄 |
| `splitLine` | `boolean` | `false` | 是否显示分割线 |
| `expandTooltip` | `string` | `'点击展开左侧'` | 展开按钮的提示文本 |

## 插槽

| 插槽名  | 说明         |
| ------- | ------------ |
| `left`  | 左侧面板内容 |
| `right` | 右侧面板内容 |

## 迁移指南

### 从原始代码迁移

**原始代码：**

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ColPage } from '@vben/common-ui';
import DictCategory from './modules/dict-category.vue';
import DictDataList from './modules/dict-data-list.vue';

const dictId = ref<number | undefined>();

const props = reactive({
  leftCollapsedWidth: 5,
  leftCollapsible: true,
  // ... 其他配置
});
</script>

<template>
  <ColPage v-bind="props" auto-content-height>
    <!-- 复杂的左侧展开逻辑 -->
    <DictCategory />
    <DictDataList />
  </ColPage>
</template>
```

**迁移后：**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DualPaneLayout } from '@/components/dual-pane-layout';
import DictCategory from './modules/dict-category.vue';
import DictDataList from './modules/dict-data-list.vue';

const dictId = ref<number | undefined>();
</script>

<template>
  <DualPaneLayout>
    <template #left>
      <DictCategory />
    </template>
    <template #right>
      <DictDataList :dict-id="dictId" />
    </template>
  </DualPaneLayout>
</template>
```

## 优势

1. **代码复用性** - 封装了常见的双栏布局逻辑
2. **类型安全** - 完整的 TypeScript 类型定义
3. **灵活性** - 支持自定义配置和插槽内容
4. **一致性** - 统一的布局样式和交互行为
5. **易维护** - 集中管理布局相关的逻辑
