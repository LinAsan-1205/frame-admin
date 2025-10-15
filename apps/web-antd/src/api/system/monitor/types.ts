/**
 * 服务器监控命名空间
 */
export declare namespace ServerMonitor {
  /**
   * CPU 信息
   */
  export interface CpuInfo {
    /** CPU 核心数 */
    cpuNum: number;
    /** CPU 总使用率 */
    total: number;
    /** 系统使用率 */
    sys: number;
    /** 用户使用率 */
    used: number;
    /** 当前等待率 */
    wait: number;
    /** 当前空闲率 */
    free: number;
  }

  /**
   * 内存信息
   */
  export interface MemInfo {
    /** 内存总量 (GB) */
    total: number;
    /** 已用内存 (GB) */
    used: number;
    /** 剩余内存 (GB) */
    free: number;
    /** 使用率 (%) */
    usage: number;
  }

  /**
   * Node.js 运行时信息
   */
  export interface NodeInfo {
    /** 堆内存总量 (MB) */
    total: number;
    /** 堆内存最大值 (MB) */
    max: number;
    /** 空闲堆内存 (MB) */
    free: number;
    /** Node.js 版本 */
    version: string;
    /** Node.js 安装路径 */
    home: string;
    /** 运行时长 (秒) */
    runTime: string;
    /** V8 引擎版本 */
    name: string;
    /** 已使用堆内存 (MB) */
    used: number;
    /** 启动时间 */
    startTime: string;
  }

  /**
   * 系统信息
   */
  export interface SysInfo {
    /** 服务器名称 */
    computerName: string;
    /** 服务器IP地址 */
    computerIp: string;
    /** 项目路径 */
    userDir: string;
    /** 操作系统 */
    osName: string;
    /** 系统架构 */
    osArch: string;
  }

  /**
   * 磁盘信息
   */
  export interface SysFile {
    /** 盘符路径 */
    dirName: string;
    /** 文件系统 */
    sysTypeName: string;
    /** 挂载点 */
    typeName: string;
    /** 总大小 */
    total: string;
    /** 剩余大小 */
    free: string;
    /** 已用大小 */
    used: string;
    /** 资源使用率 (%) */
    usage: number;
  }

  /**
   * 服务器监控信息
   */
  export interface Info {
    /** CPU 相关信息 */
    cpu: CpuInfo;
    /** 内存相关信息 */
    mem: MemInfo;
    /** Node.js 相关信息 */
    node: NodeInfo;
    /** 系统相关信息 */
    sys: SysInfo;
    /** 磁盘相关信息 */
    sysFiles: SysFile[];
  }
}
