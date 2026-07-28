import { useState } from "react"
import { DateTimePicker } from "@workspace/ui/components/patterns/datetime-picker"
import { FilterPicker } from "@workspace/ui/components/patterns/filter-picker"
import { FilterSelect } from "@workspace/ui/components/patterns/filter-select"

const options=[{value:"active",label:"Active"},{value:"paused",label:"Paused"},{value:"archived",label:"Archived"}]
const frame="flex min-h-svh items-start justify-center bg-background p-16 text-foreground"
function DateTimeScene(){const[value,setValue]=useState("2026-07-28T09:30");return <main className={frame}><DateTimePicker value={value} onChange={setValue}/></main>}
function PickerScene(){const[value,setValue]=useState(["active"]);return <main className={frame}><FilterPicker mode="multiple" value={value} onValueChange={setValue} options={options}/></main>}
function SelectScene(){const[value,setValue]=useState("active");return <main className={frame}><FilterSelect value={value} onValueChange={setValue} options={options}/></main>}
export default function DesignFilterReference(){const scene=typeof window==="undefined"?"datetime":new URLSearchParams(window.location.search).get("scene");if(scene==="picker")return <PickerScene/>;if(scene==="select")return <SelectScene/>;return <DateTimeScene/>}
