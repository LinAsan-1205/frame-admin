<script setup lang="ts">
import type { User } from '#/api/system/user';

import { computed } from 'vue';

import { EllipsisText } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Avatar } from 'ant-design-vue';

import defaultAvatar from '#/assets/images/user/avatar.png';

const { origin } = defineProps<{
  origin: User.View;
}>();

const { phone, nickName, avatar } = origin;

const avatarUrl = computed(() => {
  return avatar || defaultAvatar;
});
</script>
<template>
  <div class="flex w-full items-center justify-center gap-2">
    <div class="w-[40px]">
      <Avatar :size="40" :src="avatarUrl">
        <div class="flex h-full items-center justify-center pt-[10px]">
          <IconifyIcon icon="ant-design:user-outlined" />
        </div>
      </Avatar>
    </div>
    <div class="flex w-[100px] flex-col justify-start">
      <EllipsisText tooltip-when-ellipsis>
        <div class="text-left text-sm font-bold">{{ nickName }}</div>
      </EllipsisText>
      <EllipsisText tooltip-when-ellipsis>
        <div class="text-left text-xs text-gray-400" v-if="phone">
          {{ phone }}
        </div>
      </EllipsisText>
    </div>
  </div>
</template>
