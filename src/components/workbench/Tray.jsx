import { SLOTS, partsForSlot } from '../../lib/workbench/parts';
import { hasPart } from '../../lib/workbench/build';
import useDragPart from './useDragPart';

/**
 * Swap the main parts: drag one onto its module on the machine, or tap it and
 * then tap the slot. Grey parts are shortcuts that cause trouble.
 */
export default function Tray({ build, selected, onSelect, onDrop }) {
  const { dragProps, clicked, ghost } = useDragPart({ onSelect, onDrop });
  return (
    <div className="wb-tray" aria-label="Swap parts">
      <div className="wb-tray-hd mono"><span>Swap parts · drag onto the machine. Grey ones are shortcuts that cause trouble</span></div>
      <div className="wb-tray-groups">
        {SLOTS.filter((s) => s.kind === 'module').map((s) => (
          <div key={s.code} className="wb-group">
            <div className="wb-group-k mono"><b>{s.code}</b> {s.name}</div>
            <div className="wb-chips">
              {partsForSlot(s.code).map((p) => {
                const on = hasPart(build, p.code);
                return (
                  <button
                    key={p.code}
                    type="button"
                    className={`wb-chip${on ? ' is-fitted' : ''}${selected === p.code ? ' is-sel' : ''}${p.shortcut ? ' is-short' : ''}`}
                    aria-pressed={selected === p.code}
                    aria-description={p.blurb}
                    {...dragProps(p.code)}
                    onClick={clicked(() => onSelect(selected === p.code ? null : p.code))}
                  >
                    <i className="wb-cube" aria-hidden="true" />
                    <span className="mono c">{p.code}</span>
                    <span className="n">{p.name}</span>
                    {on && <span className="mono f">fitted</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {ghost}
    </div>
  );
}
