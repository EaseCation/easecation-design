import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

import { MenuIcon } from "lucide-react"

import { EASECATION_SHELL_DEFAULTS as SHELL_DEFAULTS } from "../../lib/config"
import { Button } from "../button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../sheet"
import { cn } from "../../lib/utils"

export interface AppShellProps {
  brand: ReactNode
  headerTitle?: ReactNode
  headerActions?: ReactNode
  sidebar: ReactNode
  mobileSidebar?: ReactNode
  bottomBar?: ReactNode
  children: ReactNode
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function AppShell({
  brand,
  headerTitle,
  headerActions,
  sidebar,
  mobileSidebar,
  bottomBar,
  children,
  collapsed = false,
}: AppShellProps) {
  const drawerSidebar = mobileSidebar ?? sidebar
  const showDesktopHeader = Boolean(headerTitle || headerActions)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileSidebarTailPhase, setMobileSidebarTailPhase] = useState<
    "to-collapsed" | "to-expanded" | null
  >(null)
  const mobileSidebarTailTimerRef = useRef<number | null>(null)

  const handleMobileSidebarOpenChange = useCallback((open: boolean) => {
    setMobileSidebarOpen(open)
    setMobileSidebarTailPhase(open ? "to-expanded" : "to-collapsed")

    if (mobileSidebarTailTimerRef.current !== null) {
      window.clearTimeout(mobileSidebarTailTimerRef.current)
    }
    mobileSidebarTailTimerRef.current = window.setTimeout(() => {
      setMobileSidebarTailPhase(null)
      mobileSidebarTailTimerRef.current = null
    }, 760)
  }, [])

  useEffect(() => {
    return () => {
      if (mobileSidebarTailTimerRef.current !== null) {
        window.clearTimeout(mobileSidebarTailTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="flex min-h-svh bg-surface">
      <aside
        className="sticky top-0 hidden h-svh shrink-0 overflow-hidden border-r border-border/40 bg-panel transition-[width] duration-[var(--motion-base)] ease-[var(--ease-standard)] motion-reduce:transition-none lg:flex lg:flex-col"
        style={{
          width: collapsed
            ? SHELL_DEFAULTS.collapsedSidebarWidth
            : SHELL_DEFAULTS.desktopSidebarWidth,
        }}
        data-collapsed={collapsed ? "" : undefined}
        data-testid="app-sidebar"
      >
        {sidebar}
      </aside>

      <div
        className={cn(
          "flex min-h-svh min-w-0 flex-1 flex-col transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          mobileSidebarOpen &&
            "motion-safe-transform translate-y-3 scale-[0.980] lg:translate-y-0 lg:scale-100"
        )}
      >
        <header
          data-native-safe-top
          className={cn(
            "page-gutter sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl",
            "max-lg:px-4 max-lg:py-0 lg:py-3",
            !showDesktopHeader && "lg:hidden"
          )}
        >
          <div className="flex h-16 w-full items-center gap-2.5 lg:hidden">
            <Sheet
              open={mobileSidebarOpen}
              onOpenChange={handleMobileSidebarOpenChange}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 shrink-0 self-center"
                >
                  <MenuIcon className="size-4" />
                  <span className="sr-only">打开导航</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="h-full w-full max-w-none gap-0 p-0 sm:max-w-sm"
              >
                <div
                  className={cn(
                    "h-full min-h-0",
                    mobileSidebarTailPhase === "to-expanded" &&
                      "sidebar-tail-phase-in",
                    mobileSidebarTailPhase === "to-collapsed" &&
                      "sidebar-tail-phase-out"
                  )}
                  style={{ "--max-row-index": 26 } as CSSProperties}
                  data-testid="mobile-nav"
                  onClick={(event) => {
                    const target = event.target as HTMLElement | null
                    if (!target) return
                    if (target.closest("a[href]")) {
                      handleMobileSidebarOpenChange(false)
                    }
                  }}
                >
                  {drawerSidebar}
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex min-h-0 min-w-0 flex-1 items-center self-stretch">
              {brand}
            </div>
          </div>

          {headerTitle || headerActions ? (
            <div className="mt-3 flex flex-col gap-3 lg:mt-0 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">{headerTitle}</div>
              {headerActions ? (
                <div className="flex flex-wrap items-center gap-2">
                  {headerActions}
                </div>
              ) : null}
            </div>
          ) : null}
        </header>

        <main className="min-w-0 flex-1 pb-24 lg:pb-6">{children}</main>

        {bottomBar ? (
          <div
            data-native-safe-bottom
            className="fixed inset-x-0 bottom-0 z-30 border-t border-border/30 bg-background/85 px-3 py-2 backdrop-blur-xl lg:hidden"
          >
            {bottomBar}
          </div>
        ) : null}
      </div>
    </div>
  )
}
