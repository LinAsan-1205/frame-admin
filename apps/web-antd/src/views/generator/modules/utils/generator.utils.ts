/**
 * 从表名中提取模块名
 * @param tableName 表名
 * @returns 模块名
 */
export function extractModuleName(tableName: string): string {
  return tableName.replace(/^[a-z]+_/, '');
}

/**
 * 生成模块路径
 * @param tableName 表名
 * @returns 模块路径
 */
export function generateModulePath(tableName: string): string {
  const parts = tableName.split('_');
  return parts.join('/');
}

/**
 * 生成权限前缀
 * @param tableName 表名
 * @returns 权限前缀
 */
export function generatePermissionPrefix(tableName: string): string {
  const parts = tableName.split('_');
  return parts.join(':');
}

/**
 * 生成默认的基础配置数据
 */
export function generateDefaultBasicData(tableInfo: {
  tableComment?: string;
  tableName: string;
}) {
  return {
    tableName: tableInfo.tableName,
    tableComment: tableInfo.tableComment || '',
    moduleName: extractModuleName(tableInfo.tableName),
    businessName: tableInfo.tableComment?.replace(/表$/, '') || '',
    modulePath: generateModulePath(tableInfo.tableName),
    permissionPrefix: generatePermissionPrefix(tableInfo.tableName),
  };
}
