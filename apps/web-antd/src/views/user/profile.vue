<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Menu } from 'ant-design-vue';

const userProfileMenuList = [
  {
    key: 'foundation',
    label: '基础设置',
    components: defineAsyncComponent(() => import('./modules/foundation.vue')),
  },
  {
    key: 'safe',
    label: '安全设置',
  },
];

const activeUserProfileMenuKey = ref(['foundation']);

const currentActiveUserProfileComponent = computed(() => {
  const currentActiveKey = activeUserProfileMenuKey.value[0];
  const currentActiveMenuItem = userProfileMenuList.find(
    (userProfileMenuItem) => userProfileMenuItem.key === currentActiveKey,
  );
  return currentActiveMenuItem?.components;
});
</script>
<template>
  <Page auto-content-height>
    <div class="card-box h-full p-5">
      <div class="flex gap-7">
        <div class="flex min-w-[200px] flex-shrink-0">
          <Menu
            :items="userProfileMenuList"
            mode="inline"
            v-model:selected-keys="activeUserProfileMenuKey"
          />
        </div>
        <div class="flex-1">
          <component :is="currentActiveUserProfileComponent" />
        </div>
      </div>
    </div>
  </Page>
</template>
