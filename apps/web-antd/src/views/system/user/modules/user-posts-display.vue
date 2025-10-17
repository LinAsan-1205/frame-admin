<script setup lang="ts">
import type { User } from '#/api/system/user';

import { computed } from 'vue';

import { Popover, Space, Tag } from 'ant-design-vue';

const { origin } = defineProps<{
  origin: User.View;
}>();

const isPostNotAssigned = computed(() => {
  return !origin.posts || origin.posts.length === 0;
});

const displayPostList = computed(() => {
  return origin.posts.slice(0, 1);
});

const hasMorePosts = computed(() => {
  return origin.posts.length > 2;
});

const allPostList = computed(() => {
  return origin.posts;
});
</script>
<template>
  <Space :size="5">
    <!-- 未分配岗位时的提示 -->
    <Tag v-if="isPostNotAssigned" color="error" class="!m-0"> 未分配岗位 </Tag>
    <!-- 已分配岗位时的展示 -->
    <template v-else>
      <Tag
        class="!m-0"
        v-for="postItem in displayPostList"
        :key="postItem.id"
        color="processing"
      >
        {{ postItem.postName }}
      </Tag>
      <Popover v-if="hasMorePosts" placement="bottom">
        <template #content>
          <div class="flex flex-col gap-2">
            <Tag
              v-for="postItem in allPostList"
              :key="postItem.id"
              color="processing"
            >
              {{ postItem.postName }}
            </Tag>
          </div>
        </template>
        <Tag color="processing" class="cursor-pointer">
          +{{ origin.posts.length }}
        </Tag>
      </Popover>
    </template>
  </Space>
</template>
