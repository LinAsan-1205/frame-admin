<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue';

import { isFunction } from '@vben/utils';

import { Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';

export interface MoreOption {
  code: string;
  disabled?: (row: any) => boolean | boolean;
  text: string;
}

const {
  text,
  moreOptions,
  row = {},
  moreDisabled,
} = defineProps<{
  // eslint-disable-next-line vue/require-default-prop
  moreDisabled?: (row: any) => boolean | boolean;
  moreOptions: Array<MoreOption>;
  row?: any;
  text: string;
}>();

const emits = defineEmits<{
  (event: 'click', code: string): void;
}>();

const onClick: MenuProps['onClick'] = ({ key }) => {
  emits('click', key as string);
};

const getMoreDisabled = (row: any) => {
  if (isFunction(moreDisabled)) {
    return moreDisabled(row);
  }
  return moreDisabled;
};

const getDisabled = (opt: MoreOption) => {
  if (isFunction(opt.disabled)) {
    return opt.disabled(row);
  }
  return opt.disabled;
};
</script>
<template>
  <Dropdown destroy-popup-on-hide placement="bottomRight">
    <Button
      type="link"
      size="small"
      @click.prevent
      :disabled="getMoreDisabled(row)"
    >
      {{ text }}
    </Button>
    <template #overlay>
      <Menu @click="onClick">
        <MenuItem
          v-for="moreOption in moreOptions"
          :key="moreOption.code"
          :disabled="getDisabled(moreOption)"
        >
          {{ moreOption.text }}
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>
