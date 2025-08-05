import { OperationStatus, OperationType } from './enum';

export declare namespace Operation {
  export type StatusType = typeof OperationStatus.valueType;
  export type OperationType = typeof OperationType.valueType;
  export interface View {
    id: number;
    userId: number;
    username: string;
    module: string;
    operationType: OperationType;
    description: string;
    method: string;
    url: string;
    params: string;
    result: string;
    status: StatusType;
    errorMsg: string;
    ip: string;
    userAgent: string;
    operationTime: string;
    costTime: number;
  }

  export interface Condition {
    username?: string;
    method?: string;
    status?: StatusType;
    userId?: number;
    operationType?: OperationType;
  }
}
