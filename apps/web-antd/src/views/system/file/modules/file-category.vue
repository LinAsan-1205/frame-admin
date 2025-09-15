<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { VbenIcon, VbenIconButton } from '@vben-core/shadcn-ui';

import { useQuery } from '@tanstack/vue-query';
import {
  Badge,
  Card,
  Dropdown,
  Input,
  Menu,
  MenuItem,
  message,
  Modal,
} from 'ant-design-vue';

import {
  deleteFileCategory,
  queryFileCategoryList,
} from '#/api/system/file/category';
import {
  FileCategoryStatusEnum,
  FileCategoryTypeEnum,
} from '#/api/system/file/category/enum';
import { $t } from '#/locales';

import FileCategoryForm from './file-category-form.vue';

/**
 * 文件分类组件
 * 使用卡片式布局展示分类信息
 */
const searchValue = ref('');
const categoryListRef = ref<HTMLElement>();

const [FileCategoryFormModal, fileCategoryFormModalApi] = useVbenModal({
  connectedComponent: FileCategoryForm,
  destroyOnClose: true,
});

const { data, refetch, isLoading } = useQuery({
  experimental_prefetchInRender: true,
  queryFn: queryFileCategoryList,
  queryKey: ['fileCategoryList'],
  refetchOnMount: 'always',
  staleTime: 1000 * 60 * 5,
});

const modelValue = defineModel<number | undefined>();

/**
 * 过滤后的分类列表
 */
const filteredCategories = computed(() => {
  if (!data.value) return [];
  if (!searchValue.value) return data.value;

  return data.value.filter(
    (category) =>
      category.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
      category.code.toLowerCase().includes(searchValue.value.toLowerCase()),
  );
});

/**
 * 选择分类
 * @param categoryId 分类ID
 */
const onSelect = (categoryId: number) => {
  modelValue.value = categoryId;
};

/**
 * 新增分类
 */
const onAdd = () => {
  fileCategoryFormModalApi.setData({}).open();
};

/**
 * 删除分类
 * @param id 分类ID
 */
const onDelete = (id: number) => {
  const categoryName = data?.value?.find((item) => item.id === id)?.name;
  Modal.confirm({
    title: $t('system.fileCategory.deleteConfirm'),
    content: $t('system.fileCategory.deleteConfirmContent', [categoryName]),
    onOk: async () => {
      try {
        await deleteFileCategory(id);
        message.success($t('system.fileCategory.deleteSuccess'));
        onRefresh();
      } catch {
        message.error($t('system.fileCategory.deleteFailed'));
      }
    },
  });
};

/**
 * 编辑分类
 * @param id 分类ID
 */
const onEdit = (id: number) => {
  const row = data?.value?.find((item) => item.id === id);
  if (row) {
    fileCategoryFormModalApi.setData(row).open();
  } else {
    message.error($t('system.fileCategory.setFailed'));
  }
};

/**
 * 刷新数据
 */
const onRefresh = () => {
  refetch();
};

/**
 * 获取分类状态标签
 * @param status 状态值
 */
function getStatusLabel(status: number) {
  const statusOption = FileCategoryStatusEnum.raw(status);
  return statusOption?.label || $t('system.fileCategory.unknown');
}

/**
 * 获取分类类型标签
 * @param type 类型值
 */
function getTypeLabel(type: string) {
  const typeOption = FileCategoryTypeEnum.raw(type);
  return typeOption?.label || type;
}

/**
 * 检查分类是否被选中
 * @param categoryId 分类ID
 */
function isSelected(categoryId: number) {
  return modelValue.value === categoryId;
}

/**
 * 处理菜单点击事件
 * @param key 菜单键
 * @param categoryId 分类ID
 */
function handleMenuClick(key: string, categoryId: number) {
  switch (key) {
    case 'delete': {
      onDelete(categoryId);
      break;
    }
    case 'edit': {
      onEdit(categoryId);
      break;
    }
  }
}

function handleClickOutside(event: MouseEvent) {
  if (
    categoryListRef.value &&
    !categoryListRef.value.contains(event.target as Node)
  ) {
    modelValue.value = undefined;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
  <FileCategoryFormModal @success="onRefresh" />
  <div class="space-y-2">
    <div class="space-y-2">
      <!-- 标题和操作按钮 -->
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ $t('system.fileCategory.title') }}
        </h3>
        <div class="flex items-center space-x-2">
          <VbenIconButton
            @click="onRefresh"
            :tooltip="$t('system.fileCategory.refresh')"
            :loading="isLoading"
          >
            <VbenIcon icon="ri:refresh-line" />
          </VbenIconButton>
          <VbenIconButton
            @click="onAdd"
            :tooltip="$t('system.fileCategory.add')"
          >
            <VbenIcon icon="ri:add-line" />
          </VbenIconButton>
        </div>
      </div>

      <!-- 搜索栏 -->
      <Input
        v-model:value="searchValue"
        :placeholder="$t('system.fileCategory.searchPlaceholder')"
        class="w-full"
      >
        <template #prefix>
          <VbenIcon icon="ri:search-line" class="text-gray-400" />
        </template>
      </Input>
    </div>

    <div ref="categoryListRef" class="space-y-2">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="py-8 text-center">
        <VbenIcon
          icon="ri:loader-4-line"
          class="mx-auto mb-2 size-8 animate-spin text-gray-400"
        />
        <p class="text-sm text-gray-500">
          {{ $t('system.fileCategory.loading') }}
        </p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredCategories.length === 0" class="py-8 text-center">
        <VbenIcon
          icon="ri:folder-line"
          class="mx-auto mb-2 size-8 text-gray-300"
        />
        <p class="text-sm text-gray-500">
          {{ $t('system.fileCategory.noCategories') }}
        </p>
      </div>

      <!-- 分类卡片列表 -->
      <div v-else class="space-y-1">
        <Card
          :body-style="{ padding: 0 }"
          v-for="category in filteredCategories"
          :key="category.id"
          class="cursor-pointer p-3 transition-all duration-200 hover:shadow-md"
          :class="[
            isSelected(category.id)
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'hover:border-gray-300',
          ]"
          @click="onSelect(category.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex min-w-0 flex-1 items-center space-x-3">
              <!-- 分类图标 -->
              <div class="flex-shrink-0">
                <VbenIcon
                  v-if="category.icon"
                  :icon="category.icon"
                  class="text-primary size-5"
                />
                <VbenIcon
                  v-else
                  icon="ri:folder-line"
                  class="size-5 text-gray-400"
                />
              </div>

              <!-- 分类信息 -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center space-x-2">
                  <h4
                    class="truncate text-sm font-medium"
                    :title="category.name"
                  >
                    {{ category.name }}
                  </h4>
                  <Badge
                    :status="
                      category.status === FileCategoryStatusEnum.Normal
                        ? 'success'
                        : 'error'
                    "
                    :text="getStatusLabel(category.status)"
                    size="small"
                  />
                </div>
                <div class="mt-1 flex items-center space-x-2">
                  <span class="text-xs text-gray-500">{{ category.code }}</span>
                  <span class="text-xs text-gray-400">•</span>
                  <span class="text-xs text-gray-500">{{
                    getTypeLabel(category.type)
                  }}</span>
                </div>
                <p
                  v-if="category.description"
                  class="mt-1 truncate text-xs text-gray-400"
                >
                  {{ category.description }}
                </p>
              </div>
            </div>

            <!-- 操作按钮 -->
            <Dropdown :trigger="['click']" @click.stop>
              <VbenIconButton>
                <VbenIcon icon="ri:more-2-line" />
              </VbenIconButton>
              <template #overlay>
                <Menu
                  @click="
                    ({ key }) => handleMenuClick(key as string, category.id)
                  "
                >
                  <MenuItem key="edit">
                    <span class="flex items-center">
                      <VbenIcon icon="ri:edit-line" class="mr-1 size-4" />
                      {{ $t('common.edit') }}
                    </span>
                  </MenuItem>
                  <MenuItem key="delete" class="text-red-500">
                    <span class="flex items-center">
                      <VbenIcon icon="ri:delete-bin-line" class="mr-1 size-4" />
                      {{ $t('common.delete') }}
                    </span>
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
