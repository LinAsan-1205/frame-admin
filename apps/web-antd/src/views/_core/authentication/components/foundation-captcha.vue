<script setup lang="ts">
import { Input } from 'ant-design-vue';

const modelValue = defineModel<string | undefined>();
</script>

<template>
  <Input class="h-10" v-model:value="modelValue">
    <template #suffix>
      <span>222</span>
    </template>
  </Input>
</template>
