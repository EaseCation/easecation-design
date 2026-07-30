import React, { createContext, forwardRef, isValidElement, useContext, useEffect, useMemo, useState } from 'react';
import type { FormEventHandler, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { toast, Toaster } from '../Toast';
import { Button as BaseButton } from '../Button';
import { Card as BaseCard } from '../Card';
import { Input as BaseInput, Textarea as BaseTextarea } from '../Input';
import { Select as BaseSelect } from '../Select';
import { Checkbox as BaseCheckbox } from '../Checkbox';
import { Switch as BaseSwitch } from '../Switch';
import { Modal as BaseModal } from '../Modal';
import { Drawer as BaseDrawer } from '../Drawer';
import { Skeleton as BaseSkeleton } from '../Skeleton';
import { Tooltip as BaseTooltip } from '../Tooltip';
import { Flex as BaseFlex, Divider as BaseDivider } from '../primitives';
import { EmptyState } from '../State';

export type SizeType = 'small' | 'middle' | 'large' | undefined;
export type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type Rule = any;
export type ColumnType<T = any> = any;
export type ColumnsType<T = any> = Array<ColumnType<T>>;
export type TableProps<T = any> = any;
export type UploadFile<T = any> = T & { uid?: string; name?: string; status?: string; url?: string };
export type UploadProps = any;
export type MessageInstance = typeof message;
export type DescriptionsProps = any;
export type FormInstance<T = any> = any;
export type DrawerProps = any;
export type ModalProps = any;
export type MenuProps = any;
export type TabsProps = any;
export type CollapseProps = any;
export type GlobalToken = Record<string, any>;

const cls = (...parts: any[]) => parts.filter(Boolean).join(' ');
const arr = (value: any) => (Array.isArray(value) ? value : value == null ? [] : [value]);
const get = (source: any, path: any) => arr(path).reduce((acc, key) => (acc == null ? acc : acc[key]), source);
const set = (source: any, path: any, value: any) => {
  const keys = arr(path); if (!keys.length) return value;
  const next = { ...(source ?? {}) }; let cursor = next;
  keys.forEach((key, index) => { if (index === keys.length - 1) cursor[key] = value; else { cursor[key] = { ...(cursor[key] ?? {}) }; cursor = cursor[key]; } });
  return next;
};
const eventValue = (event: any) => event?.target ? ('checked' in event.target ? event.target.checked : event.target.value) : event;
const size = (value?: any) => value === 'large' ? 'lg' : value === 'small' ? 'sm' : 'md';
const variant = (type?: string, danger?: boolean, ghost?: boolean) => danger ? 'danger' : type === 'primary' ? 'primary' : ghost || type === 'link' || type === 'text' ? 'ghost' : 'secondary';

const notify = (kind: 'success' | 'info' | 'warning' | 'error' | 'loading', content: any) => {
  const text = typeof content === 'string' ? content : content?.content ?? content?.message ?? '';
  const description = typeof content === 'string' ? undefined : content?.description;
  const duration = typeof content === 'string' ? undefined : content?.duration;
  return toast[kind === 'loading' ? 'info' : kind](text || kind, { description, duration });
};
export const message = { success: (v:any)=>notify('success',v), info:(v:any)=>notify('info',v), warning:(v:any)=>notify('warning',v), warn:(v:any)=>notify('warning',v), error:(v:any)=>notify('error',v), loading:(v:any)=>notify('loading',v), open:(v:any)=>notify(v?.type??'info',v), destroy:(key?:any)=>toast.dismiss(key) };
export const notification = message;
export const App: any = ({ children, className, ...props }: any) => <div className={cls('ec-app', className)} {...props}><Toaster richColors position="top-right" />{children}</div>;
App.useApp = () => ({ message, notification, modal: Modal });
export const zhCN = { locale: 'zh_CN' };
export const ConfigProvider: any = ({ children }: any) => <>{children}</>;
ConfigProvider.ConfigContext = createContext({});

export const legacyToken: Record<string, any> = {
  colorPrimary: 'var(--ec-color-primary)', colorPrimaryHover: 'var(--ec-color-primary-hover)', colorPrimaryActive: 'var(--ec-color-primary-active)', colorPrimaryBg: 'var(--ec-surface-muted)', colorPrimaryBorder: 'var(--ec-color-primary)', colorPrimaryBorderHover: 'var(--ec-color-primary-hover)',
  colorText: 'var(--ec-text-primary)', colorTextSecondary: 'var(--ec-text-secondary)', colorTextTertiary: 'var(--ec-text-muted)', colorTextQuaternary: 'var(--ec-text-muted)', colorTextLightSolid: '#fff',
  colorBorder: 'var(--ec-border)', colorBorderSecondary: 'var(--ec-border)', colorBgLayout: 'var(--ec-app-canvas)', colorBgContainer: 'var(--ec-surface)', colorBgElevated: 'var(--ec-surface)',
  colorFill: 'var(--ec-surface-muted)', colorFillSecondary: 'var(--ec-surface-muted)', colorFillTertiary: 'var(--ec-surface-muted)', colorFillQuaternary: 'var(--ec-surface-muted)', colorFillAlter: 'var(--ec-surface-muted)',
  colorSuccess: 'var(--ec-color-success)', colorSuccessText: 'var(--ec-color-success)', colorSuccessBorder: 'var(--ec-color-success)',
  colorWarning: 'var(--ec-color-warning)', colorWarningText: 'var(--ec-color-warning)', colorWarningBg: 'var(--ec-surface-muted)', colorWarningBorder: 'var(--ec-color-warning)',
  colorError: 'var(--ec-color-danger)', colorErrorText: 'var(--ec-color-danger)', colorErrorBg: 'var(--ec-surface-muted)', colorErrorBorder: 'var(--ec-color-danger)', colorInfo: 'var(--ec-color-info)',
  boxShadow: 'var(--ec-shadow-md)', boxShadowTertiary: 'var(--ec-shadow-sm)', borderRadius: 8, borderRadiusLG: 12, borderRadiusSM: 4, fontSize: 14, fontSizeSM: 12, fontSizeLG: 16,
  marginXS: 8, marginSM: 12, margin: 16, marginLG: 24, paddingXS: 8, paddingSM: 12, padding: 16, paddingLG: 24, gold1: 'var(--ec-surface-muted)', purple1: 'var(--ec-surface-muted)',
};
export const theme = { defaultAlgorithm: {}, darkAlgorithm: {}, useToken: () => ({ token: legacyToken, theme: {}, hashId: '' }) };

export const Button: any = forwardRef<any, any>(function Button({ type, danger, ghost, size: s, loading, block, icon, children, className, htmlType, href, target, rel, shape: _shape, ...props }, ref) {
  const resolvedVariant = variant(type, danger, ghost);
  const resolvedSize = size(s);
  if (href) {
    const anchorClassName = cls('ec-button', 'ec-focusable', `ec-button--${resolvedVariant}`, `ec-button--${resolvedSize}`, block && 'ec-button--block', 'ec-btn', className);
    return <a ref={ref} href={href} target={target} rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)} aria-busy={loading || undefined} className={anchorClassName} {...props}><span className="ec-button__content">{loading ? <span className="ec-spinner" aria-hidden="true" /> : icon ? <span className="ec-button__icon">{icon}</span> : null}<span>{children}</span></span></a>;
  }
  return <BaseButton ref={ref} type={htmlType ?? props.type} variant={resolvedVariant} size={resolvedSize} loading={loading} block={block} leadingIcon={icon} className={cls('ec-btn', className)} {...props}>{children}</BaseButton>;
});
export const Space: any = forwardRef<HTMLDivElement, any>(function Space({ direction, orientation, vertical, size: s = 8, align, wrap, children, className, style, active: _active, loading: _loading, ...props }, ref) { const gap = Array.isArray(s) ? `${s[1]}px ${s[0]}px` : typeof s === 'number' ? s : s === 'small' ? '8px' : s === 'middle' ? '16px' : s === 'large' ? '24px' : undefined; return <div ref={ref} className={cls('ec-space', className)} style={{ display:'flex', flexDirection: vertical || direction === 'vertical' || orientation === 'vertical' ? 'column':'row', gap, alignItems: align, flexWrap: wrap ? 'wrap' : undefined, ...style }} {...props}>{children}</div>; });
Space.Compact = ({ children, className, ...props }: any) => <div className={cls('ec-space-compact', className)} {...props}>{children}</div>;
export const Flex: any = forwardRef<HTMLDivElement, any>(function Flex({ vertical, gap, align, justify, wrap, active: _active, loading: _loading, ...props }, ref) { const resolvedGap = gap === 'small' ? '8px' : gap === 'middle' ? '16px' : gap === 'large' ? '24px' : gap; return <BaseFlex ref={ref} direction={vertical ? 'column':'row'} gap={resolvedGap} align={align} justify={justify} wrap={wrap} {...props} />; });
export const Typography: any = ({ children }: any) => <>{children}</>;
Typography.Text = ({ children, strong, type, disabled, mark, code, keyboard, italic, delete: del, className, ...props }: any) => {
  const Tag = code ? 'code' : keyboard ? 'kbd' : del ? 'del' : 'span';
  return <Tag className={cls('ec-typography', className)} data-type={type} data-disabled={disabled || undefined} data-mark={mark || undefined} style={{ fontWeight: strong ? 600 : undefined, fontStyle: italic ? 'italic' : undefined, ...props.style }} {...props}>{children}</Tag>;
};
Typography.Title = ({ level = 1, children, className, ...props }: any) => { const Tag = `h${level}` as any; return <Tag className={cls('ec-typography', className)} {...props}>{children}</Tag>; };
Typography.Paragraph = ({ children, className, ...props }: any) => <div className={cls('ec-typography', 'ec-typography-paragraph', className)} {...props}>{children}</div>;
Typography.Link = ({ children, className, ...props }: any) => <a className={cls('ec-typography', className)} {...props}>{children}</a>;
export const Input: any = forwardRef<HTMLInputElement, any>(function Input({ allowClear, addonBefore: _addonBefore, addonAfter: _addonAfter, showCount: _showCount, bordered: _bordered, status: _status, ...props }, ref) { return <BaseInput ref={ref} clearable={allowClear} {...props} />; });
Input.TextArea = forwardRef<HTMLTextAreaElement, any>(({ showCount: _showCount, autoSize: _autoSize, allowClear: _allowClear, ...props }, ref) => <BaseTextarea ref={ref} {...props} />);
Input.Search = forwardRef<HTMLInputElement, any>(({ onSearch, enterButton, loading: _loading, ...props }, ref) => <Input ref={ref} onKeyDown={(e:any)=>{props.onKeyDown?.(e); if(e.key==='Enter') onSearch?.(e.currentTarget.value,e);}} suffix={enterButton ? <Button onClick={()=>onSearch?.(props.value ?? '')}>Search</Button> : props.suffix} {...props} />);
Input.Password = Input;
export const TextArea = Input.TextArea; export const Search = Input.Search;
export const InputNumber: any = forwardRef<HTMLInputElement, any>(({ onChange, ...props }, ref) => <Input ref={ref} type="number" onChange={(e:any)=>onChange?.(e.target.value === '' ? null : Number(e.target.value))} {...props} />);
export const Select: any = forwardRef<HTMLButtonElement, any>(function Select({ options = [], children, value, defaultValue, onChange, onSelect, placeholder, mode, popupMatchSelectWidth: _popupMatchSelectWidth, dropdownStyle: _dropdownStyle, listHeight: _listHeight, styles: _styles, ...props }, ref) { const opts = options.length ? options : React.Children.toArray(children).map((c:any)=>c?.props).filter(Boolean); return <BaseSelect ref={ref} value={Array.isArray(value)?value[0]:value} defaultValue={Array.isArray(defaultValue)?defaultValue[0]:defaultValue} onValueChange={(next:any)=>{onChange?.(mode?[next]:next); onSelect?.(next);}} placeholder={placeholder} options={opts.map((o:any)=>({ value:String(o.value), label:o.label ?? o.children ?? o.value, disabled:o.disabled }))} {...props} />; });
Select.Option = ({ children }: any) => <>{children}</>;
export const Checkbox: any = forwardRef<HTMLInputElement, any>(({ checked, defaultChecked, onChange, children, ...props }, ref) => <BaseCheckbox ref={ref} checked={checked} defaultChecked={defaultChecked} onChange={onChange} label={children} {...props} />);
Checkbox.Group = ({ children }: any) => <div>{children}</div>;
export const Switch: any = forwardRef<HTMLButtonElement, any>(({ onChange, onCheckedChange, checkedChildren: _checkedChildren, unCheckedChildren: _unCheckedChildren, loading: _loading, size: _size, ...props }, ref) => <BaseSwitch ref={ref} onCheckedChange={(next:boolean)=>{onCheckedChange?.(next); onChange?.(next);}} {...props} />);
export const Radio: any = ({ checked, value, children, onChange, ...props }: any) => <label><input type="radio" checked={checked} value={value} onChange={onChange} {...props}/> {children}</label>;
Radio.Group = ({ value, onChange, options = [], children, ...props }: any) => <div {...props}>{options.length ? options.map((o:any)=><Radio key={o.value} checked={value===o.value} value={o.value} onChange={(e:any)=>onChange?.({target:{value:e.target.value}})}>{o.label}</Radio>) : children}</div>; Radio.Button = Radio;
export const Card: any = forwardRef<HTMLDivElement, any>(({ title, extra, actions, children, styles, bodyStyle, hoverable, loading, variant: cardVariant, bordered, size: cardSize, cover, tabList: _tabList, activeTabKey: _activeTabKey, onTabChange: _onTabChange, className, ...props }, ref) => <BaseCard ref={ref} size={cardSize === 'small' ? 'sm' : 'md'} pressable={hoverable} data-variant={cardVariant ?? (bordered === false ? 'borderless' : 'outlined')} className={cls('ec-card-legacy', className)} {...props}>{cover ? <div className="ec-card-cover">{cover}</div> : null}{(title||extra)&&<div className="ec-card-head"><div>{title}</div><div>{extra}</div></div>}<div className="ec-card-body" style={{...bodyStyle,...styles?.body}}>{loading ? <Skeleton active paragraph={{ rows: 2 }} /> : children}</div>{actions&&<div className="ec-card-actions">{arr(actions).map((action:any,index:number)=><span key={index}>{action}</span>)}</div>}</BaseCard>);
Card.Meta = ({ title, description, avatar }: any) => <div className="ec-card-meta">{avatar}<div>{title}{description}</div></div>;
export const Badge: any = ({ count, dot, children, status, color, size: _size, offset: _offset, showZero: _showZero, overflowCount: _overflowCount, ...props }: any) => <span {...props} className={cls('ec-badge', props.className)} data-status={status} data-color={color} style={{ '--ec-badge-color': color, ...props.style } as React.CSSProperties}>{children}{(dot||count!=null||status)&&<sup className="ec-badge-count">{dot||status?'':count}</sup>}</span>;
Badge.Ribbon = ({ children, text, color, placement: _placement, ...props }: any) => <div className="ec-ribbon-wrap"><span className="ec-ribbon" data-color={color} style={{ '--ec-ribbon-color': color, ...props.style } as React.CSSProperties}>{text}</span>{children}</div>;
export const Tag = ({ children, color, ...props }: any) => <span className={cls('ec-tag', props.className)} data-color={color} style={{ '--ec-tag-color': color, ...props.style } as React.CSSProperties} {...props}>{children}</span>;
export const Statistic = ({ title, value, prefix, suffix, valueStyle, formatter, precision, groupSeparator: _groupSeparator = ',', decimalSeparator = '.', loading: _loading, ...props }: any) => { const numeric = typeof value === 'number' && typeof precision === 'number' ? value.toFixed(precision).replace('.', decimalSeparator) : value; const displayValue = formatter ? formatter(value) : numeric; return <div {...props} className={cls('ec-statistic', props.className)}><div className="ec-statistic-title">{title}</div><div className="ec-statistic-value" style={valueStyle}>{prefix}{displayValue}{suffix}</div></div>; };
export const Divider = BaseDivider;
const FormCtx = createContext<any>(null);
const createForm = () => { let values:any={}; const listeners = new Set<()=>void>(); const emit=()=>listeners.forEach(l=>l()); return { getFieldValue:(n:any)=>get(values,n), getFieldsValue:()=>values, setFieldValue:(n:any,v:any)=>{values=set(values,n,v);emit();}, setFieldsValue:(v:any)=>{values={...values,...v};emit();}, resetFields:()=>{values={};emit();}, validateFields:async()=>values, submit:()=>undefined, scrollToField:()=>undefined, __subscribe:(l:()=>void)=>{listeners.add(l);return()=>listeners.delete(l);}, __setInitial:(v:any)=>{values={...v,...values};emit();} }; };
export const useForm = (form?: any) => useMemo(() => [form ?? createForm()], [form]);
export const Form = ({ form, initialValues, onFinish, onValuesChange, children, layout, labelCol: _labelCol, wrapperCol: _wrapperCol, preserve: _preserve, className, ...props }: any & { onSubmit?: FormEventHandler<HTMLFormElement> }) => { const [inner] = useForm(form); useEffect(()=>{if(initialValues) inner.__setInitial(initialValues);},[]); inner.submit=()=>onFinish?.(inner.getFieldsValue()); return <FormCtx.Provider value={{form:inner,onValuesChange}}><form onSubmit={e=>{e.preventDefault();inner.submit();}} className={cls('ec-form', layout && `ec-form-${layout}`, className)} {...props}>{children}</form></FormCtx.Provider>; };
Form.useForm = useForm; Form.useFormInstance = () => useContext(FormCtx)?.form ?? createForm(); Form.useWatch = (name:any, form?:any) => { const ctx=useContext(FormCtx); const f=form??ctx?.form; const [v,setV]=useState(f?.getFieldValue(name)); useEffect(()=>f?.__subscribe?.(()=>setV(f.getFieldValue(name))),[f,JSON.stringify(name)]); return v; };
Form.Item = ({ name, label, children, valuePropName='value', getValueFromEvent, noStyle, extra, help, required, labelCol: _labelCol, wrapperCol: _wrapperCol, preserve: _preserve, className, ...props }: any) => { const ctx=useContext(FormCtx); const [,force]=useState(0); useEffect(()=>ctx?.form?.__subscribe?.(()=>force(x=>x+1)),[ctx?.form]); const value=name!=null?ctx?.form?.getFieldValue(name):undefined; const child=isValidElement(children)&&name!=null?React.cloneElement(children as any,{[valuePropName]:value??(children as any).props?.[valuePropName], onChange:(...args:any[])=>{(children as any).props?.onChange?.(...args); const next=getValueFromEvent?getValueFromEvent(...args):eventValue(args[0]); ctx?.form?.setFieldValue(name,next); ctx?.onValuesChange?.({[arr(name).join('.')]:next},ctx.form.getFieldsValue());}}):children; if(noStyle)return<>{child}</>; return <div className={cls('ec-form-item', className)} {...props}>{label&&<label className="ec-form-item-label">{label}{required?' *':''}</label>}<div className="ec-form-item-control">{child}{help||extra?<div className="ec-form-item-help">{help??extra}</div>:null}</div></div>; };
Form.List = ({ children }: any) => children([], { add:()=>undefined, remove:()=>undefined, move:()=>undefined }); Form.Provider = ({children}:any)=><>{children}</>; export const FormContext = FormCtx;
export const Grid = { useBreakpoint: () => ({ xs:true, sm:true, md: typeof window !== 'undefined' ? window.innerWidth>=768 : true, lg: typeof window !== 'undefined' ? window.innerWidth>=992 : true, xl: typeof window !== 'undefined' ? window.innerWidth>=1200 : true, xxl:false }) };
const RowGutterCtx = createContext<[number, number]>([0, 0]);
export const Row = ({ children, gutter, style, ...props }: any) => { const horizontal = Number(Array.isArray(gutter) ? gutter[0] : gutter ?? 0); const vertical = Number(Array.isArray(gutter) ? gutter[1] : gutter ?? 0); return <RowGutterCtx.Provider value={[horizontal, vertical]}><div style={{display:'flex',flexWrap:'wrap',rowGap:vertical,marginLeft:horizontal ? -horizontal / 2 : undefined,marginRight:horizontal ? -horizontal / 2 : undefined,...style}} {...props}>{children}</div></RowGutterCtx.Provider>; };
const breakpointSpan = (value: any) => typeof value === 'number' ? value : value?.span;
const getViewportWidth = () => typeof window === 'undefined' ? 1440 : window.innerWidth;
export const Col = ({ span, xs, sm, md, lg, xl, xxl, children, style, ...props }: any) => { const [horizontal] = useContext(RowGutterCtx); const [viewportWidth, setViewportWidth] = useState(getViewportWidth); useEffect(() => { if (typeof window === 'undefined') return; const handleResize = () => setViewportWidth(window.innerWidth); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []); const resolvedSpan = span ?? (viewportWidth >= 1600 ? breakpointSpan(xxl) : undefined) ?? (viewportWidth >= 1200 ? breakpointSpan(xl) : undefined) ?? (viewportWidth >= 992 ? breakpointSpan(lg) : undefined) ?? (viewportWidth >= 768 ? breakpointSpan(md) : undefined) ?? (viewportWidth >= 576 ? breakpointSpan(sm) : undefined) ?? breakpointSpan(xs); return <div style={{boxSizing:'border-box',flex:resolvedSpan?`0 0 ${(resolvedSpan/24)*100}%`:undefined,maxWidth:resolvedSpan?`${(resolvedSpan/24)*100}%`:undefined,minWidth:0,paddingLeft:horizontal ? horizontal / 2 : undefined,paddingRight:horizontal ? horizontal / 2 : undefined,...style}} {...props}>{children}</div>; };
export const Spin = ({ children, spinning=true, tip, active: _active, loading: _loading, fullscreen: _fullscreen, delay: _delay, indicator: _indicator, ...props }: any) => children ? <div {...props} className={cls('ec-spin-container', props.className)}>{children}{spinning&&tip?<span className="ec-spin-tip">{tip}</span>:null}</div> : spinning ? <span {...props} className={cls('ec-spin-tip', props.className)}>{tip}</span> : null;
export const Skeleton: any = ({ children, loading=true, active: _active, paragraph: _paragraph, title: _title, avatar: _avatar, ...props }: any) => loading ? <BaseSkeleton {...props}/> : <>{children}</>; Skeleton.Button = Skeleton.Input = Skeleton.Avatar = Skeleton.Node = ({ active: _active, block: _block, size: _size, shape: _shape, ...props }:any)=><BaseSkeleton {...props}/>;
export const Empty: any = ({ description='No data', children, ...props }: any) => <EmptyState title={description} action={children} {...props}/>; Empty.PRESENTED_IMAGE_SIMPLE = null;
export const Alert = ({ type='info', message, description, action, showIcon: _showIcon, banner: _banner, className, ...props }: any) => <div role="alert" data-tone={type} className={cls('ec-alert', className)} {...props}><div className="ec-alert-mark" aria-hidden="true"/><div className="ec-alert-content"><strong>{message}</strong>{description&&<div className="ec-alert-description">{description}</div>}</div>{action ? <div className="ec-alert-action">{action}</div> : null}</div>;
export const Result = ({ status, title, subTitle, extra, ...props }: any) => <div {...props}><h2>{title??status}</h2><p>{subTitle}</p>{extra}</div>;
export const Tooltip = ({ title, content, children, ...props }: any) => title||content ? <BaseTooltip content={title??content} {...props}>{children}</BaseTooltip> : <>{children}</>;
export const Popover = ({ children }: any) => <>{children}</>; export const Popconfirm = ({ title, onConfirm, okText, cancelText, children }: any) => <span onClick={async (e)=>{e.stopPropagation(); if(await modalConfirm({ title, okText, cancelText })) onConfirm?.();}}>{children}</span>;
export const Modal = ({ open, visible, onCancel, onOk, title, children, footer, destroyOnHidden: _destroyOnHidden, destroyOnClose: _destroyOnClose, centered: _centered, width: _width, maskClosable, confirmLoading, okText='OK', cancelText='Cancel', closable, keyboard: _keyboard, mask: _mask, styles, cancelButtonProps, okButtonProps, ...props }: any & { onOpenChange?: (open: boolean) => void }) => <BaseModal open={Boolean(open??visible)} onOpenChange={(n: boolean)=>!n&&onCancel?.()} title={title} closeOnBackdrop={maskClosable !== false} showCloseButton={closable !== false} footer={footer === null ? null : footer === undefined ? <div className="ec-modal-actions"><Button onClick={onCancel} {...cancelButtonProps}>{cancelText}</Button><Button type="primary" loading={confirmLoading} onClick={onOk} {...okButtonProps}>{okText}</Button></div> : footer} {...props}><div style={styles?.body}>{children}</div></BaseModal>;
const modalConfirm = (config: any = {}) => {
  if (typeof document === 'undefined') return Promise.resolve(false);
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  let settled = false;
  let closeDialog: (result: boolean) => void = () => undefined;
  const cleanup = () => setTimeout(() => { root.unmount(); host.remove(); }, 0);
  const promise: any = new Promise<boolean>((resolve) => {
    const ConfirmDialog = () => {
      const [open, setOpen] = useState(true);
      const [loading, setLoading] = useState(false);
      closeDialog = (result: boolean) => {
        if (settled) return;
        settled = true;
        setOpen(false);
        resolve(result);
        cleanup();
      };
      const handleCancel = async () => {
        await config.onCancel?.();
        closeDialog(false);
      };
      const handleOk = async () => {
        if (config.okButtonProps?.disabled) return;
        try {
          setLoading(true);
          await config.onOk?.();
          closeDialog(true);
        } catch (error) {
          setLoading(false);
          throw error;
        }
      };
      const tone = config.type ?? (config.okButtonProps?.danger ? 'error' : 'info');
      return (
        <Modal
          open={open}
          onCancel={handleCancel}
          title={<span className="ec-modal-confirm-title">{config.icon ? <span className="ec-modal-confirm-icon" data-tone={tone}>{config.icon}</span> : null}{config.title}</span>}
          footer={config.footer === null ? null : (
            <div className="ec-modal-actions">
              <Button onClick={handleCancel} {...config.cancelButtonProps}>{config.cancelText ?? 'Cancel'}</Button>
              <Button type="primary" loading={loading} onClick={handleOk} {...config.okButtonProps}>{config.okText ?? 'OK'}</Button>
            </div>
          )}
          maskClosable={config.maskClosable}
          closable={config.closable}
        >
          <div className="ec-modal-confirm-content">{config.content}</div>
        </Modal>
      );
    };
    root.render(<ConfirmDialog />);
  });
  promise.destroy = () => closeDialog(false);
  return promise;
};
Modal.confirm = modalConfirm;
Modal.warning = (config: any = {}) => modalConfirm({ ...config, type: 'warning' });
Modal.error = (config: any = {}) => modalConfirm({ ...config, type: 'error', okButtonProps: { danger: true, ...config.okButtonProps } });
Modal.success = (config: any = {}) => modalConfirm({ ...config, type: 'success' });
Modal.info = (config: any = {}) => modalConfirm({ ...config, type: 'info' });
Modal.useModal=()=>[Modal,null];
export const Drawer = ({ open, visible, onClose, title, children, footer, destroyOnHidden: _destroyOnHidden, destroyOnClose: _destroyOnClose, getContainer: _getContainer, placement = 'right', width, height, styles, mask: _mask, maskClosable, keyboard: _keyboard, closable, className, ...props }: any) => <BaseDrawer open={Boolean(open??visible)} onOpenChange={(next: boolean)=>!next&&onClose?.()} title={title} footer={footer} placement={placement} size={placement === 'top' || placement === 'bottom' ? height : width} closeOnBackdrop={maskClosable !== false} showCloseButton={closable !== false} className={className} {...props}><div style={styles?.body}>{children}</div></BaseDrawer>;
export function Table<T = any>({ columns=[], dataSource=[], data=dataSource, rowKey, loading, onRow, rowSelection, onRowClick, ...props }: any & { onRowClick?: (record: T) => void }) { return <table {...props}><thead><tr>{rowSelection&&<th/>}{columns.map((c:any,i:number)=><th key={c.key??c.dataIndex??i}>{c.title}</th>)}</tr></thead><tbody>{loading?<tr><td>Loading...</td></tr>:data.map((r:any,i:number)=><tr key={typeof rowKey==='function'?rowKey(r):r?.[rowKey]??i} tabIndex={onRowClick ? 0 : undefined} onClick={()=>onRowClick?.(r)} onKeyDown={(e)=>{ if ((e.key === 'Enter' || e.key === ' ') && onRowClick) onRowClick(r); }} {...(onRow?.(r,i)??{})}>{rowSelection&&<td><input type="checkbox"/></td>}{columns.map((c:any,j:number)=>{const v=c.dataIndex?get(r,c.dataIndex):undefined;return <td key={c.key??c.dataIndex??j}>{c.render?c.render(v,r,i):v}</td>;})}</tr>)}</tbody></table>; }
function ListBase<T = any>({ dataSource=[], renderItem, children, locale, itemLayout: _itemLayout, loading: _loading, bordered: _bordered, split: _split, ...props }: any) { const content = dataSource.length ? dataSource.map((item:any,i:number)=>renderItem?renderItem(item,i):item) : locale?.emptyText ? <div className="ec-list-empty">{locale.emptyText}</div> : null; return <div {...props} className={cls('ec-list', props.className)}>{content}{children}</div>; } export const List: any = ListBase; List.Item = ({children, actions, extra, ...props}:any)=><div {...props} className={cls('ec-list-item', props.className)}><div className="ec-list-item-main">{children}</div>{extra ? <div className="ec-list-item-extra">{extra}</div> : null}{actions ? <div className="ec-list-item-actions">{arr(actions).map((action:any,index:number)=><span key={index}>{action}</span>)}</div> : null}</div>; (List as any).Item.Meta = ({title,description,avatar}:any)=><div className="ec-list-meta">{avatar ? <div className="ec-list-meta-avatar">{avatar}</div> : null}<div className="ec-list-meta-content"><div className="ec-list-meta-title">{title}</div><div className="ec-list-meta-description">{description}</div></div></div>;
export const Descriptions: any = ({ items, children, column: _column, bordered, size: descSize, layout, className, ...props }: any) => <dl {...props} className={cls('ec-descriptions', bordered && 'ec-descriptions--bordered', descSize && `ec-descriptions--${descSize}`, layout && `ec-descriptions--${layout}`, className)}>{items?items.map((it:any)=><div className="ec-descriptions-item" key={it.key??it.label}><dt>{it.label}</dt><dd>{it.children}</dd></div>):children}</dl>; Descriptions.Item=({label,children}:any)=><div className="ec-descriptions-item"><dt>{label}</dt><dd>{children}</dd></div>;
export const Segmented = ({ options=[], value, onChange, block, size: segmentedSize, className, ...props }: any) => <div {...props} className={cls('ec-segmented', block && 'ec-segmented--block', segmentedSize && `ec-segmented--${segmentedSize}`, className)}>{options.map((o:any)=>{const v=typeof o==='string'?o:o.value; const l=typeof o==='string'?o:o.label; return <button key={v} type="button" className="ec-segmented-item" data-selected={value===v} onClick={()=>onChange?.(v)}>{l}</button>;})}</div>;
export const Tabs = ({ items=[], activeKey, defaultActiveKey, onChange, children, tabPosition: _tabPosition, destroyInactiveTabPane: _destroyInactiveTabPane, className, ...props }: any) => { const [k,setK]=useState(activeKey??defaultActiveKey??items[0]?.key); const cur=activeKey??k; return <div {...props} className={cls('ec-tabs-legacy', className)}><nav className="ec-tabs-legacy-nav">{items.map((it:any)=><button type="button" className="ec-tabs-legacy-tab" data-active={it.key===cur} key={it.key} onClick={()=>{setK(it.key);onChange?.(it.key);}}>{it.label}</button>)}</nav><div className="ec-tabs-legacy-panel">{items.find((it:any)=>it.key===cur)?.children??children}</div></div>; };
export const Collapse: any = ({ items=[], children, bordered: _bordered, ghost: _ghost, className, ...props }: any) => <div {...props} className={cls('ec-collapse', className)}>{items.map((it:any)=><details className="ec-collapse-item" key={it.key}><summary>{it.label}</summary><div className="ec-collapse-body">{it.children}</div></details>)}{children}</div>; Collapse.Panel=({header,children}:any)=><details className="ec-collapse-item"><summary>{header}</summary><div className="ec-collapse-body">{children}</div></details>;
export const Steps = ({ items=[], current=0, status='process', direction, progressDot: _progressDot, responsive: _responsive, className, ...props }: any) => <ol {...props} className={cls('ec-steps', direction === 'vertical' && 'ec-steps--vertical', className)} data-status={status}>{items.map((it:any,i:number)=>{ const state = i < current ? 'finish' : i === current ? status : 'wait'; return <li key={it.key??i} className="ec-step" data-state={state} aria-current={i===current?'step':undefined}><span className="ec-step-icon">{it.icon ?? (i + 1)}</span><span className="ec-step-content"><span className="ec-step-title">{it.title}</span>{it.description ? <span className="ec-step-description">{it.description}</span> : null}</span></li>;})}</ol>;
export const Timeline:any = ({items=[],children,mode: _mode, pending, className,...props}:any)=><ol {...props} className={cls('ec-timeline', className)}>{items.map((it:any,i:number)=><li className="ec-timeline-item" data-color={it.color} key={it.key??i}><span className="ec-timeline-dot">{it.dot}</span><div className="ec-timeline-content">{it.children ?? it.label}</div></li>)}{children}{pending ? <li className="ec-timeline-item ec-timeline-item--pending"><span className="ec-timeline-dot"/><div className="ec-timeline-content">{pending}</div></li> : null}</ol>; Timeline.Item=({children,color,dot}:any)=><li className="ec-timeline-item" data-color={color}><span className="ec-timeline-dot">{dot}</span><div className="ec-timeline-content">{children}</div></li>;
export const Breadcrumb = ({ items=[], className, ...props }: any) => <nav {...props} className={cls('ec-breadcrumb', className)}>{items.map((it:any,i:number)=><span key={it.key??i}>{it.title}</span>)}</nav>; export const Pagination = ({ current, page, total, pageSize = 10, onChange, onPageChange, previousLabel = 'Previous page', nextLabel = 'Next page', pageLabel = (value: number) => `Page ${value}`, totalLabel, showSizeChanger: _showSizeChanger, showLessItems: _showLessItems, pageSizeOptions: _pageSizeOptions, className, ...props }: any & { onChange?: (page: number, pageSize: number) => void; onPageChange?: (page: number) => void; pageLabel?: (page: number) => ReactNode; totalLabel?: (total: number) => ReactNode }) => { const currentPage = current ?? page ?? 1; const pages = Math.max(1, Math.ceil((total ?? 0) / pageSize)); const go = (next: number) => { onChange?.(next, pageSize); onPageChange?.(next); }; return <div {...props} className={cls('ec-pagination', className)}><Button aria-label={previousLabel} disabled={currentPage<=1} onClick={()=>go(currentPage-1)}>Prev</Button><button type="button" className="ec-pagination-page" aria-current="page" aria-label={String(pageLabel(currentPage))}>{pageLabel(currentPage)}</button><Button aria-label={nextLabel} disabled={currentPage>=pages} onClick={()=>go(currentPage+1)}>Next</Button>{totalLabel ? <span>{totalLabel(total ?? 0)}</span> : null}</div>; };
export const Progress = ({percent=0,status,className,...props}:any)=><div {...props} className={cls('ec-progress', className)} data-status={status}><div className="ec-progress-bar" style={{width:`${percent}%`}}/></div>; export const Rate=({value=0,onChange,count=5,disabled}:any)=><span className="ec-rate">{Array.from({length:count},(_,i)=><button type="button" key={i} disabled={disabled} onClick={()=>onChange?.(i+1)}>{i<value?'★':'☆'}</button>)}</span>; export const Slider=({value=0,onChange,...props}:any)=><input className="ec-slider" type="range" value={value} onChange={e=>onChange?.(Number(e.target.value))} {...props}/>;
export const DatePicker: any = ({value,onChange,...props}:any)=><Input type="date" value={value?.format?.('YYYY-MM-DD')??value??''} onChange={(e:any)=>onChange?.(e.target.value,e.target.value)} {...props}/>; DatePicker.RangePicker=({onChange,...props}:any)=><Input onChange={(e:any)=>onChange?.(e.target.value)} {...props}/>; export const TimePicker=DatePicker; export const AutoComplete=Input; export const Avatar=({src,children,icon,size: avatarSize,shape: _shape,alt='',className,...props}:any)=><span {...props} data-size={size(avatarSize)} className={cls('ec-avatar', className)}>{src?<img className="ec-avatar__image" src={src} alt={alt}/>:<span className="ec-avatar__fallback">{icon ?? children}</span>}</span>; export const Watermark=({children}:any)=><>{children}</>; export const Dropdown=({children, menu, overlay, placement: _placement, trigger: _trigger}:any)=>{ const [open,setOpen]=useState(false); const ref=React.useRef<HTMLSpanElement>(null); useEffect(()=>{ if(!open) return; const close=(event:MouseEvent)=>{ if(!ref.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener('mousedown',close); return()=>document.removeEventListener('mousedown',close); },[open]); const items=(menu?.items??overlay?.items??[]).filter((item:any)=>item&&item.type!=='divider'); return <span ref={ref} className="ec-dropdown-wrap" onClick={(event)=>{event.stopPropagation();setOpen(next=>!next);}}>{children}{open&&items.length?<div className="ec-dropdown-menu" role="menu">{items.map((item:any)=><button key={item.key??item.label} type="button" role="menuitem" className={cls('ec-dropdown-menu-item', item.danger && 'is-danger')} onClick={(event)=>{event.stopPropagation();setOpen(false);item.onClick?.({key:item.key,domEvent:event});}}>{item.icon?<span className="ec-dropdown-menu-icon">{item.icon}</span>:null}<span>{item.label}</span></button>)}</div>:null}</span>; };
export const Upload: any = ({children,beforeUpload,onChange,multiple,accept,maxCount: _maxCount, customRequest: _customRequest, onRemove: _onRemove, fileList: _fileList, showUploadList: _showUploadList, listType: _listType, openFileDialogOnClick: _openFileDialogOnClick, className, ...props}:any)=><label {...props} className={cls('ec-upload', className)}>{children}<input hidden type="file" multiple={multiple} accept={accept} onChange={async e=>{const files=Array.from(e.target.files??[]); for(const f of files) await beforeUpload?.(f,files); onChange?.({file:files[0],fileList:files});}}/></label>; Upload.LIST_IGNORE='LIST_IGNORE';
export const Layout: any = ({children,...props}:any)=><div {...props}>{children}</div>; export const Header=({children,...props}:any)=><header {...props}>{children}</header>; export const Footer=({children,...props}:any)=><footer {...props}>{children}</footer>; export const Content=({children,...props}:any)=><main {...props}>{children}</main>; Layout.Header=Header; Layout.Footer=Footer; Layout.Content=Content; Layout.Sider=({children,...props}:any)=><aside {...props}>{children}</aside>;
export const Anchor: any = ({items=[],children,...props}:any)=><nav {...props} className={cls('ec-anchor', props.className)}>{items.map((it:any)=><a key={it.key??it.href} href={it.href}>{it.title}</a>)}{children}</nav>; Anchor.Link=({href,title,children}:any)=><a className="ec-anchor-link" href={href}>{title??children}</a>; export const Affix=({children}:any)=><div className="ec-affix">{children}</div>; export const Image: any=({src,alt,...props}:any)=><img src={src} alt={alt??''} {...props}/>; Image.PreviewGroup=({children}:any)=><>{children}</>;
export const Line = ({ data=[], xField, yField, height=220, ...props }: any) => { const vals=data.map((d:any)=>Number(d?.[yField]??0)); const max=Math.max(1,...vals); const w=640; const path=vals.map((v:number,i:number)=>`${i?'L':'M'}${vals.length<=1?0:(i/(vals.length-1))*w},${height-(v/max)*(height-24)-12}`).join(' '); return <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} {...props}><path d={path} fill="none" stroke="var(--ec-color-primary)" strokeWidth="3"/></svg>; };
export const createStyles = (factory:any) => () => ({ styles: factory({ prefixCls:'ec', css:(strings:TemplateStringsArray,...values:any[])=>strings.reduce((acc,part,i)=>`${acc}${part}${values[i]??''}`,'') }), cx: cls });

const iconPaths: Record<string, ReactNode> = {
  ArrowLeftOutlined: <path d="M14.5 5 7.5 12l7 7M8 12h10" />,
  ArrowRightOutlined: <path d="M9.5 5 16.5 12l-7 7M16 12H6" />,
  ArrowUpOutlined: <path d="M5 14.5 12 7.5l7 7M12 8v10" />,
  DownOutlined: <path d="m6 9 6 6 6-6" />,
  UpOutlined: <path d="m6 15 6-6 6 6" />,
  LeftOutlined: <path d="m15 6-6 6 6 6" />,
  RightOutlined: <path d="m9 6 6 6-6 6" />,
  PlusOutlined: <path d="M12 5v14M5 12h14" />,
  MinusOutlined: <path d="M5 12h14" />,
  CloseOutlined: <path d="m6 6 12 12M18 6 6 18" />,
  CheckOutlined: <path d="m5 12 4.2 4.2L19 6.5" />,
  SearchOutlined: <path d="m21 21-4.4-4.4M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />,
  HomeOutlined: <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" />,
  UserOutlined: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  TeamOutlined: <><path d="M8.5 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM15.5 11a3 3 0 1 0 0-6" /><path d="M3.5 20a5 5 0 0 1 10 0M12 20a5 5 0 0 1 8.5-3.5" /></>,
  ProfileOutlined: <><path d="M6 4h9l3 3v13H6z" /><path d="M14 4v4h4M9 12h6M9 16h6" /></>,
  FileTextOutlined: <><path d="M6 4h9l3 3v13H6z" /><path d="M9 12h6M9 16h4" /></>,
  BookOutlined: <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Zm0 0V21" />,
  MessageOutlined: <path d="M4 5h16v11H8l-4 4V5Z" />,
  BellOutlined: <><path d="M18 10a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" /><path d="M10 20h4" /></>,
  SettingOutlined: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a8 8 0 0 0 .1-6l-2.2.2-1.2-2 1.3-1.8a8 8 0 0 0-5.2-3l-.9 2.1H9l-.9-2.1a8 8 0 0 0-5.2 3l1.3 1.8-1.2 2-2.2-.2a8 8 0 0 0 .1 6l2.1-.2 1.2 2-1.2 1.8a8 8 0 0 0 5.1 3l.9-2.1h2.3l.9 2.1a8 8 0 0 0 5.1-3l-1.2-1.8 1.2-2 2.1.2Z" /></>,
  GithubOutlined: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.2-.4 6.5-1.6 6.5-7A5.4 5.4 0 0 0 20 3.8 5 5 0 0 0 19.9 0S18.7-.4 16 1.5a13.4 13.4 0 0 0-7 0C6.3-.4 5.1 0 5.1 0A5 5 0 0 0 5 3.8a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.3 6.6 6.5 7a3.4 3.4 0 0 0-1 2.6V22" />,
  TrophyOutlined: <><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4a4 4 0 0 0 4 4M16 6h4a4 4 0 0 1-4 4M12 12v4M9 20h6M10 16h4" /></>,
  BarChartOutlined: <path d="M5 19V9M12 19V5M19 19v-7" />,
  RobotOutlined: <><rect x="5" y="8" width="14" height="10" rx="2" /><path d="M12 8V4M8.5 13h.01M15.5 13h.01M9 18v2M15 18v2" /></>,
  ShopOutlined: <><path d="M4 10h16l-1.2-5H5.2L4 10Z" /><path d="M6 10v10h12V10M9 20v-5h6v5" /></>,
  ShoppingCartOutlined: <><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.2 12.2A2 2 0 0 0 9.2 17h8.4a2 2 0 0 0 2-1.6L21 8H6" /></>,
  WalletOutlined: <><path d="M4 7h16v12H4z" /><path d="M4 7a3 3 0 0 1 3-3h10v3M16 13h4" /></>,
  TagsOutlined: <><path d="M4 11V4h7l9 9-7 7-9-9Z" /><path d="M8 8h.01" /></>,
  TagOutlined: <><path d="M4 11V4h7l9 9-7 7-9-9Z" /><path d="M8 8h.01" /></>,
  CalendarOutlined: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
  ClockCircleOutlined: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  UploadOutlined: <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />,
  DownloadOutlined: <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />,
  EditOutlined: <><path d="M4 20h4l11-11-4-4L4 16v4Z" /><path d="m14 6 4 4" /></>,
  DeleteOutlined: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
};

const filledIconPaths: Record<string, ReactNode> = {
  CheckCircleFilled: <><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><path d="m8 12 2.5 2.5L16.5 8.5" stroke="var(--ec-surface, #fff)" /></>,
  CloseCircleFilled: <><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><path d="m9 9 6 6M15 9l-6 6" stroke="var(--ec-surface, #fff)" /></>,
  ExclamationCircleFilled: <><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><path d="M12 7v6M12 16.5h.01" stroke="var(--ec-surface, #fff)" /></>,
  BellFilled: <><path d="M18 10a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" fill="currentColor" stroke="none" /><path d="M10 20h4" /></>,
  MessageFilled: <path d="M4 5h16v11H8l-4 4V5Z" fill="currentColor" stroke="none" />,
};

const makeIcon = (label: string) => ({ className, style, ...props }: any) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {filledIconPaths[label] ?? iconPaths[label] ?? <><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></>}
  </svg>
);


export const AimOutlined: any = makeIcon('AimOutlined');
export const AlertOutlined: any = makeIcon('AlertOutlined');
export const ApartmentOutlined: any = makeIcon('ApartmentOutlined');
export const AppstoreAddOutlined: any = makeIcon('AppstoreAddOutlined');
export const AppstoreOutlined: any = makeIcon('AppstoreOutlined');
export const ArrowLeftOutlined: any = makeIcon('ArrowLeftOutlined');
export const ArrowRightOutlined: any = makeIcon('ArrowRightOutlined');
export const ArrowUpOutlined: any = makeIcon('ArrowUpOutlined');
export const AuditOutlined: any = makeIcon('AuditOutlined');
export const BarChartOutlined: any = makeIcon('BarChartOutlined');
export const BellFilled: any = makeIcon('BellFilled');
export const BellOutlined: any = makeIcon('BellOutlined');
export const BgColorsOutlined: any = makeIcon('BgColorsOutlined');
export const BoldOutlined: any = makeIcon('BoldOutlined');
export const BookOutlined: any = makeIcon('BookOutlined');
export const BulbOutlined: any = makeIcon('BulbOutlined');
export const CalendarOutlined: any = makeIcon('CalendarOutlined');
export const CarryOutOutlined: any = makeIcon('CarryOutOutlined');
export const CheckCircleFilled: any = makeIcon('CheckCircleFilled');
export const CheckCircleOutlined: any = makeIcon('CheckCircleOutlined');
export const CheckOutlined: any = makeIcon('CheckOutlined');
export const ClearOutlined: any = makeIcon('ClearOutlined');
export const ClockCircleOutlined: any = makeIcon('ClockCircleOutlined');
export const CloseCircleFilled: any = makeIcon('CloseCircleFilled');
export const CloseCircleOutlined: any = makeIcon('CloseCircleOutlined');
export const CloseOutlined: any = makeIcon('CloseOutlined');
export const CloudDownloadOutlined: any = makeIcon('CloudDownloadOutlined');
export const CloudOutlined: any = makeIcon('CloudOutlined');
export const CloudServerOutlined: any = makeIcon('CloudServerOutlined');
export const CloudSyncOutlined: any = makeIcon('CloudSyncOutlined');
export const ClusterOutlined: any = makeIcon('ClusterOutlined');
export const CodeOutlined: any = makeIcon('CodeOutlined');
export const CoffeeOutlined: any = makeIcon('CoffeeOutlined');
export const ContactsOutlined: any = makeIcon('ContactsOutlined');
export const ContainerOutlined: any = makeIcon('ContainerOutlined');
export const CopyOutlined: any = makeIcon('CopyOutlined');
export const CrownOutlined: any = makeIcon('CrownOutlined');
export const CustomerServiceOutlined: any = makeIcon('CustomerServiceOutlined');
export const DatabaseOutlined: any = makeIcon('DatabaseOutlined');
export const DeleteOutlined: any = makeIcon('DeleteOutlined');
export const DesktopOutlined: any = makeIcon('DesktopOutlined');
export const DisconnectOutlined: any = makeIcon('DisconnectOutlined');
export const DollarOutlined: any = makeIcon('DollarOutlined');
export const DoubleRightOutlined: any = makeIcon('DoubleRightOutlined');
export const DownOutlined: any = makeIcon('DownOutlined');
export const DownloadOutlined: any = makeIcon('DownloadOutlined');
export const EditOutlined: any = makeIcon('EditOutlined');
export const EllipsisOutlined: any = makeIcon('EllipsisOutlined');
export const ExclamationCircleFilled: any = makeIcon('ExclamationCircleFilled');
export const ExclamationCircleOutlined: any = makeIcon('ExclamationCircleOutlined');
export const ExperimentOutlined: any = makeIcon('ExperimentOutlined');
export const ExportOutlined: any = makeIcon('ExportOutlined');
export const EyeInvisibleOutlined: any = makeIcon('EyeInvisibleOutlined');
export const EyeOutlined: any = makeIcon('EyeOutlined');
export const FieldTimeOutlined: any = makeIcon('FieldTimeOutlined');
export const FileAddOutlined: any = makeIcon('FileAddOutlined');
export const FileImageOutlined: any = makeIcon('FileImageOutlined');
export const FileSearchOutlined: any = makeIcon('FileSearchOutlined');
export const FileTextOutlined: any = makeIcon('FileTextOutlined');
export const FilterOutlined: any = makeIcon('FilterOutlined');
export const FireOutlined: any = makeIcon('FireOutlined');
export const FlagOutlined: any = makeIcon('FlagOutlined');
export const GiftOutlined: any = makeIcon('GiftOutlined');
export const GithubOutlined: any = makeIcon('GithubOutlined');
export const GlobalOutlined: any = makeIcon('GlobalOutlined');
export const HeartOutlined: any = makeIcon('HeartOutlined');
export const HighlightOutlined: any = makeIcon('HighlightOutlined');
export const HistoryOutlined: any = makeIcon('HistoryOutlined');
export const HolderOutlined: any = makeIcon('HolderOutlined');
export const HomeOutlined: any = makeIcon('HomeOutlined');
export const IdcardFilled: any = makeIcon('IdcardFilled');
export const IdcardOutlined: any = makeIcon('IdcardOutlined');
export const ImportOutlined: any = makeIcon('ImportOutlined');
export const InboxOutlined: any = makeIcon('InboxOutlined');
export const InfoCircleOutlined: any = makeIcon('InfoCircleOutlined');
export const IssuesCloseOutlined: any = makeIcon('IssuesCloseOutlined');
export const ItalicOutlined: any = makeIcon('ItalicOutlined');
export const KeyOutlined: any = makeIcon('KeyOutlined');
export const LeftOutlined: any = makeIcon('LeftOutlined');
export const LikeOutlined: any = makeIcon('LikeOutlined');
export const LineChartOutlined: any = makeIcon('LineChartOutlined');
export const LinkOutlined: any = makeIcon('LinkOutlined');
export const LoadingOutlined: any = makeIcon('LoadingOutlined');
export const LockOutlined: any = makeIcon('LockOutlined');
export const LogoutOutlined: any = makeIcon('LogoutOutlined');
export const MailOutlined: any = makeIcon('MailOutlined');
export const MenuOutlined: any = makeIcon('MenuOutlined');
export const MessageFilled: any = makeIcon('MessageFilled');
export const MessageOutlined: any = makeIcon('MessageOutlined');
export const MinusCircleFilled: any = makeIcon('MinusCircleFilled');
export const MinusCircleOutlined: any = makeIcon('MinusCircleOutlined');
export const MinusOutlined: any = makeIcon('MinusOutlined');
export const MoreOutlined: any = makeIcon('MoreOutlined');
export const NotificationOutlined: any = makeIcon('NotificationOutlined');
export const NumberOutlined: any = makeIcon('NumberOutlined');
export const OrderedListOutlined: any = makeIcon('OrderedListOutlined');
export const PaperClipOutlined: any = makeIcon('PaperClipOutlined');
export const PartitionOutlined: any = makeIcon('PartitionOutlined');
export const PauseCircleOutlined: any = makeIcon('PauseCircleOutlined');
export const PictureOutlined: any = makeIcon('PictureOutlined');
export const PlayCircleOutlined: any = makeIcon('PlayCircleOutlined');
export const PlusOutlined: any = makeIcon('PlusOutlined');
export const ProfileOutlined: any = makeIcon('ProfileOutlined');
export const QqOutlined: any = makeIcon('QqOutlined');
export const QuestionCircleOutlined: any = makeIcon('QuestionCircleOutlined');
export const ReloadOutlined: any = makeIcon('ReloadOutlined');
export const RightOutlined: any = makeIcon('RightOutlined');
export const RobotOutlined: any = makeIcon('RobotOutlined');
export const RocketOutlined: any = makeIcon('RocketOutlined');
export const SafetyCertificateOutlined: any = makeIcon('SafetyCertificateOutlined');
export const SaveOutlined: any = makeIcon('SaveOutlined');
export const ScissorOutlined: any = makeIcon('ScissorOutlined');
export const SearchOutlined: any = makeIcon('SearchOutlined');
export const SecurityScanOutlined: any = makeIcon('SecurityScanOutlined');
export const SendOutlined: any = makeIcon('SendOutlined');
export const SettingOutlined: any = makeIcon('SettingOutlined');
export const ShareAltOutlined: any = makeIcon('ShareAltOutlined');
export const ShopOutlined: any = makeIcon('ShopOutlined');
export const ShoppingCartOutlined: any = makeIcon('ShoppingCartOutlined');
export const ShoppingOutlined: any = makeIcon('ShoppingOutlined');
export const SlidersOutlined: any = makeIcon('SlidersOutlined');
export const SmileOutlined: any = makeIcon('SmileOutlined');
export const SolutionOutlined: any = makeIcon('SolutionOutlined');
export const SortAscendingOutlined: any = makeIcon('SortAscendingOutlined');
export const SoundFilled: any = makeIcon('SoundFilled');
export const SoundOutlined: any = makeIcon('SoundOutlined');
export const StarOutlined: any = makeIcon('StarOutlined');
export const StopOutlined: any = makeIcon('StopOutlined');
export const StrikethroughOutlined: any = makeIcon('StrikethroughOutlined');
export const SunOutlined: any = makeIcon('SunOutlined');
export const SwapOutlined: any = makeIcon('SwapOutlined');
export const TableOutlined: any = makeIcon('TableOutlined');
export const TagsOutlined: any = makeIcon('TagsOutlined');
export const TagOutlined: any = makeIcon('TagOutlined');
export const TeamOutlined: any = makeIcon('TeamOutlined');
export const ThunderboltOutlined: any = makeIcon('ThunderboltOutlined');
export const ToolOutlined: any = makeIcon('ToolOutlined');
export const TrophyOutlined: any = makeIcon('TrophyOutlined');
export const UndoOutlined: any = makeIcon('UndoOutlined');
export const UnlockOutlined: any = makeIcon('UnlockOutlined');
export const UnorderedListOutlined: any = makeIcon('UnorderedListOutlined');
export const UpCircleFilled: any = makeIcon('UpCircleFilled');
export const UpCircleOutlined: any = makeIcon('UpCircleOutlined');
export const UpOutlined: any = makeIcon('UpOutlined');
export const UploadOutlined: any = makeIcon('UploadOutlined');
export const UsergroupAddOutlined: any = makeIcon('UsergroupAddOutlined');
export const UserOutlined: any = makeIcon('UserOutlined');
export const VerticalAlignBottomOutlined: any = makeIcon('VerticalAlignBottomOutlined');
export const VerticalAlignTopOutlined: any = makeIcon('VerticalAlignTopOutlined');
export const VideoCameraOutlined: any = makeIcon('VideoCameraOutlined');
export const WalletOutlined: any = makeIcon('WalletOutlined');
export const WarningOutlined: any = makeIcon('WarningOutlined');
export const WechatOutlined: any = makeIcon('WechatOutlined');
