import type { Generator } from '#/api/generator';

import { requestClient } from '#/api/request';

/**
 * 获取数据库表列表
 */
function getDatabaseTables() {
  return requestClient.get<Generator.TableInfo[]>('/generator/tables');
}

/**
 * 获取表详细信息
 * @param tableName 表名
 */
function getTableInfo(tableName: string) {
  return requestClient.get<Generator.TableInfo>(
    `/generator/table/${tableName}`,
  );
}

/**
 * 获取表字段信息
 * @param tableName 表名
 */
function getTableColumns(tableName: string) {
  return requestClient.get<Generator.ColumnInfo[]>(
    `/generator/table/${tableName}/columns`,
  );
}

/**
 * 保存生成配置
 * @param config 配置信息
 */
function saveGeneratorConfig(config: Generator.Config) {
  return requestClient.post('/generator/config/save', config);
}

/**
 * 获取生成配置
 * @param tableName 表名
 */
function getGeneratorConfig(tableName: string) {
  return requestClient.get<Generator.Config>(`/generator/config/${tableName}`);
}

/**
 * 预览生成代码
 * @param config 配置信息
 */
function previewCode(config: Generator.Config) {
  return requestClient.post<Generator.PreviewResult>(
    '/generator/preview',
    config,
  );
}

/**
 * 生成代码
 * @param config 配置信息
 */
function generateCode(config: Generator.Config) {
  return requestClient.post<Generator.GenerateResult>(
    '/generator/generate',
    config,
  );
}

/**
 * 批量生成代码
 * @param configs 配置列表
 */
function batchGenerateCode(configs: Generator.Config[]) {
  return requestClient.post<Generator.GenerateResult[]>(
    '/generator/generate/batch',
    {
      configs,
    },
  );
}

export {
  batchGenerateCode,
  generateCode,
  getDatabaseTables,
  getGeneratorConfig,
  getTableColumns,
  getTableInfo,
  previewCode,
  saveGeneratorConfig,
};
