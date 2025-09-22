<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h, onMounted, ref } from 'vue';

import { VbenIcon } from '@vben-core/shadcn-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDatabaseTables } from '#/api/generator';
import { $t } from '#/locales';

const emit = defineEmits<{
  select: [table: any];
}>();

const tableList = ref<any[]>([]);
const loading = ref(false);

const columns: VxeTableGridOptions['columns'] = [
  {
    field: 'tableName',
    title: $t('generator.tableList.columns.tableName'),
    width: 200,
  },
  {
    field: 'tableComment',
    title: $t('generator.tableList.columns.tableComment'),
    minWidth: 150,
  },
  {
    field: 'createTime',
    title: $t('generator.tableList.columns.createTime'),
    width: 160,
    cellRender: { name: 'CellFormatDate' },
  },
  {
    title: $t('generator.tableList.columns.action'),
    width: 100,
    align: 'center',
    slots: {
      default: ({ row }) => {
        return h(
          Button,
          {
            type: 'link',
            onClick: () => handleSelect(row),
          },
          () => $t('generator.tableList.select'),
        );
      },
    },
  },
];

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    data: tableList.value,
    height: 'auto',
    rowConfig: {
      keyField: 'tableName',
      isHover: true,
    },
  },
});

async function loadTables() {
  loading.value = true;
  try {
    const data = await getDatabaseTables();
    tableList.value = data;
    gridApi.setState({
      gridOptions: {
        data,
      },
    });
  } catch {
    message.error($t('generator.tableList.loading'));
  } finally {
    loading.value = false;
  }
}

function handleSelect(table: any) {
  emit('select', table);
  message.success(
    $t('generator.tableList.selectSuccess', { tableName: table.tableName }),
  );
}

async function handleRefresh() {
  await loadTables();
  message.success($t('generator.tableList.refreshSuccess'));
}

onMounted(() => {
  loadTables();
});
</script>

<template>
  <div class="generator-table">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        <VbenIcon icon="lucide:database" class="mr-2" />
        {{ $t('generator.tableList.title') }}
      </h3>
      <Button @click="handleRefresh" :loading="loading">
        <VbenIcon icon="lucide:refresh-cw" />
        {{ $t('generator.tableList.refresh') }}
      </Button>
    </div>

    <Grid />
  </div>
</template>

<style lang="scss" scoped>
.generator-table {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.vxe-grid) {
    flex: 1;
  }
}
</style>
