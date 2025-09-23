import type { Generator } from '#/api/generator';

import { ref } from 'vue';

import { message } from 'ant-design-vue';

import {
  generateCode,
  getGeneratorConfig,
  getTableColumns,
  previewCode,
  saveGeneratorConfig,
} from '#/api/generator';
import {
  BackendOption,
  FeatureOption,
  FrontendOption,
} from '#/api/generator/enum';

import { generateDefaultBasicData } from '../utils/generator.utils';

interface TableInfo {
  tableName: string;
  tableComment?: string;
}

/**
 * 生成器配置逻辑
 */
export function useGeneratorConfig() {
  const loading = ref(false);
  const columns = ref<any[]>([]);

  /**
   * 生成默认的选项数据
   */
  function generateDefaultOptionsData(): Generator.Config {
    return {
      backendOptions: [...BackendOption.toValue()],
      frontendOptions: [...FrontendOption.toValue()],
      features: [
        FeatureOption.Add,
        FeatureOption.Edit,
        FeatureOption.Delete,
        FeatureOption.BatchDelete,
      ],
      tableName: '',
      moduleName: '',
      businessName: '',
      modulePath: '',
      permissionPrefix: '',
      fields: [],
    };
  }

  /**
   * 加载表配置数据
   */
  async function loadTableConfig(tableInfo: TableInfo) {
    const basicData = generateDefaultBasicData(tableInfo);
    const optionsData = generateDefaultOptionsData();

    // 尝试获取已有的生成器配置
    const existingConfig = await getGeneratorConfig(tableInfo.tableName);
    if (existingConfig) {
      // 合并已有配置
      Object.assign(basicData, existingConfig);

      if (existingConfig.backendOptions) {
        optionsData.backendOptions = existingConfig.backendOptions;
      }
      if (existingConfig.frontendOptions) {
        optionsData.frontendOptions = existingConfig.frontendOptions;
      }
      if (existingConfig.features) {
        optionsData.features = existingConfig.features;
      }
    }

    // 获取字段数据
    columns.value = await getTableColumns(tableInfo.tableName);

    return {
      basicData,
      optionsData,
      columns: columns.value,
    };
  }

  /**
   * 合并表单数据并生成配置
   */
  async function mergeAndGenerateConfig(
    basicFormApi: any,
    optionsFormApi: any,
    fieldGridApi: any,
    needMerge: boolean,
  ) {
    const mergedValues = await basicFormApi
      .merge(optionsFormApi)
      .submitAllForm(needMerge);

    return {
      ...mergedValues,
      fields: fieldGridApi?.grid?.getData?.() || columns.value,
    };
  }

  /**
   * 保存配置
   */
  async function handleSave(
    basicFormApi: any,
    optionsFormApi: any,
    fieldGridApi: any,
    needMerge: boolean,
  ) {
    try {
      loading.value = true;
      const config = await mergeAndGenerateConfig(
        basicFormApi,
        optionsFormApi,
        fieldGridApi,
        needMerge,
      );
      await saveGeneratorConfig(config);
      message.success('保存成功');
    } catch {
      message.error('保存失败');
    } finally {
      loading.value = false;
    }
  }

  /**
   * 预览代码
   */
  async function handlePreview(
    basicFormApi: any,
    optionsFormApi: any,
    fieldGridApi: any,
    needMerge: boolean,
    previewDrawerApi: any,
  ) {
    try {
      loading.value = true;
      const config = await mergeAndGenerateConfig(
        basicFormApi,
        optionsFormApi,
        fieldGridApi,
        needMerge,
      );
      const result = await previewCode(config);
      previewDrawerApi.setData(result).open();
    } catch {
      message.error('预览失败');
    } finally {
      loading.value = false;
    }
  }

  /**
   * 生成代码
   */
  async function handleGenerate(
    basicFormApi: any,
    optionsFormApi: any,
    fieldGridApi: any,
    needMerge: boolean,
    emit: any,
  ) {
    try {
      loading.value = true;
      const config = await mergeAndGenerateConfig(
        basicFormApi,
        optionsFormApi,
        fieldGridApi,
        needMerge,
      );
      const result = await generateCode(config);
      if (result.success) {
        message.success('代码生成成功！');
        emit('success');
      }
    } catch {
      message.error('代码生成失败，请检查配置');
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    columns,
    loadTableConfig,
    handleSave,
    handlePreview,
    handleGenerate,
  };
}
