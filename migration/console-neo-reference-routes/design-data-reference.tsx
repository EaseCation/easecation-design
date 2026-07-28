import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@workspace/ui/components/button"
import { QueryDataTable } from "@workspace/ui/components/patterns/query-data-table"
import { ResponsiveDialog } from "@workspace/ui/components/patterns/responsive-dialog"

const helper=createColumnHelper<{id:string;name:string;status:string}>()
const columns=[helper.accessor("name",{header:"Workspace"}),helper.accessor("status",{header:"Status"})]
const data=[{id:"1",name:"North region",status:"Active"},{id:"2",name:"Content operations",status:"Paused"}]
export default function DesignDataReference(){const[open,setOpen]=useState(false);return <main className="min-h-svh bg-background p-8 text-foreground"><div className="grid gap-4"><Button onClick={()=>setOpen(true)}>Open responsive overlay</Button><QueryDataTable data={data} columns={columns} getRowId={row=>row.id} mobileCard={row=><div key={row.id} style={{padding:"1rem",border:"1px solid var(--border)",borderRadius:"var(--radius-xl)"}}>{row.name} · {row.status}</div>}/><ResponsiveDialog open={open} onOpenChange={setOpen} title="Filter records" description="Desktop dialog and mobile sheet share one API." footer={<Button onClick={()=>setOpen(false)}>Apply</Button>}>Domain-neutral filter content.</ResponsiveDialog></div></main>}
