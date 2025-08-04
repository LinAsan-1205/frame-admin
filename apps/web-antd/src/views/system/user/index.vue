<script setup lang="ts">
import { Page } from '@vben/common-ui';

import UserList from './list.vue';
import DeptUser from './modules/dept-user.vue';
</script>

<template>
  <Page auto-content-height>
    <div class="flex">
      <div class="pt-4">
        <DeptUser />
      </div>
      <div class="flex-1">
        <UserList />
      </div>
    </div>
  </Page>
</template>
