<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { VbenIcon, VbenIconButton, VbenSpinner } from '@vben-core/shadcn-ui';

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

import { delDictById, queryDictList, Status } from '#/api/system/dict';
import { $t } from '#/locales';

import DictForm from './dict-form.vue';

/**
 * 字典分类组件
 * 使用卡片式布局展示字典信息
 */
const searchValue = ref('');
const categoryListRef = ref<HTMLElement>();

const [DictFormDrawer, dictFormDrawerApi] = useVbenDrawer({
  connectedComponent: DictForm,
  destroyOnClose: true,
});

const { data, refetch, isLoading, isFetching } = useQuery({
  experimental_prefetchInRender: true,
  queryFn: () => queryDictList(),
  queryKey: ['dictList'],
  refetchOnMount: 'always',
  staleTime: 1000 * 60 * 5,
});

const modelValue = defineModel<number | undefined>();

/**
 * 过滤后的字典列表
 */
const filteredDicts = computed(() => {
  if (!data.value) return [];
  if (!searchValue.value) return data.value;

  return data.value.filter(
    (dict) =>
      dict.dictName.toLowerCase().includes(searchValue.value.toLowerCase()) ||
      dict.dictType.toLowerCase().includes(searchValue.value.toLowerCase()),
  );
});

/**
 * 选择字典
 * @param dictId 字典ID
 */
const onSelect = (dictId: number) => {
  modelValue.value = dictId;
};

/**
 * 新增字典
 */
const onAdd = () => {
  dictFormDrawerApi.setData({}).open();
};

/**
 * 删除字典
 * @param id 字典ID
 */
const onDelete = (id: number) => {
  const dictName = data?.value?.find((item) => item.id === id)?.dictName;
  Modal.confirm({
    title: $t('common.tip'),
    content: `${$t('common.confirmDelete')} "${dictName}"？`,
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: async () => {
      try {
        await delDictById(id);
        message.success($t('common.deleteSuccess'));
        onRefresh();
      } catch {
        message.error($t('common.deleteFailed'));
      }
    },
  });
};

/**
 * 编辑字典
 * @param id 字典ID
 */
const onEdit = (id: number) => {
  const row = data?.value?.find((item) => item.id === id);
  if (row) {
    dictFormDrawerApi.setData(row).open();
  } else {
    message.error($t('common.operationFailed'));
  }
};

/**
 * 刷新数据
 */
const onRefresh = () => {
  refetch();
};

/**
 * 获取状态标签
 * @param status 状态值
 */
function getStatusLabel(status: string) {
  const statusOption = Status.raw(status);
  return statusOption?.label || status;
}

/**
 * 检查字典是否被选中
 * @param dictId 字典ID
 */
function isSelected(dictId: number) {
  return modelValue.value === dictId;
}

/**
 * 处理菜单点击事件
 * @param key 菜单键
 * @param dictId 字典ID
 */
function handleMenuClick(key: string, dictId: number) {
  switch (key) {
    case 'delete': {
      onDelete(dictId);
      break;
    }
    case 'edit': {
      onEdit(dictId);
      break;
    }
  }
}
</script>

<template>
  <DictFormDrawer @success="onRefresh" />
  <div class="space-y-2">
    <div class="mb-3 space-y-3 border-b border-gray-100 pb-3">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ $t('system.dict.title') }}
        </h3>
        <div class="flex items-center space-x-2">
          <VbenIconButton
            @click="onRefresh"
            :tooltip="$t('common.refresh')"
            :loading="isLoading || isFetching"
          >
            <VbenIcon icon="ri:refresh-line" />
          </VbenIconButton>
          <VbenIconButton @click="onAdd" :tooltip="$t('common.add')">
            <VbenIcon icon="ri:add-line" />
          </VbenIconButton>
        </div>
      </div>

      <Input
        v-model:value="searchValue"
        :placeholder="$t('system.dict.dictNamePlaceholder')"
        class="w-full"
      >
        <template #prefix>
          <VbenIcon icon="ri:search-line" class="text-gray-400" />
        </template>
      </Input>
    </div>

    <div ref="categoryListRef" class="space-y-2">
      <VbenSpinner
        v-if="isLoading && !data"
        :spinning="true"
        class="min-h-[200px]"
      />

      <!-- 空状态 -->
      <div v-else-if="filteredDicts.length === 0" class="py-8 text-center">
        <VbenIcon
          icon="ri:book-line"
          class="mx-auto mb-2 size-8 text-gray-300"
        />
        <p class="text-sm text-gray-500">
          {{ $t('common.noData') }}
        </p>
      </div>

      <div v-else class="space-y-1">
        <Card
          :body-style="{ padding: 0 }"
          v-for="dict in filteredDicts"
          :key="dict.id"
          class="cursor-pointer p-3 transition-all duration-200 hover:shadow-md"
          :class="[
            isSelected(dict.id)
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'hover:border-gray-300',
          ]"
          @click="onSelect(dict.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex min-w-0 flex-1 items-center space-x-3">
              <div class="flex-shrink-0">
                <VbenIcon icon="ri:book-2-line" class="text-primary size-5" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center space-x-2">
                  <h4
                    class="truncate text-sm font-medium"
                    :title="dict.dictName"
                  >
                    {{ dict.dictName }}
                  </h4>
                  <Badge
                    :status="
                      dict.status === Status.Normal ? 'success' : 'error'
                    "
                    :text="getStatusLabel(dict.status)"
                    size="small"
                  />
                </div>
                <div class="mt-1 flex items-center space-x-2">
                  <span class="text-xs text-gray-500">{{ dict.dictType }}</span>
                  <div v-if="dict.remark" class="text-xs text-gray-400">•</div>
                  <span
                    v-if="dict.remark"
                    class="flex-1 truncate text-xs text-gray-400"
                    :title="dict.remark"
                  >
                    {{ dict.remark }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <Dropdown :trigger="['click']" @click.stop>
              <VbenIconButton>
                <VbenIcon icon="ri:more-2-line" />
              </VbenIconButton>
              <template #overlay>
                <Menu
                  @click="({ key }) => handleMenuClick(key as string, dict.id)"
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
