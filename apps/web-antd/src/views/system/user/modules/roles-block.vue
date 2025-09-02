<script setup lang="ts">
import type { User } from '#/api/system/user';

import { computed } from 'vue';

import { Popover, Space, Tag } from 'ant-design-vue';

const { origin } = defineProps<{
  origin: User.View;
}>();

const isRoleNotAssigned = computed(() => {
  return !origin.roles || origin.roles.length === 0;
});

const displayRoleList = computed(() => {
  return origin.roles.slice(0, 1);
});

const hasMoreRoles = computed(() => {
  return origin.roles.length > 2;
});

const allRoleList = computed(() => {
  return origin.roles;
});
</script>
<template>
  <Space :size="5">
    <!-- 未分配角色时的提示 -->
    <Tag
      v-if="isRoleNotAssigned"
      color="warning"
      :bordered="false"
      class="!m-0"
    >
      未分配角色
    </Tag>
    <!-- 已分配角色时的展示 -->
    <template v-else>
      <Tag
        :bordered="false"
        class="!m-0"
        v-for="roleItem in displayRoleList"
        :key="roleItem.id"
        color="processing"
      >
        {{ roleItem.name }}
      </Tag>
      <Popover v-if="hasMoreRoles" placement="bottom">
        <template #content>
          <div class="flex flex-col gap-2">
            <Tag
              :bordered="false"
              v-for="roleItem in allRoleList"
              :key="roleItem.id"
              color="processing"
            >
              {{ roleItem.name }}
            </Tag>
          </div>
        </template>
        <Tag color="processing" :bordered="false" class="cursor-pointer">
          +{{ origin.roles.length }}
        </Tag>
      </Popover>
    </template>
  </Space>
</template>
