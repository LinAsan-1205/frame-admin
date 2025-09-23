export declare global {
  export interface EnumExtension {
    toOriginItems: () => { [key: string]: any; title: string; value: V }[];
    toValue: () => V[];
  }
}
