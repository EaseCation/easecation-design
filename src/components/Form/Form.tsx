import { createContext, useContext, useId, type FormHTMLAttributes, type ReactNode } from 'react';
export type FormLayout = 'vertical' | 'horizontal' | 'inline';
interface FormContextValue { layout: FormLayout; disabled: boolean; }
const FormContext = createContext<FormContextValue>({ layout: 'vertical', disabled: false });
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> { layout?: FormLayout; disabled?: boolean; }
export function Form({ layout = 'vertical', disabled = false, className, children, ...props }: FormProps) {
  return <FormContext.Provider value={{ layout, disabled }}><form className={['ec-form', `ec-form--${layout}`, className].filter(Boolean).join(' ')} {...props}>{children}</form></FormContext.Provider>;
}
export interface FieldProps { label?: ReactNode; required?: boolean; help?: ReactNode; error?: ReactNode; children: (props: { id: string; 'aria-describedby'?: string; disabled?: boolean }) => ReactNode; className?: string; }
export function Field({ label, required, help, error, children, className }: FieldProps) {
  const { disabled } = useContext(FormContext); const id = useId(); const messageId = `${id}-message`;
  return <div className={['ec-form-field', className].filter(Boolean).join(' ')}>{label ? <label htmlFor={id} className="ec-form-label">{label}{required ? <span className="ec-required" aria-hidden="true"> *</span> : null}</label> : null}<div className="ec-form-field__control">{children({ id, 'aria-describedby': help || error ? messageId : undefined, disabled })}</div>{error ? <div id={messageId} className="ec-form-help ec-form-help--error" role="alert">{error}</div> : help ? <div id={messageId} className="ec-form-help">{help}</div> : null}</div>;
}