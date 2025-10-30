<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import { ref } from 'vue';

import { useQuery } from '@tanstack/vue-query';
import { InputSearch, Tree } from 'ant-design-vue';

import { getProductCategoryTree } from '#/api/content-management/product-category';
import { $t } from '#/locales';

const searchValue = ref('');

const { data } = useQuery({
  experimental_prefetchInRender: true,
  queryFn: getProductCategoryTree,
  queryKey: ['productCategoryTree'],
  refetchOnMount: 'always',
  staleTime: 1000 * 60 * 5,
});

const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  key: 'id',
  title: 'name',
};

const modelValue = defineModel<number | undefined>();

const onSelect = (selectedKeys: any) => {
  modelValue.value = selectedKeys[0];
};
</script>
<template>
  <div class="mb-[8px]">
    <InputSearch
      v-model:value="searchValue"
      :placeholder="$t('content-management.category.nameSearch')"
    />
  </div>
  <div class="pr-[10px]">
    <Tree
      v-if="data?.length"
      auto-expand-parent
      block-node
      default-expand-all
      :field-names="fieldNames"
      :tree-data="data as any"
      @select="onSelect"
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
</template>

