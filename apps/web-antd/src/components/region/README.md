# RegionCascader 行政区域级联选择器

一个按层级分级加载的行政区域级联选择组件，支持省->市->区县->街道的动态加载。

## 功能特性

- ✅ 按需动态加载：只在用户展开时才加载下级数据
- ✅ 层级可配置：支持配置最大层级（1-4级）
- ✅ 每个级别单选：支持在任意层级选择（省、市、区县、街道），无需选到最后一级
- ✅ 数据量优化：每次只加载当前级别的数据，避免一次性加载所有数据
- ✅ 双向绑定：支持 v-model
- ✅ 灵活的返回值：可返回最后一级 ID 或完整路径数组
- ✅ 国际化支持：集成项目国际化
- ✅ 智能叶子节点：自动识别没有下级的区域，不显示展开箭头

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `number \| number[] \| undefined` | - |
| `maxLevel` | 最大层级（1=省, 2=市, 3=区县, 4=街道） | `number` | `4` |
| `placeholder` | 占位符 | `string` | `'请选择父级区域'` |
| `allowClear` | 是否允许清空 | `boolean` | `true` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `valueType` | 返回值类型：'id' 返回最后一级ID，'path' 返回完整路径数组 | `'id' \| 'path'` | `'id'` |

## 基础用法

### 1. 在 Vue 组件中直接使用

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RegionCascader } from '#/components/region';

const selectedRegion = ref<number>();
</script>

<template>
  <RegionCascader v-model="selectedRegion" />
</template>
```

### 2. 限制层级（只显示到市级）

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RegionCascader } from '#/components/region';

const selectedCity = ref<number>();
</script>

<template>
  <!-- 只显示省和市两级 -->
  <RegionCascader
    v-model="selectedCity"
    :max-level="2"
    placeholder="请选择省市"
  />
</template>
```

### 3. 获取完整路径

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RegionCascader } from '#/components/region';

// 返回格式：[省ID, 市ID, 区县ID, 街道ID]
const regionPath = ref<number[]>([]);
</script>

<template>
  <RegionCascader v-model="regionPath" value-type="path" />
</template>
```

## 在 Vben 表单中使用

由于 Vben Form 不直接支持注册自定义组件，我们需要使用 `component: 'Input'` 的插槽方式来集成。

### 方式一：在表单模态框中使用（推荐）

```vue
<script setup lang="ts">
import { RegionCascader } from '#/components/region';
import { useVbenForm } from '#/adapter/form';

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      fieldName: 'title',
      label: '区域名称',
    },
    // 其他字段...
  ],
});

const parentRegionId = ref<number>();
</script>

<template>
  <Form />

  <!-- 单独添加级联选择器 -->
  <div class="mb-4">
    <label class="mb-2 block">父级区域</label>
    <RegionCascader v-model="parentRegionId" />
  </div>
</template>
```

### 方式二：替换原有的 ApiSelect

在 `form-schemas.ts` 中，你可以移除原有的 `ApiSelect` 配置，然后在表单组件中单独使用 `RegionCascader`：

**修改前：**

```typescript
{
  component: 'ApiSelect',
  componentProps: {
    api: async () => {
      return await getRegionList({ limit: 200 });
    },
    labelField: 'title',
    valueField: 'id',
  },
  fieldName: 'parentId',
  label: $t('system.region.parentId'),
}
```

**修改后（在 form-schemas.ts 中移除该字段，在组件中单独使用）：**

```vue
<script setup lang="ts">
import { RegionCascader } from '#/components/region';
import { useVbenForm } from '#/adapter/form';
import { useFormSchema } from './config/form-schemas';

const formData = ref<Region.View>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(), // 不包含 parentId 字段
  showDefaultActions: false,
});

// 单独管理 parentId
const parentId = ref<number>();

// 提交时合并数据
async function onSubmit() {
  const values = await formApi.getValues();
  const data = {
    ...values,
    parentId: parentId.value,
  };
  // 提交数据...
}
</script>

<template>
  <Form />

  <div class="form-item">
    <label>父级区域</label>
    <RegionCascader v-model="parentId" :max-level="3" />
  </div>
</template>
```

## 使用场景

### 场景 1：用户选择所在地区

```vue
<RegionCascader
  v-model="userRegionId"
  :max-level="3"
  placeholder="请选择省市区"
/>
```

### 场景 2：选择配送区域（只到市级）

```vue
<RegionCascader
  v-model="deliveryRegionId"
  :max-level="2"
  placeholder="请选择配送城市"
/>
```

### 场景 3：选择父级区域（用于新增区域时）

```vue
<RegionCascader
  v-model="parentRegionId"
  :max-level="3"
  placeholder="请选择父级区域"
  allow-clear
/>
```

### 场景 4：支持任意层级选择

组件默认支持在任意层级停止选择，用户可以：

- 只选择省级（如："北京市"）
- 选择到市级（如："北京市 / 朝阳区"）
- 选择到区县级（如："北京市 / 朝阳区 / 建国门街道"）

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { RegionCascader } from '#/components/region';

const selectedRegionId = ref<number>();

// 监听选择变化
watch(selectedRegionId, (newId) => {
  console.log('选中的区域ID:', newId);
  // 用户可能选择了省、市、区县或街道中的任意一级
});
</script>

<template>
  <RegionCascader
    v-model="selectedRegionId"
    :max-level="4"
    placeholder="请选择区域（可在任意层级选择）"
  />
</template>
```

## 性能优化

1. **按需加载**：只在用户展开时才加载下级数据
2. **数据限制**：每次查询限制返回数量（省级100条，其他200条）
3. **层级控制**：通过 `maxLevel` 限制最大层级，减少不必要的加载

## 数据流程

```
用户打开组件
    ↓
加载省级数据 (level=1, limit=100)
    ↓
用户选择省 → 可以在此停止选择，返回省ID
    ↓
动态加载该省的市级数据 (parentId=省ID, level=2, limit=200)
    ↓
用户选择市 → 可以在此停止选择，返回市ID
    ↓
动态加载该市的区县数据 (parentId=市ID, level=3, limit=200)
    ↓
用户选择区县 → 可以在此停止选择，返回区县ID
    ↓
动态加载该区县的街道数据 (parentId=区县ID, level=4, limit=200)
    ↓
用户选择街道 → 返回街道ID

注：用户可以在任意层级停止选择，组件会返回该层级的ID
```

## 注意事项

1. **初始值设置**：如果 `valueType='id'`，只需设置最后一级的 ID；如果 `valueType='path'`，需要设置完整路径数组
2. **层级限制**：`maxLevel` 设置后，超过该层级的数据不会加载
3. **清空操作**：支持清空选择，清空后会触发 `v-model` 更新为 `undefined`
4. **禁用状态**：设置 `disabled` 后组件不可交互

## API 依赖

组件依赖以下 API：

- `getRegionList(params)` - 查询行政区域列表

确保后端接口支持以下参数：

- `level` - 查询指定层级
- `parentId` - 查询指定父级下的子级
- `limit` - 限制返回数量
