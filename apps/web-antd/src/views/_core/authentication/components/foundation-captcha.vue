<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import { Input } from 'ant-design-vue';

import { generateFoundationCaptcha } from '#/api/captcha';

const emits = defineEmits<{
  (event: 'reload', captchaId: string): void;
}>();

const { isDark } = usePreferences();

const modelValue = defineModel<string | undefined>();

const spinning = ref(false);

const captchaId = ref('');

const image = ref('');

const reloadGenerateFoundationCaptcha = async () => {
  spinning.value = true;
  const result = await generateFoundationCaptcha({
    isDarkBackground: isDark.value,
  });
  spinning.value = false;
  captchaId.value = result.captchaId;
  image.value = result.image;
  emits('reload', captchaId.value);
};

const resume = async () => {
  await reloadGenerateFoundationCaptcha();
  modelValue.value = undefined;
};

defineExpose({
  resume,
});
onMounted(reloadGenerateFoundationCaptcha);

watch(
  () => isDark.value,
  () => {
    reloadGenerateFoundationCaptcha();
  },
);
</script>

<template>
  <Input class="h-10" v-model:value="modelValue">
    <template #suffix>
      <div
        v-if="!spinning"
        class="flex h-full cursor-pointer"
        @click="reloadGenerateFoundationCaptcha"
      >
        <img :src="image" class="h-40px" />
      </div>
    </template>
  </Input>
</template>
