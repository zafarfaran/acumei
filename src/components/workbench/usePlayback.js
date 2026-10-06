import { useEffect, useState } from 'react';
import { STATIC } from '../../lib/motion';

const STEP_MS = 1500;

/**
 * Reveals a run's events one at a time. `index` is the last revealed event
 * (−1 before a run starts). When the events grow (a pause was answered, or a
 * live run streamed more in) playback carries on from where it was.
 * `follow` is false while a live stream is still arriving, so playback waits at
 * the end instead of declaring the run done.
 */
export default function usePlayback(events, runId, follow = true) {
  const [state, setState] = useState({ runId: null, index: -1 });
  const index = state.runId === runId ? state.index : -1;

  useEffect(() => {
    if (runId == null || !events.length) return undefined;
    if (STATIC) { setState({ runId, index: events.length - 1 }); return undefined; }
    if (index >= events.length - 1) return undefined;
    const next = events[index + 1];
    const delay = index < 0 ? 250 : next.kind === 'answer' ? 700 : STEP_MS + (next.secs || 0);
    const id = setTimeout(() => setState({ runId, index: index + 1 }), delay);
    return () => clearTimeout(id);
  }, [events, runId, index]);

  const current = index >= 0 ? events[index] : null;
  const atEnd = index >= 0 && index === events.length - 1;
  return {
    index,
    current,
    revealed: index >= 0 ? events.slice(0, index + 1) : [],
    playing: runId != null && (!atEnd || !follow),
    waiting: atEnd && current?.kind === 'pause',
    done: atEnd && follow && (current?.kind === 'answer' || current?.kind === 'error'),
  };
}
