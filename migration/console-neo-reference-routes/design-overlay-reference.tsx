import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

const noop = () => {}
const frame = "flex min-h-svh items-start justify-center bg-background p-16 text-foreground"

function MenuScene() {
  return <div className={frame}><DropdownMenu open onOpenChange={noop}><DropdownMenuTrigger asChild><Button variant="outline">Open actions</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>Workspace actions</DropdownMenuLabel><DropdownMenuItem>Edit<DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut></DropdownMenuItem><DropdownMenuCheckboxItem checked>Notifications</DropdownMenuCheckboxItem><DropdownMenuSeparator/><DropdownMenuItem variant="destructive">Delete workspace</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
}
function DialogScene() {
  return <div className="min-h-svh bg-background text-foreground"><Dialog open onOpenChange={noop}><DialogContent instant><DialogHeader><DialogTitle>Publish changes</DialogTitle><DialogDescription>This action updates the current workspace.</DialogDescription></DialogHeader><p>Please confirm that the changes have passed review.</p><DialogFooter><Button variant="ghost">Cancel</Button><Button>Confirm publish</Button></DialogFooter></DialogContent></Dialog></div>
}
function SheetScene() {
  return <div className="min-h-svh bg-background text-foreground"><Sheet open onOpenChange={noop}><SheetContent side="right" instant><SheetHeader><SheetTitle>Filter options</SheetTitle><SheetDescription>Refine the visible records.</SheetDescription></SheetHeader><div className="p-4 text-sm">Domain-neutral filter content.</div><SheetFooter><Button>Apply filters</Button></SheetFooter></SheetContent></Sheet></div>
}
function PopoverScene() {
  return <div className={frame}><Popover open onOpenChange={noop}><PopoverTrigger asChild><Button variant="outline">Open filter</Button></PopoverTrigger><PopoverContent align="start"><h3 className="text-sm font-semibold">Filter options</h3><p className="mt-2 text-[0.8125rem] text-muted-foreground">Choose fields for the current view.</p></PopoverContent></Popover></div>
}
function TooltipScene() {
  return <div className={frame}><TooltipProvider><Tooltip open><TooltipTrigger asChild><Button variant="outline">Refresh data</Button></TooltipTrigger><TooltipContent>Fetch the latest records</TooltipContent></Tooltip></TooltipProvider></div>
}
function ScrollScene() {
  return <div className={frame}><ScrollArea className="h-40 w-80 rounded-lg border border-border"><div className="grid gap-3 p-4">{Array.from({length:12},(_,index)=><div key={index} className="text-sm">Activity record {index+1}</div>)}</div></ScrollArea></div>
}
function ToastScene() {
  return <div className="min-h-svh bg-background p-16 text-foreground"><Button onClick={()=>toast.success("Changes saved",{id:"visual-toast",description:"The workspace is up to date.",duration:Infinity})}>Show toast</Button></div>
}

export default function DesignOverlayReference() {
  const scene = typeof window === "undefined" ? "menu" : new URLSearchParams(window.location.search).get("scene")
  if (scene === "dialog") return <DialogScene />
  if (scene === "sheet") return <SheetScene />
  if (scene === "popover") return <PopoverScene />
  if (scene === "tooltip") return <TooltipScene />
  if (scene === "scroll") return <ScrollScene />
  if (scene === "toast") return <ToastScene />
  return <MenuScene />
}


