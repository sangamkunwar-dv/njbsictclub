// Compatibility shim mapping Next.js navigation hooks to wouter equivalents
import { useLocation } from 'wouter';

export function useRouter() {
  const [, setLocation] = useLocation();
  return {
    push: (path: string) => setLocation(path),
    replace: (path: string) => setLocation(path, { replace: true }),
    refresh: () => window.location.reload(),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    prefetch: (_path: string) => {},
  };
}

export function usePathname() {
  const [location] = useLocation();
  return location;
}

export function useSearchParams() {
  // Track the current search string so component re-renders if it changes
  const [location] = useLocation();
  // location only contains pathname; query string is on window.location
  void location;
  const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
  );
  return {
    get: (key: string) => params.get(key),
    getAll: (key: string) => params.getAll(key),
    has: (key: string) => params.has(key),
    toString: () => params.toString(),
  };
}

export function useParams<T = Record<string, string>>(): T {
  // Wouter's params come through Route render-prop. As a fallback, parse from URL
  return {} as T;
}

export function redirect(path: string): never {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
  throw new Error(`Redirect to ${path}`);
}
