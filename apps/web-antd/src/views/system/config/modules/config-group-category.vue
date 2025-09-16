<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

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

import { delConfigGroupById, queryConfigGroupList } from '#/api/system/config';
import { ConfigGroupStatus } from '#/api/system/config/enum';
import { $t } from '#/locales';

import ConfigGroupForm from './config-group-form.vue';

const searchValue = ref('');

const [ConfigGroupModal, configGroupModalApi] = useVbenModal({
  connectedComponent: ConfigGroupForm,
  destroyOnClose: true,
});

const { data, refetch, isLoading, isFetching } = useQuery({
  experimental_prefetchInRender: true,
  queryFn: () => queryConfigGroupList(),
  queryKey: ['configGroupList'],
  refetchOnMount: 'always',
  staleTime: 1000 * 60 * 5,
});

const modelValue = defineModel<number | undefined>();

/**
 * 过滤后的配置组列表
 */
const filteredGroups = computed(() => {
  if (!data.value) return [];
  if (!searchValue.value) return data.value;

  return data.value.filter((group) =>
    group.groupName.toLowerCase().includes(searchValue.value.toLowerCase()),
  );
});

/**
 * 选择配置组
 */
const onSelect = (groupId: number) => {
  modelValue.value = groupId;
};

/**
 * 新增配置组
 */
const onAdd = () => {
  configGroupModalApi.setData({}).open();
};

/**
 * 删除配置组
 */
const onDelete = (id: number) => {
  const group = data?.value?.find((item) => item.id === id);
  Modal.confirm({
    title: $t('common.prompt'),
    content: `${$t('common.confirmDelete')} "${group?.groupName}"？`,
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: async () => {
      try {
        await delConfigGroupById(id);
        message.success($t('common.deleteSuccess'));
        onRefresh();
      } catch {
        message.error($t('common.deleteFailed'));
      }
    },
  });
};

/**
 * 编辑配置组
 */
const onEdit = (id: number) => {
  const group = data?.value?.find((item) => item.id === id);
  if (group) {
    configGroupModalApi.setData(group).open();
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
 */
function getStatusLabel(status: string) {
  return ConfigGroupStatus.label(status) || status;
}

/**
 * 检查配置组是否被选中
 */
function isSelected(groupId: number) {
  return modelValue.value === groupId;
}

/**
 * 处理菜单点击事件
 */
function handleMenuClick(key: string, groupId: number) {
  switch (key) {
    case 'delete': {
      onDelete(groupId);
      break;
    }
    case 'edit': {
      onEdit(groupId);
      break;
    }
  }
}
</script>

<template>
  <ConfigGroupModal @success="onRefresh" />
  <div class="space-y-2">
    <div class="mb-3 space-y-3 border-b border-gray-100 pb-3">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ $t('system.config.configGroup.title') }}
        </h3>
        <div class="flex items-center space-x-2">
          <VbenIconButton
            @click="onRefresh"
            :tooltip="$t('common.refresh')"
            :loading="isLoading || isFetching"
          >
            <VbenIcon icon="ri:refresh-line" />
          </VbenIconButton>
          <VbenIconButton @click="onAdd" :tooltip="$t('common.create')">
            <VbenIcon icon="ri:add-line" />
          </VbenIconButton>
        </div>
      </div>

      <Input
        v-model:value="searchValue"
        :placeholder="$t('system.config.configGroup.groupNamePlaceholder')"
        class="w-full"
      >
        <template #prefix>
          <VbenIcon icon="ri:search-line" class="text-gray-400" />
        </template>
      </Input>
    </div>

    <div class="space-y-2">
      <VbenSpinner
        v-if="isLoading && !data"
        :spinning="true"
        class="min-h-[200px]"
      />

      <!-- 空状态 -->
      <div v-else-if="filteredGroups.length === 0" class="py-8 text-center">
        <VbenIcon
          icon="ri:settings-3-line"
          class="mx-auto mb-2 size-8 text-gray-300"
        />
        <p class="text-sm text-gray-500">
          {{ $t('common.noData') }}
        </p>
      </div>

      <div v-else class="space-y-1">
        <Card
          :body-style="{ padding: 0 }"
          v-for="group in filteredGroups"
          :key="group.id"
          class="cursor-pointer p-3 transition-all duration-200 hover:shadow-md"
          :class="[
            isSelected(group.id)
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'hover:border-gray-300',
          ]"
          @click="onSelect(group.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex min-w-0 flex-1 items-center space-x-3">
              <div class="flex-shrink-0">
                <VbenIcon
                  icon="ri:settings-3-line"
                  class="text-primary size-5"
                />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center space-x-2">
                  <h4
                    class="truncate text-sm font-medium"
                    :title="group.groupName"
                  >
                    {{ group.groupName }}
                  </h4>
                  <Badge
                    :status="
                      group.status === ConfigGroupStatus.Normal
                        ? 'success'
                        : 'error'
                    "
                    :text="getStatusLabel(group.status)"
                    size="small"
                  />
                </div>
                <div class="mt-1 flex items-center space-x-2">
                  <span class="text-xs text-gray-500">
                    {{ $t('system.config.configGroup.configItemCount') }}:
                    {{ group.configItemCount || 0 }}
                  </span>
                  <div v-if="group.remark" class="text-xs text-gray-400">•</div>
                  <span
                    v-if="group.remark"
                    class="flex-1 truncate text-xs text-gray-400"
                    :title="group.remark"
                  >
                    {{ group.remark }}
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
                  @click="({ key }) => handleMenuClick(key as string, group.id)"
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
