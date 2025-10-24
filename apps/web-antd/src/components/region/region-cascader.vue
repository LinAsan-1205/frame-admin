<script setup lang="ts">
import type { CascaderProps } from 'ant-design-vue';
import type { ValueType } from 'ant-design-vue/es/vc-cascader/Cascader';

import { computed, onMounted, ref, watch } from 'vue';

import { Cascader } from 'ant-design-vue';

import { getRegionById, getRegionList } from '#/api/system/region';
import { $t } from '#/locales';

export type CascaderOption = NonNullable<CascaderProps['options']>[number];

interface Props {
  /**
   * v-model 绑定值
   */

  modelValue?: number | number[] | undefined;
  /**
   * v-model:value 绑定值（Vben Form 使用）
   */
  value?: number | number[] | undefined;
  /**
   * 最大层级（1=省, 2=市, 3=区县, 4=街道）
   * @default 4
   */
  maxLevel?: number;
  /**
   * 占位符
   */
  // eslint-disable-next-line vue/require-default-prop
  placeholder?: string;
  /**
   * 是否允许清空
   * @default true
   */
  allowClear?: boolean;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 返回值类型：'id' 返回最后一级ID，'path' 返回完整路径数组
   * @default 'id'
   */
  valueType?: 'id' | 'path';
}

const props = withDefaults(defineProps<Props>(), {
  maxLevel: 4,
  allowClear: true,
  disabled: false,
  valueType: 'id',
  modelValue: undefined,
  value: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | number[] | undefined): void;
  (e: 'update:value', value: number | number[] | undefined): void;
  (
    e: 'change',
    value: number | number[] | undefined,
    options: CascaderOption[],
  ): void;
}>();

// 内部值（用于级联选择器，必须是 number[] 类型）
const cascaderValue = ref<(number | string)[]>([]);

// 级联选择器选项
const options = ref<CascaderProps['options']>([]);

// 加载状态
const loading = ref(false);

// 外部传入的值（优先使用 v-model，其次 v-model:value）
const externalValue = computed(
  () => (props.modelValue ?? props.value) as number | number[] | undefined,
);

/**
 * 加载根级数据（省级）
 */
async function loadRootRegions() {
  loading.value = true;
  try {
    const regions = await getRegionList({ level: 1, limit: 100 });
    options.value = regions.map((region) => ({
      value: region.id,
      label: region.title,
      isLeaf: props.maxLevel === 1,
      level: 1,
      type: region.type,
    }));
  } catch (error) {
    console.error('加载省级数据失败:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 动态加载子级数据
 */
const loadData: CascaderProps['loadData'] = async (selectedOptions) => {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  const currentLevel = (targetOption as any).level || 1;
  const nextLevel = currentLevel + 1;

  // 如果已经达到最大层级，不再加载
  if (nextLevel > props.maxLevel) {
    targetOption!.isLeaf = true;
    return;
  }

  targetOption!.loading = true;

  try {
    const children = await getRegionList({
      parentId: targetOption!.value as number,
      level: nextLevel,
      limit: 200,
    });

    // 如果没有子节点，标记为叶子节点
    if (!children || children.length === 0) {
      targetOption!.isLeaf = true;
      targetOption!.children = [];
    } else {
      targetOption!.children = children.map((region) => ({
        value: region.id,
        label: region.title,
        isLeaf: nextLevel >= props.maxLevel,
        level: nextLevel,
        type: region.type,
      }));
    }
  } catch (error) {
    console.error('加载子级数据失败:', error);
    targetOption!.isLeaf = true;
    targetOption!.children = [];
  } finally {
    targetOption!.loading = false;
  }
};

/**
 * 根据区域 ID 获取完整的层级路径
 * @param regionId 区域 ID
 * @returns 完整路径数组 [省ID, 市ID, 区ID]
 */
async function getRegionPath(regionId: number): Promise<number[]> {
  const path: number[] = [];
  let currentId: number | undefined = regionId;

  try {
    // 递归查询父级，构建完整路径
    while (currentId) {
      const region = await getRegionById(currentId);
      path.unshift(region.id); // 添加到数组开头

      // 如果没有父级或父级为0，停止查询
      if (!region.parentId || region.parentId === 0) {
        break;
      }

      currentId = region.parentId;
    }
  } catch (error) {
    console.error('获取区域路径失败:', error);
  }

  return path;
}

/**
 * 预加载路径上的所有节点
 * 确保 Cascader 能够找到对应的 label
 */
async function preloadPath(path: number[]) {
  if (!path || path.length === 0) return;

  // 加载省级数据（如果还没加载）
  if (options.value?.length === 0) {
    await loadRootRegions();
  }

  // 递归加载每一层
  let currentOptions = options.value;
  for (let i = 0; i < path.length - 1; i++) {
    const currentId = path[i];
    const option = currentOptions?.find((opt) => opt.value === currentId);

    if (option && !option.children) {
      const children = await getRegionList({
        parentId: currentId,
        level: i + 2,
      });

      if (!children || children.length === 0) {
        option.isLeaf = true;
        option.children = [];
      } else {
        option.children = children.map((region) => ({
          value: region.id,
          label: region.title,
          isLeaf: i + 2 >= props.maxLevel,
          level: i + 2,
          type: region.type,
        }));
      }
    }

    currentOptions = option?.children || [];
  }
}

/**
 * 级联选择器值变化
 */
function onChange(value: ValueType, selectedOptions: CascaderOption[]) {
  if (!value || value.length === 0) {
    emit('update:modelValue', undefined);
    emit('update:value', undefined);
    emit('change', undefined, selectedOptions);
    return;
  }

  const numberValue = value.map(Number);

  if (props.valueType === 'path') {
    emit('update:modelValue', numberValue);
    emit('update:value', numberValue);
    emit('change', numberValue, selectedOptions);
  } else {
    const lastId = numberValue[numberValue.length - 1];
    emit('update:modelValue', lastId);
    emit('update:value', lastId);
    emit('change', lastId, selectedOptions);
  }
}

/**
 * 监听外部 modelValue 变化，同步到级联选择器
 */
watch(
  externalValue,
  async (newValue) => {
    if (
      newValue === undefined ||
      newValue === null ||
      (Array.isArray(newValue) && newValue.length === 0)
    ) {
      cascaderValue.value = [];
      return;
    }

    if (Array.isArray(newValue)) {
      const numberPath = newValue.map(Number);
      await preloadPath(numberPath);
      cascaderValue.value = numberPath;
      return;
    }

    loading.value = true;
    try {
      const numericId = Number(newValue);
      if (Number.isNaN(numericId)) {
        cascaderValue.value = [];
        return;
      }
      const path = await getRegionPath(numericId);
      await preloadPath(path);
      cascaderValue.value = path;
    } catch (error) {
      console.error('设置区域值失败:', error);
      cascaderValue.value = [];
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);

onMounted(() => {
  loadRootRegions();
});
</script>

<template>
  <Cascader
    v-model:value="cascaderValue"
    :options="options"
    :load-data="loadData"
    :placeholder="props.placeholder ?? $t('system.region.parentIdPlaceholder')"
    :allow-clear="props.allowClear"
    :disabled="props.disabled"
    :loading="loading"
    change-on-select
    @change="onChange"
  />
</template>
