<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { $t } from '#/locales';

import JoinUsList from './join-us-list.vue';
</script>

<template>
  <Page :title="$t('content-management.joinUs.title')" auto-content-height>
    <JoinUsList />
  </Page>
</template>
