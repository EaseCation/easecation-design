export interface OverlayEntry { id: string; close: () => void; }
const stack: OverlayEntry[] = [];
export function registerOverlay(entry: OverlayEntry) { stack.push(entry); return () => { const index=stack.findIndex(item=>item.id===entry.id); if(index>=0) stack.splice(index,1); }; }
export function closeTopOverlay() { const top=stack.at(-1); top?.close(); return Boolean(top); }
export function getOverlayCount() { return stack.length; }