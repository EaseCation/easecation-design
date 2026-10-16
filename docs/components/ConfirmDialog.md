# ConfirmDialog

异步操作确认。等待时统一阻止重复提交、取消、Escape、遮罩和宿主返回键关闭；失败后保留内容，用户可重试或取消。

## 导入

```tsx
import { ConfirmDialog } from '@easecation/design';
```

## 示例

```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="归档此项目？"
  description="之后可以从归档中恢复。"
  confirmLabel="归档"
  cancelLabel="取消"
  errorMessage="归档失败，请重试。"
  onConfirm={() => archiveItem(itemId)}
/>
```

`onConfirm` 成功 resolve 时请求关闭，reject 时展示 `errorMessage`。异常原文不会直接暴露给用户。重试是否安全、权限、数据刷新和实际请求属于应用；不要吞掉请求错误后 resolve。`destructive` 使用危险操作按钮。

每次重新打开都会开始新会话；已经关闭的旧请求完成时不会关闭新会话。组件无法取消业务请求，应用在主动关闭或卸载时需要自行处理网络取消策略。

触屏初始焦点位于对话框容器，避免自动唤起输入法；键盘用户保持焦点圈定，关闭后回到触发位置。默认操作文案来自 `LocaleProvider`，显式传入的文案优先。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function ConfirmDialog(props: ConfirmDialogProps): JSX.Element | null;

export declare interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Resolve to close; reject to keep the dialog open for an explicit retry. */
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  errorMessage?: string;
  destructive?: boolean;
}
```

<!-- generated-api:end -->
