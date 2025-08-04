<script setup lang="ts">
import { Tag } from 'ant-design-vue';

const props = defineProps<{
  label: string;
  type: string;
}>();

const { type, label } = props;
</script>

<template>
  <Tag :color="type">
    {{ label }}
  </Tag>
</template>
