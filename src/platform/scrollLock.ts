let locks = 0;
let previousOverflow = '';
export function lockBodyScroll() { if(typeof document==='undefined') return () => {}; locks += 1; if(locks===1){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';} return () => {locks=Math.max(0,locks-1);if(locks===0)document.body.style.overflow=previousOverflow;}; }