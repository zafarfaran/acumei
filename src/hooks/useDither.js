import { useRef, useEffect } from 'react';
import { dither } from '../lib/dither';

/**
 * Mounts a dither field on a canvas.
 * Returns [ref, api] — api.current is { setMode, set, setColor, destroy }.
 * Options are read once on mount; change the field afterwards via the api.
 */
export default function useDither(opts) {
  const ref = useRef(null);
  const api = useRef(null);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    if (!ref.current) return;
    api.current = dither(ref.current, optsRef.current);
    return () => {
      api.current?.destroy();
      api.current = null;
    };
  }, []);

  return [ref, api];
}
