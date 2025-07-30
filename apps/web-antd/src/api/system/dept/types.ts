export namespace Dept {
  export interface View {
    [key: string]: any;
    children?: Dept.View[];
    id: number;
    name: string;
    remark?: string;
    status: 0 | 1;
    leader?: string;
    phone?: string;
  }
  export interface Condition {
    name?: string;
    leader?: string;
    phone?: string;
  }
}
