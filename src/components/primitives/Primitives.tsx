import { createPortal } from 'react-dom';
import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
export interface BoxProps extends HTMLAttributes<HTMLElement> { as?: ElementType; }
export const Surface = forwardRef<HTMLElement, BoxProps>(function Surface({ as: Comp='div', className, ...props }, ref) { return <Comp ref={ref} className={['ec-surface',className].filter(Boolean).join(' ')} {...props}/>; });
export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Container({className,...props},ref){return <div ref={ref} className={['ec-container',className].filter(Boolean).join(' ')} {...props}/>;});
export interface StackProps extends HTMLAttributes<HTMLDivElement> { direction?: 'row'|'column'; gap?: number|string; align?: CSSProperties['alignItems']; justify?: CSSProperties['justifyContent']; wrap?: boolean; }
export const Flex = forwardRef<HTMLDivElement, StackProps>(function Flex({direction='row',gap='var(--ec-space-3)',align,justify,wrap,className,style,...props},ref){return <div ref={ref} className={['ec-flex',className].filter(Boolean).join(' ')} style={{...style,flexDirection:direction,gap,alignItems:align,justifyContent:justify,flexWrap:wrap?'wrap':undefined}} {...props}/>;});
export const Space = Flex;
export function Divider({className,...props}:HTMLAttributes<HTMLHRElement>){return <hr className={['ec-divider',className].filter(Boolean).join(' ')} {...props}/>;}
export function Portal({children,container}:{children:ReactNode;container?:Element|null}){if(typeof document==='undefined')return null;return createPortal(children,container??document.body);}