import type { ReactNode } from 'react';
export interface AccessGateProps {
  allowed: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}
export function AccessGate({ allowed, fallback = null, children }: AccessGateProps) {
  return allowed ? <>{children}</> : <>{fallback}</>;
}
/** @deprecated Prefer the domain-neutral AccessGate name. */
export const PermissionGate = AccessGate;
export type PermissionGateProps = AccessGateProps;
