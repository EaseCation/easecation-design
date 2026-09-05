import type * as React from 'react';

export interface PermissionGateProps {
  allowed: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({ allowed, fallback = null, children }: PermissionGateProps) {
  return allowed ? <>{children}</> : <>{fallback}</>;
}
