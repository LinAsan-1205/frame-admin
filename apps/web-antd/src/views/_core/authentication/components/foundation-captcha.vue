<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Input } from 'ant-design-vue';

import { generateFoundationCaptcha } from '#/api/captcha';

const emits = defineEmits<{
  (event: 'reload', captchaId: string): void;
}>();

const modelValue = defineModel<string | undefined>();

const captchaId = ref('');

const image = ref('');

const reloadGenerateFoundationCaptcha = async () => {
  const result = await generateFoundationCaptcha();
  captchaId.value = result.captchaId;
  image.value = result.image;
  emits('reload', captchaId.value);
};

onMounted(reloadGenerateFoundationCaptcha);
</script>

<template>
  <Input class="h-10" v-model:value="modelValue">
    <template #suffix>
      <div
        class="flex h-full cursor-pointer"
        @click="reloadGenerateFoundationCaptcha"
      >
        <img :src="image" class="h-40px" />
      </div>
    </template>
  </Input>
</template>
