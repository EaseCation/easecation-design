# FileDropzone

Accessible file acquisition with a native picker and drag target. `disabled` blocks both paths; `multiple=false` takes only the first dropped file. Native inputs reset after selection so the same file can be selected again.

The caller owns accepted-content validation, limits, upload progress, cancellation and persistence. `accept` guides the native picker; it is not a security check. No network request is made by this component.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function FileDropzone({
  onFilesSelected,
  accept,
  multiple,
  disabled,
  label,
  description,
  className,
}: FileDropzoneProps): JSX.Element;

export declare interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: ReactNode;
  className?: string;
}
```

<!-- generated-api:end -->
