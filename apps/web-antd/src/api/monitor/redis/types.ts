export declare namespace RedisCache {
  // Redis缓存监控信息
  export interface Info {
    /** Redis版本号 */
    version: string;
    /** 运行模式 */
    mode: string;
    /** 端口 */
    port: number;
    /** 客户端连接数 */
    connectedClients: number;
    /** 最大内存配置 */
    maxMemory: string;
    /** 已使用内存 */
    usedMemory: string;
    /** Key总数量 */
    totalKeys: number;
    /** 过期Key数量 */
    expiredKeys: number;
    /** AOF是否开启 */
    aofEnabled: boolean;
    /** 运行时间(天) */
    uptimeDays: number;
    /** RDB最后保存状态 */
    rdbLastSaveStatus: string;
    /** RDB最后保存时间 */
    rdbLastSaveTime: string;
    /** 内存使用率 */
    memoryUsagePercent: number;
    /** 缓存命中率 */
    hitRate: number;
    /** 网络输入字节数 */
    totalNetInputBytes: string;
    /** 网络输出字节数 */
    totalNetOutputBytes: string;
  }
}
