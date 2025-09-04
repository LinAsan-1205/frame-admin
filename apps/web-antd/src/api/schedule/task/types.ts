import type { TaskEnabled, TaskStatus, TaskType } from './enum';

export declare namespace Task {
  export interface View {
    /**
     * Cron表达式
     */
    cronExpression: string;
    /**
     * 当前重试次数
     */
    currentRetry: number;
    /**
     * 任务描述
     */
    description: string;
    /**
     * 是否启用
     */
    enabled: string;
    /**
     * 执行次数
     */
    executeCount: number;
    /**
     * 失败次数
     */
    failCount: number;
    /**
     * 任务ID
     */
    id: number;
    /**
     * 间隔时间（毫秒）
     */
    interval: number;
    /**
     * 最后执行错误信息
     */
    lastError: string;
    /**
     * 最后执行时间
     */
    lastExecuteTime: Date;
    /**
     * 最后执行结果
     */
    lastResult: string;
    /**
     * 最大重试次数
     */
    maxRetry: number;
    /**
     * 任务名称
     */
    name: string;
    /**
     * 下次执行时间
     */
    nextExecuteTime: Date;
    /**
     * 任务参数
     */
    params: string;
    /**
     * 任务处理器
     */
    processor: string;
    /**
     * 任务状态
     */
    status: number;
    /**
     * 成功次数
     */
    successCount: number;
    /**
     * 任务超时时间（毫秒）
     */
    timeout: number;
    /**
     * 任务类型
     */
    type: typeof TaskType.valueType;
  }

  export interface Condition {
    name?: string;
    description?: string;
    type?: typeof TaskType.valueType;
    status?: typeof TaskStatus.valueType;
    enabled?: typeof TaskEnabled.valueType;
  }

  export interface Post {
    name: string;
    description?: string;
    type?: typeof TaskType.valueType;
    interval?: number;
    processor: string;
    params?: string;
    maxRetry?: number;
    timeout?: number;
  }
}
