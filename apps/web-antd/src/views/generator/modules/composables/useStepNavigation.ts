import { ref } from 'vue';

/**
 * 步骤管理逻辑
 */
export function useStepNavigation() {
  const currentStep = ref(0);

  /**
   * 基础表单提交处理
   */
  function onBasicFormSubmit(_values: Record<string, any>) {
    currentStep.value = 1;
  }

  /**
   * 字段配置 - 下一步
   */
  function onFieldStepNext() {
    currentStep.value = 2;
  }

  /**
   * 字段配置 - 上一步
   */
  function onFieldStepPrev() {
    currentStep.value = 0;
  }

  /**
   * 选项表单提交处理
   */
  function onOptionsFormSubmit(_values: Record<string, any>) {
    // 配置完成，可以在这里添加提示或其他逻辑
  }

  /**
   * 选项配置 - 上一步
   */
  function onOptionsStepReset() {
    currentStep.value = 1;
  }

  return {
    currentStep,
    onBasicFormSubmit,
    onFieldStepNext,
    onFieldStepPrev,
    onOptionsFormSubmit,
    onOptionsStepReset,
  };
}
