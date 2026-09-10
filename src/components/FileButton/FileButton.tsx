import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ChangeEventHandler,
  type InputHTMLAttributes,
} from 'react';
import { Button, type ButtonProps } from '../Button';

export interface FileButtonProps extends Omit<ButtonProps, 'type' | 'onChange'> {
  accept?: string;
  multiple?: boolean;
  capture?: InputHTMLAttributes<HTMLInputElement>['capture'];
  name?: string;
  form?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const FileButton = forwardRef<HTMLInputElement, FileButtonProps>(function FileButton(
  {
    accept,
    multiple,
    capture,
    name,
    form,
    onChange,
    onClick,
    disabled,
    loading,
    children,
    ...buttonProps
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  return (
    <span className="ec-file-button">
      <Button
        {...buttonProps}
        disabled={disabled}
        loading={loading}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) inputRef.current?.click();
        }}
      >
        {children}
      </Button>
      <input
        ref={inputRef}
        className="ec-file-button__input"
        type="file"
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        capture={capture}
        name={name}
        form={form}
        disabled={disabled || loading}
        onChange={onChange}
      />
    </span>
  );
});
