import { breakpoints, type Breakpoint } from '../tokens';
import { useMediaQuery } from './useMediaQuery';
export function useBreakpoint(name: Breakpoint) { return useMediaQuery(`(min-width: ${breakpoints[name]}px)`); }