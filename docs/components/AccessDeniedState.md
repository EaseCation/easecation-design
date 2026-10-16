# AccessDeniedState

统一呈现无权限状态。复用 EmptyState 的布局和表面，使用权限图标；默认文案跟随 LocaleProvider。

```tsx
import { AccessDeniedState, Button } from '@easecation/design';

<AccessDeniedState action={<Button onClick={goHome}>返回首页</Button>} />;
```

`title`、`description` 可覆盖默认文案；`action` 由应用提供，`embedded` 用于已有容器内。
组件不判断权限、不发起请求、不自动跳转。应用必须在挂载受限内容前完成权限检查；
已登录但无权限时保留当前状态，由用户选择返回首页，避免误导为登录失效。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function AccessDeniedState({
  title,
  description,
  ...props
}: AccessDeniedStateProps): JSX.Element;

export declare interface AccessDeniedStateProps extends Omit<EmptyStateProps, 'title' | 'icon'> {
  title?: string;
}

export declare interface EmptyStateProps extends ComponentProps<'div'> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  embedded?: boolean;
}
```

<!-- generated-api:end -->
