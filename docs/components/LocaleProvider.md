# LocaleProvider

统一公共控件的关闭、取消、重试和加载文案。业务内容和日期时区仍由应用指定。默认使用英文，支持中文以及局部文案覆盖。

```tsx
import { LocaleProvider, Button } from '@easecation/design';

<LocaleProvider locale="zh-CN">
  <Button>继续</Button>
</LocaleProvider>;
```

嵌套 Provider 未指定 locale 时继承上层语言和文案；组件显式传入的 label 优先。切换 locale 会使用对应语言的基础文案，再应用当前 messages 覆盖。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function LocaleProvider({
  locale,
  messages,
  children,
}: LocaleProviderProps): JSX.Element;

export declare interface LocaleProviderProps {
  locale?: DesignLocale;
  messages?: Partial<LocaleMessages>;
  children: ReactNode;
}

export declare type DesignLocale = keyof typeof localeMessages;

export declare const localeMessages: {
  readonly en: {
    readonly resetView: 'Reset view';
    readonly flipVertical: 'Flip vertically';
    readonly flipHorizontal: 'Flip horizontally';
    readonly rotateRight: 'Rotate right';
    readonly rotateLeft: 'Rotate left';
    readonly zoomLevel: 'Zoom level';
    readonly zoomIn: 'Zoom in';
    readonly zoomOut: 'Zoom out';
    readonly nextImage: 'Next image';
    readonly previousImage: 'Previous image';
    readonly imageControls: 'Image controls';
    readonly imagePreview: 'Image preview';
    readonly chooseOrDropFiles: 'Choose or drop files';
    readonly pagination: 'Pagination';
    readonly previousPage: 'Previous page';
    readonly nextPage: 'Next page';
    readonly pageSize: 'Page size';
    readonly jumpToPage: 'Go to page';
    readonly goToPage: 'Go';
    readonly accessDenied: 'Access denied';
    readonly accessDeniedDescription: 'Your account does not have permission to view this page.';
    readonly notifications: 'Notifications';
    readonly date: 'Date';
    readonly startDate: 'Start date';
    readonly endDate: 'End date';
    readonly all: 'All';
    readonly close: 'Close';
    readonly cancel: 'Cancel';
    readonly confirm: 'Confirm';
    readonly retry: 'Retry';
    readonly loading: 'Loading';
    readonly noData: 'No data';
    readonly loadFailed: 'Unable to load';
    readonly actionFailed: 'Unable to complete this action. Please try again.';
    readonly apply: 'Apply';
    readonly clear: 'Clear';
    readonly expandText: 'Read more';
    readonly collapseText: 'Read less';
  };
  readonly 'zh-CN': {
    readonly resetView: '重置视图';
    readonly flipVertical: '垂直翻转';
    readonly flipHorizontal: '水平翻转';
    readonly rotateRight: '向右旋转';
    readonly rotateLeft: '向左旋转';
    readonly zoomLevel: '缩放比例';
    readonly zoomIn: '放大';
    readonly zoomOut: '缩小';
    readonly nextImage: '下一张';
    readonly previousImage: '上一张';
    readonly imageControls: '图片操作';
    readonly imagePreview: '图片预览';
    readonly chooseOrDropFiles: '选择或拖入文件';
    readonly pagination: '分页';
    readonly previousPage: '上一页';
    readonly nextPage: '下一页';
    readonly pageSize: '每页条数';
    readonly jumpToPage: '跳至页码';
    readonly goToPage: '跳转';
    readonly accessDenied: '无权访问';
    readonly accessDeniedDescription: '当前账号没有访问此页面的权限。';
    readonly notifications: '通知';
    readonly date: '日期';
    readonly startDate: '开始日期';
    readonly endDate: '结束日期';
    readonly all: '全部';
    readonly close: '关闭';
    readonly cancel: '取消';
    readonly confirm: '确认';
    readonly retry: '重试';
    readonly loading: '正在加载';
    readonly noData: '暂无数据';
    readonly loadFailed: '加载失败';
    readonly actionFailed: '操作未完成，请重试。';
    readonly apply: '应用';
    readonly clear: '清除';
    readonly expandText: '展开全文';
    readonly collapseText: '收起';
  };
};

export declare type LocaleMessages = {
  [K in keyof typeof localeMessages.en]: string;
};
```

<!-- generated-api:end -->
