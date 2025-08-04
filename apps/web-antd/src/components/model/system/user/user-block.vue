<script setup lang="ts">
import type { User } from '#/api/system/user';

import { EllipsisText } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Avatar } from 'ant-design-vue';

const { origin } = defineProps<{
  origin: User.View;
}>();

const { phone, nickName, avatar } = origin;
</script>
<template>
  <div class="flex w-full items-center justify-center gap-2">
    <div class="w-[40px]">
      <Avatar :size="40" :src="avatar">
        <template #icon>
          <div class="flex h-full items-center justify-center">
            <IconifyIcon icon="ant-design:user-outlined" />
          </div>
        </template>
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
