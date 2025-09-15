export interface DualPaneLayoutProps {
  /**
   * 左侧面板折叠后的宽度百分比
   * @default 5
   */
  leftCollapsedWidth?: number;

  /**
   * 左侧面板是否可折叠
   * @default true
   */
  leftCollapsible?: boolean;

  /**
   * 左侧面板最大宽度百分比
   * @default 50
   */
  leftMaxWidth?: number;

  /**
   * 左侧面板最小宽度百分比
   * @default 20
   */
  leftMinWidth?: number;

  /**
   * 左侧面板默认宽度百分比
   * @default 20
   */
  leftWidth?: number;

  /**
   * 是否支持拖拽调整大小
   * @default true
   */
  resizable?: boolean;

  /**
   * 右侧面板宽度百分比
   * @default 80
   */
  rightWidth?: number;

  /**
   * 是否显示分割线拖拽手柄
   * @default false
   */
  splitHandle?: boolean;

  /**
   * 是否显示分割线
   * @default false
   */
  splitLine?: boolean;

  /**
   * 展开按钮的提示文本
   * @default '点击展开左侧'
   */
  expandTooltip?: string;
}
