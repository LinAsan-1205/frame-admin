<script setup lang="ts">
import type { User } from '#/api/system/user';

import { computed } from 'vue';

import { Popover, Space, Tag } from 'ant-design-vue';

const { origin } = defineProps<{
  origin: User.View;
}>();

const displayRoles = computed(() => {
  return origin.roles.slice(0, 3);
});

const hasMore = computed(() => {
  return origin.roles.length > 3;
});

const remainingRoles = computed(() => {
  return origin.roles.slice(3);
});
</script>
<template>
  <Space :size="5">
    <Tag
      :bordered="false"
      class="!m-0"
      v-for="role in displayRoles"
      :key="role.id"
      color="processing"
    >
      {{ role.name }}
    </Tag>
    <Popover v-if="hasMore" placement="bottom">
      <template #content>
        <Space>
          <Tag
            :bordered="false"
            v-for="role in remainingRoles"
            :key="role.id"
            color="processing"
          >
            {{ role.name }}
          </Tag>
        </Space>
      </template>
      <Tag color="processing" :bordered="false">...</Tag>
    </Popover>
  </Space>
</template>
