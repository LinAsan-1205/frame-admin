<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { Log } from '#/api/schedule/log';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryLogPage } from '#/api/schedule/log';
import { $t } from '#/locales';

import { useExecutionLogColumns, useExecutionLogSearchFormOptions } from '../config/execution-log-config';

const taskId = ref<number>();

const [Modal, modalApi] = useVbenModal({
  class: 'w-3/4',
  showConfirmButton: false,
  footer: false,
  showCancelButton: false,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<{
        taskId: number;
      }>();
      taskId.value = data.taskId;
      taskLogGridApi.query();
    }
  },
});

const searchFormOptions = useExecutionLogSearchFormOptions();
const [TaskLogGrid, taskLogGridApi] = useVbenVxeGrid({
  separator: false,
  formOptions: searchFormOptions,
  gridOptions: {
    columns: useExecutionLogColumns(),
    keepSource: true,
    toolbarConfig: {
      zoom: false,
    },
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return queryLogPage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
            },
            {
              ...formValues,
              taskId: taskId.value,
            },
          );
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
  } as VxeTableGridOptions<Log.View>,
});

const getDrawerTitle = computed(() => {
  return $t('schedule.log.execution');
});
</script>
<template>
  <Modal :title="getDrawerTitle">
    <TaskLogGrid />
  </Modal>
</template>
