<script setup lang="ts">
import type { User } from '#/api/system/user';

import { IconifyIcon } from '@vben/icons';

import { Avatar } from 'ant-design-vue';

const { origin } = defineProps<{
  origin: User.View;
}>();

const { phone, nickName, avatar } = origin;
</script>
<template>
  <div class="flex gap-2">
    <Avatar :size="40" :src="avatar">
      <template #icon>
        <div class="flex h-full items-center justify-center">
          <IconifyIcon icon="ant-design:user-outlined" />
        </div>
      </template>
    </Avatar>
    <div class="flex flex-col">
      <div class="text-left text-sm font-bold">{{ nickName }}</div>
      <div class="text-left text-xs text-gray-400" v-if="phone">
        {{ phone }}
      </div>
    </div>
  </div>
</template>
