import { createContext, useContext, useEffect, type ReactNode } from 'react';

export type StoryLocale = 'en' | 'zh-CN';

type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer Item)[]
        ? readonly Widen<Item>[]
        : T extends object
          ? { [Key in keyof T]: Widen<T[Key]> }
          : T;

const StoryLocaleContext = createContext<StoryLocale>('zh-CN');

export function getStoryLocale(value: unknown): StoryLocale {
  return value === 'en' ? 'en' : 'zh-CN';
}

export function StoryLocaleProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: StoryLocale;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <StoryLocaleContext.Provider value={locale}>{children}</StoryLocaleContext.Provider>;
}

export function useStoryTranslations<T>(translations: { en: T; 'zh-CN': Widen<T> }): Widen<T> {
  return translations[useContext(StoryLocaleContext)] as Widen<T>;
}
