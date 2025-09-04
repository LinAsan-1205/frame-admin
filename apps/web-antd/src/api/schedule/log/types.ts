export declare namespace Log {
  export interface View {
    taskId: number;
    taskName: string;
    startTime: string;
    endTime: string;
    error: string;
  }

  export interface Condition {
    taskId?: number;
    taskName?: string;
  }
}
