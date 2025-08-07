<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import { ref } from 'vue';

import { useQuery } from '@tanstack/vue-query';
import { InputSearch, Tree } from 'ant-design-vue';

import { queryDeptTree } from '#/api/system/dept';
import { $t } from '#/locales';

const searchValue = ref('');

const { data } = useQuery({
  experimental_prefetchInRender: true,
  queryFn: queryDeptTree,
  queryKey: ['deptTree'],
  refetchOnMount: 'always',
  staleTime: 1000 * 60 * 5,
});

const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'name',
  key: 'id',
};

const modelValue = defineModel<number | undefined>();

const onSelect = (selectedKeys: any) => {
  modelValue.value = selectedKeys[0];
};
</script>
<template>
  <div
    class="border-border bg-card min-w-[300px] rounded-[var(--radius)] border p-2"
  >
    <div class="mb-[8px]">
      <InputSearch
        v-model:value="searchValue"
        :placeholder="$t('system.user.deptSearchPlaceholder')"
      />
    </div>
    <div class="pr-[10px]">
      <Tree
        v-if="data?.length"
        default-expand-all
        auto-expand-parent
        block-node
        @select="onSelect"
        :field-names="fieldNames"
        :tree-data="data as any"
      >
        <template #title="{ name }">
          <span v-if="name.includes(searchValue)">
            {{ name.substring(0, name.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ name.substring(name.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ name }}</span>
        </template>
      </Tree>
    </div>
  </div>
</template>
