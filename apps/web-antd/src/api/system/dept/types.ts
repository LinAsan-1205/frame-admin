export namespace Dept {
  export interface View {
    [key: string]: any;
    children?: Dept.View[];
    id: string;
    name: string;
    remark?: string;
    status: 0 | 1;
  }
}
