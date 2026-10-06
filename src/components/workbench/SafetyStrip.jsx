import { partByCode } from '../../lib/workbench/parts';
import IsoCube from './IsoCube';
import useDragPart from './useDragPart';

// What each guardrail does, in a few words a hurried visitor will read.
const SAFETY = {
  'G-01': 'Asks instead of guessing',
  'G-02': 'Hides names and emails',
  'G-03': 'Asks before big spends',
  'G-04': 'A person checks first',
  'G-05': 'Keeps a record',
};

// Guardrails, docked right under the drawing so you can drag them straight on.
export default function SafetyStrip({ build, selected, onSelect, onDrop, onToggle }) {
  const { dragProps, clicked, ghost } = useDragPart({ onSelect, onDrop });
  return (
    <div className="wb-strip" aria-label="Safety parts">
      <div className="wb-strip-k mono">Drag safety parts onto the machine<span> · or tap to switch them on and off</span></div>
      <div className="wb-strip-row">
        {Object.entries(SAFETY).map(([code, line], i) => {
          const on = build.branches.includes(code);
          return (
            <button
              key={code}
              type="button"
              aria-pressed={on}
              className={`wb-guard${on ? ' is-on' : ''}${selected === code ? ' is-sel' : ''}`}
              style={{ '--i': i }}
              {...dragProps(code)}
              onClick={clicked(() => onToggle(code))}
            >
              <IsoCube amber={on} />
              <span className="t"><b>{partByCode(code).name}</b><span>{line}</span></span>
              <span className="mono s">{on ? 'On ✓' : 'Drag'}</span>
            </button>
          );
        })}
      </div>
      {ghost}
    </div>
  );
}
