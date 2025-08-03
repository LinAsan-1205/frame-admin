export declare namespace Role {
  export interface View {
    id: number;
    name: string;
    code: string;
    sort: number;
    status: string;
    remark?: string;
  }
  export interface Condition {
    name?: string;
    code?: string;
    status?: string;
    startTime?: string;
    endTime?: string;
  }

  export type Post = Omit<View, 'id'>;
}
