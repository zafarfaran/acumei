import { partByCode } from '../../lib/workbench/parts';

// What happened, in one line, with the one button that fixes it.
export default function ResultBanner({ verdict, fix, onFix, onDetails }) {
  if (!verdict) return null;
  const icon = verdict.tone === 'bad' ? '✕' : verdict.tone === 'wait' ? '❚❚' : '✓';
  return (
    <div className={`wb-result is-${verdict.tone}`} role="status">
      <span className="wb-result-i mono" aria-hidden="true">{icon}</span>
      <div className="wb-result-t">
        <strong>{verdict.title}</strong>
        {verdict.detail && <span>{verdict.detail}</span>}
      </div>
      <div className="wb-result-a">
        {fix && verdict.tone === 'bad' && (
          <button type="button" className="btn wb-fix" onClick={onFix}>
            Fix it: {fix.label} <span className="mono">{partByCode(fix.code).code}</span>
          </button>
        )}
        <button type="button" className="lnk" onClick={onDetails}>See every step</button>
      </div>
    </div>
  );
}
