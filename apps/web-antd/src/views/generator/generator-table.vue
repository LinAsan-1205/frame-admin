<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { VbenIcon, VbenIconButton, VbenSpinner } from '@vben-core/shadcn-ui';

import {
  Badge,
  Card,
  Dropdown,
  Input,
  Menu,
  MenuItem,
  message,
} from 'ant-design-vue';

import { getDatabaseTables } from '#/api/generator';
import { $t } from '#/locales';

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  select: [table: any];
}>();

const searchValue = ref('');
const tableList = ref<any[]>([]);
const loading = ref(false);
const selectedTableName = ref<string | undefined>();

/**
 * 过滤后的表列表
 */
const filteredTables = computed(() => {
  if (!searchValue.value) return tableList.value;

  return tableList.value.filter(
    (table) =>
      table.tableName.toLowerCase().includes(searchValue.value.toLowerCase()) ||
      (table.tableComment &&
        table.tableComment
          .toLowerCase()
          .includes(searchValue.value.toLowerCase())),
  );
});

/**
 * 加载数据库表列表
 */
async function loadTables() {
  loading.value = true;
  try {
    const data = await getDatabaseTables();
    tableList.value = data;
  } catch {
    message.error($t('generator.tableList.loading'));
  } finally {
    loading.value = false;
  }
}

/**
 * 选择表
 */
function handleSelect(table: any) {
  if (props.disabled) return;

  selectedTableName.value = table.tableName;
  emit('select', table);
  message.success(
    $t('generator.tableList.selectSuccess', { tableName: table.tableName }),
  );
}

/**
 * 刷新数据
 */
async function handleRefresh() {
  if (props.disabled) return;

  selectedTableName.value = undefined;
  await loadTables();
  message.success($t('generator.tableList.refreshSuccess'));
}

/**
 * 检查表是否被选中
 */
function isSelected(tableName: string) {
  return selectedTableName.value === tableName;
}

/**
 * 获取表类型图标
 */
function getTableIcon(tableName: string) {
  if (tableName.includes('_log') || tableName.includes('log_')) {
    return 'ri:file-list-3-line';
  }
  if (tableName.includes('_config') || tableName.includes('config_')) {
    return 'ri:settings-3-line';
  }
  if (tableName.includes('_user') || tableName.includes('user_')) {
    return 'ri:user-line';
  }
  if (tableName.includes('_role') || tableName.includes('role_')) {
    return 'ri:shield-user-line';
  }
  if (tableName.includes('_menu') || tableName.includes('menu_')) {
    return 'ri:menu-line';
  }
  if (tableName.includes('_dict') || tableName.includes('dict_')) {
    return 'ri:book-line';
  }
  return 'ri:database-2-line';
}

/**
 * 格式化创建时间
 */
function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('zh-CN');
}

/**
 * 处理菜单点击
 */
function handleMenuClick(key: string, table: any) {
  switch (key) {
    case 'info': {
      // 可以添加查看表结构的功能
      message.info(`表 ${table.tableName} 的详细信息`);
      break;
    }
    case 'select': {
      handleSelect(table);
      break;
    }
  }
}

onMounted(() => {
  loadTables();
});
</script>

<template>
  <div class="generator-table" :class="{ disabled }">
    <!-- 头部区域 -->
    <div class="space-y-2">
      <div class="mb-3 space-y-3 border-b border-gray-100 pb-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center text-lg font-semibold">
            <VbenIcon icon="ri:database-2-line" class="mr-2" />
            {{ $t('generator.tableList.title') }}
          </div>
          <div class="flex items-center space-x-2">
            <VbenIconButton
              @click="handleRefresh"
              :tooltip="$t('generator.tableList.refresh')"
              :loading="loading"
              :disabled="disabled"
            >
              <VbenIcon icon="ri:refresh-line" />
            </VbenIconButton>
          </div>
        </div>

        <!-- 搜索框 -->
        <Input
          v-model:value="searchValue"
          :placeholder="$t('generator.tableList.searchPlaceholder')"
          :disabled="disabled"
          class="w-full"
        >
          <template #prefix>
            <VbenIcon icon="ri:search-line" class="text-gray-400" />
          </template>
        </Input>
      </div>

      <!-- 统计信息 -->
      <div class="mb-3 flex items-center justify-between text-sm text-gray-500">
        <span>
          {{
            $t('generator.tableList.total', { count: filteredTables.length })
          }}
        </span>
        <span v-if="selectedTableName">
          {{
            $t('generator.tableList.selected', { tableName: selectedTableName })
          }}
        </span>
      </div>
    </div>

    <!-- 表格列表 -->
    <div class="table-list">
      <!-- 加载状态 -->
      <VbenSpinner
        v-if="loading && tableList.length === 0"
        :spinning="true"
        class="min-h-[200px]"
      />

      <!-- 空状态 -->
      <div v-else-if="filteredTables.length === 0" class="py-8 text-center">
        <VbenIcon
          icon="ri:database-2-line"
          class="mx-auto mb-2 size-8 text-gray-300"
        />
        <p class="text-sm text-gray-500">
          {{
            searchValue
              ? $t('generator.tableList.noSearchResult')
              : $t('generator.tableList.empty')
          }}
        </p>
      </div>

      <!-- 表格卡片列表 -->
      <div v-else class="space-y-2">
        <Card
          :body-style="{ padding: 0 }"
          v-for="table in filteredTables"
          :key="table.tableName"
          class="cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="[
            isSelected(table.tableName)
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'hover:border-gray-300',
            disabled ? 'cursor-not-allowed opacity-60' : '',
          ]"
          @click="handleSelect(table)"
        >
          <div class="p-4">
            <div class="flex items-center justify-between">
              <!-- 表信息 -->
              <div class="flex min-w-0 flex-1 items-center space-x-3">
                <div class="flex-shrink-0">
                  <VbenIcon
                    :icon="getTableIcon(table.tableName)"
                    class="text-primary size-5"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center space-x-2">
                    <h4
                      class="truncate font-mono text-sm font-medium"
                      :title="table.tableName"
                    >
                      {{ table.tableName }}
                    </h4>
                    <Badge
                      status="processing"
                      :text="table.engine || 'InnoDB'"
                      size="small"
                    />
                  </div>

                  <div class="mt-1 space-y-1">
                    <!-- 表注释 -->
                    <div v-if="table.tableComment" class="flex items-center">
                      <span
                        class="text-sm text-gray-700"
                        :title="table.tableComment"
                      >
                        {{ table.tableComment }}
                      </span>
                    </div>

                    <!-- 表详细信息 -->
                    <div
                      class="flex items-center space-x-2 text-xs text-gray-500"
                    >
                      <span v-if="table.createTime">
                        {{ $t('generator.tableList.createTime') }}:
                        {{ formatDate(table.createTime) }}
                      </span>
                      <div
                        v-if="table.createTime && table.tableCollation"
                        class="text-gray-400"
                      >
                        •
                      </div>
                      <span v-if="table.tableCollation">
                        {{ table.tableCollation }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center space-x-2">
                <!-- 选中状态指示 -->
                <div
                  v-if="isSelected(table.tableName)"
                  class="flex items-center"
                >
                  <VbenIcon icon="ri:check-line" class="text-primary size-4" />
                </div>

                <!-- 更多操作 -->
                <Dropdown :trigger="['click']" @click.stop>
                  <VbenIconButton size="small" :disabled="disabled">
                    <VbenIcon icon="ri:more-2-line" />
                  </VbenIconButton>
                  <template #overlay>
                    <Menu
                      @click="
                        ({ key }) => handleMenuClick(key as string, table)
                      "
                    >
                      <MenuItem key="select">
                        <span class="flex items-center">
                          <VbenIcon
                            icon="ri:settings-3-line"
                            class="mr-2 size-4"
                          />
                          {{ $t('generator.tableList.select') }}
                        </span>
                      </MenuItem>
                      <MenuItem key="info">
                        <span class="flex items-center">
                          <VbenIcon
                            icon="ri:information-line"
                            class="mr-2 size-4"
                          />
                          {{ $t('generator.tableList.viewInfo') }}
                        </span>
                      </MenuItem>
                    </Menu>
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.generator-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  &.disabled {
    pointer-events: none;
  }

  .table-list {
    flex: 1;
    padding-right: 4px;
    overflow-y: auto;

    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  :deep(.ant-card) {
    border-radius: 8px;

    &:hover {
      .ant-card-body {
        background: rgb(24 144 255 / 2%);
      }
    }
  }

  :deep(.ant-badge) {
    .ant-badge-status-text {
      font-size: 11px;
    }
  }
}

@media (max-width: 768px) {
  .generator-table {
    .table-list {
      padding-right: 0;
    }

    :deep(.ant-card) {
      .p-4 {
        padding: 12px;
      }
    }
  }
}
</style>
