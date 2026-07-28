import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { DetailWorkbench } from "@workspace/ui/components/layout/detail-workbench"
import { FormWorkbench } from "@workspace/ui/components/layout/form-workbench"
import { SectionCard } from "@workspace/ui/components/patterns/section-card"
import { InlineQueryError } from "@workspace/ui/components/state/inline-query-error"

const frame="min-h-svh bg-background p-4 text-foreground sm:p-8"
function DetailScene(){return <main className={frame}><div className="mx-auto max-w-5xl"><DetailWorkbench sidebar={<SectionCard title="Metadata"><p>Owner: Operations</p></SectionCard>}><SectionCard title="Record details"><p>Domain-neutral record content.</p></SectionCard><SectionCard title="History"><p>Latest activity is available.</p></SectionCard></DetailWorkbench></div></main>}
function FormScene(){return <main className={frame}><div className="mx-auto max-w-5xl"><FormWorkbench aside={<SectionCard title="Guidance"><p>Complete the required fields.</p></SectionCard>} footer={<div className="flex justify-end gap-2"><Button variant="outline">Cancel</Button><Button>Save changes</Button></div>}><SectionCard title="General information"><div className="grid gap-3"><Input defaultValue="Quarterly report"/><Input defaultValue="Operations"/></div></SectionCard></FormWorkbench></div></main>}
function ErrorScene(){return <main className={frame}><div className="mx-auto max-w-3xl"><InlineQueryError title="Unable to load records" description="Check the connection and try again." onRetry={()=>{}}/></div></main>}
export default function DesignWorkbenchReference(){const scene=typeof window==="undefined"?"detail":new URLSearchParams(window.location.search).get("scene");if(scene==="form")return <FormScene/>;if(scene==="error")return <ErrorScene/>;return <DetailScene/>}
