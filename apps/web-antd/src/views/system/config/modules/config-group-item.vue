<script setup lang="ts">
import { ref, watch } from 'vue';

import { getConfigGroupById } from '#/api/system/config';
import { EmptyState } from '#/components/empty-state';
import { $t } from '#/locales';

import ConfigItemAddForm from './config-item-add-form.vue';
import ConfigItemEditForm from './config-item-edit-form.vue';

const groupId = defineModel<number | undefined>('groupId');

const groupName = ref<string>();
const editFormRef = ref<InstanceType<typeof ConfigItemEditForm>>();

watch(
  () => groupId.value,
  async (newGroupId) => {
    if (newGroupId) {
      try {
        const group = await getConfigGroupById(newGroupId);
        groupName.value = group.groupName;
      } catch {
        groupName.value = '未知配置组';
      }
    } else {
      groupName.value = undefined;
    }
  },
  { immediate: true },
);

const handleSuccess = () => {
  editFormRef.value?.refetch();
};
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="mb-4 flex items-center justify-between border-b border-gray-200 pb-4"
    >
      <div>
        <h3 class="text-lg font-semibold">
          {{ $t('system.config.configItem.title') }}
        </h3>
        <div class="mt-1 flex text-sm text-gray-500">
          <div v-if="groupName">{{ groupName }} -</div>
          {{ $t('system.config.configItem.description') }}
        </div>
      </div>
    </div>

    <div v-if="!groupId" class="flex h-[400px] items-center justify-center">
      <EmptyState
        :title="$t('system.config.configGroup.title')"
        :description="$t('system.config.configItem.selectGroupFirst')"
      />
    </div>

    <div v-else class="flex flex-1 space-x-4">
      <div class="flex-1">
        <ConfigItemEditForm ref="editFormRef" :group-id="groupId" />
      </div>

      <div class="w-[500px]">
        <ConfigItemAddForm :group-id="groupId" @success="handleSuccess" />
      </div>
    </div>
  </div>
</template>
