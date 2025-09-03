<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { VbenIcon, VbenIconButton } from '@vben-core/shadcn-ui';

import { useQuery } from '@tanstack/vue-query';
import {
  Dropdown,
  InputSearch,
  Menu,
  MenuItem,
  message,
  Modal,
  Tree,
} from 'ant-design-vue';

import {
  deleteFileCategory,
  queryFileCategoryList,
} from '#/api/system/file/category';
import { $t } from '#/locales';

import FileCategoryForm from './file-category-form.vue';

const searchValue = ref('');

const [FileCategoryFormModal, fileCategoryFormModalApi] = useVbenModal({
  connectedComponent: FileCategoryForm,
  destroyOnClose: true,
});

const { data, refetch } = useQuery({
  experimental_prefetchInRender: true,
  queryFn: queryFileCategoryList,
  queryKey: ['fileCategoryList'],
  refetchOnMount: 'always',
  staleTime: 1000 * 60 * 5,
});

const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'name',
  key: 'id',
};

const modelValue = defineModel<number | undefined>();

const onSelect = (selectedKeys: any) => {
  modelValue.value = selectedKeys[0];
};

const onAdd = () => {
  fileCategoryFormModalApi.setData({}).open();
};

const onDelete = (id: number) => {
  const categoryName = data?.value?.find((item) => item.id === id)?.name;
  Modal.confirm({
    content: $t('ui.actionMessage.deleteConfirm', [categoryName]),
    onOk: async () => {
      await deleteFileCategory(id);
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [categoryName]),
      });
      onRefresh();
    },
  });
};

const onContextMenuClick = (id: number, menuKey: number | string) => {
  switch (menuKey) {
    case 'delete': {
      onDelete(id);
      break;
    }
    case 'set': {
      const row = data?.value?.find((item) => item.id === id);
      if (row) {
        fileCategoryFormModalApi.setData(row).open();
      } else {
        message.error($t('system.fileCategory.setFailed'));
      }
      break;
    }
  }
};
const onRefresh = () => {
  refetch();
};
</script>
<template>
  <FileCategoryFormModal @success="onRefresh" />
  <div
    class="border-border bg-card min-w-[300px] rounded-[var(--radius)] border p-2"
  >
    <div class="mb-2 flex items-center justify-between">
      <div class="text-md font-bold">{{ $t('system.fileCategory.title') }}</div>
      <div class="flex items-center">
        <VbenIconButton
          @click="onRefresh"
          :tooltip="$t('system.fileCategory.refresh')"
          tooltip-side="top"
        >
          <VbenIcon icon="ri:refresh-line" />
        </VbenIconButton>
        <VbenIconButton
          @click="onAdd"
          :tooltip="$t('system.fileCategory.add')"
          tooltip-side="top"
        >
          <VbenIcon icon="ant-design:plus-outlined" />
        </VbenIconButton>
      </div>
    </div>
    <div class="mb-[8px]">
      <InputSearch
        v-model:value="searchValue"
        :placeholder="$t('system.fileCategory.secretKeyPlaceholder')"
      />
    </div>
    <div class="pr-[10px]">
      <Tree
        v-if="data?.length"
        default-expand-all
        auto-expand-parent
        block-node
        @select="onSelect"
        :field-names="fieldNames"
        :tree-data="data as any"
      >
        <template #title="{ name, id, icon }">
          <Dropdown :trigger="['contextmenu']">
            <div class="flex items-center gap-1">
              <VbenIcon v-if="icon" :icon="icon" class="size-4" />
              <div v-if="name.includes(searchValue)" class="w-full">
                {{ name.substring(0, name.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{
                  name.substring(name.indexOf(searchValue) + searchValue.length)
                }}
              </div>
              <div v-else>{{ name }}</div>
            </div>
            <template #overlay>
              <Menu
                @click="({ key: menuKey }) => onContextMenuClick(id, menuKey)"
              >
                <MenuItem key="set">
                  {{ $t('common.edit') }}
                </MenuItem>
                <MenuItem key="delete">
                  {{ $t('common.delete') }}
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </template>
      </Tree>
    </div>
  </div>
</template>
