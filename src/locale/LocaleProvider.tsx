import { createContext, useContext, useMemo, type ReactNode } from 'react';

export const localeMessages = {
  en: {
    pagination: 'Pagination',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    pageSize: 'Page size',
    jumpToPage: 'Go to page',
    goToPage: 'Go',
    accessDenied: 'Access denied',
    accessDeniedDescription: 'Your account does not have permission to view this page.',
    notifications: 'Notifications',
    date: 'Date',
    startDate: 'Start date',
    endDate: 'End date',
    all: 'All',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    retry: 'Retry',
    loading: 'Loading',
    noData: 'No data',
    loadFailed: 'Unable to load',
    actionFailed: 'Unable to complete this action. Please try again.',
    apply: 'Apply',
    clear: 'Clear',
    expandText: 'Read more',
    collapseText: 'Read less',
  },
  'zh-CN': {
    pagination: '分页',
    previousPage: '上一页',
    nextPage: '下一页',
    pageSize: '每页条数',
    jumpToPage: '跳至页码',
    goToPage: '跳转',
    accessDenied: '无权访问',
    accessDeniedDescription: '当前账号没有访问此页面的权限。',
    notifications: '通知',
    date: '日期',
    startDate: '开始日期',
    endDate: '结束日期',
    all: '全部',
    close: '关闭',
    cancel: '取消',
    confirm: '确认',
    retry: '重试',
    loading: '正在加载',
    noData: '暂无数据',
    loadFailed: '加载失败',
    actionFailed: '操作未完成，请重试。',
    apply: '应用',
    clear: '清除',
    expandText: '展开全文',
    collapseText: '收起',
  },
} as const;
export type DesignLocale = keyof typeof localeMessages;
export type LocaleMessages = { [K in keyof typeof localeMessages.en]: string };
const LocaleContext = createContext<{ locale: DesignLocale; messages: LocaleMessages }>({
  locale: 'en',
  messages: localeMessages.en,
});
export interface LocaleProviderProps {
  locale?: DesignLocale;
  messages?: Partial<LocaleMessages>;
  children: ReactNode;
}
/** Localizes shared UI labels; application content and date/time policy stay with the host. */
export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  const parent = useContext(LocaleContext);
  const value = useMemo(
    () => ({
      locale: locale ?? parent.locale,
      messages: { ...(locale ? localeMessages[locale] : parent.messages), ...messages },
    }),
    [locale, messages, parent],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function useLocale() {
  return useContext(LocaleContext);
}
