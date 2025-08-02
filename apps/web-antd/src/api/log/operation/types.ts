export declare namespace Operation {
  export interface View {
    id: number;
    userId: number;
    username: string;
    module: string;
    operationType: string;
    description: string;
    method: string;
    url: string;
    params: string;
    result: string;
    status: number;
    errorMsg: string;
    ip: string;
    userAgent: string;
    operationTime: string;
    costTime: number;
  }

  export interface Condition {
    username?: string;
    method?: string;
    status?: number;
    userId?: number;
  }
}
