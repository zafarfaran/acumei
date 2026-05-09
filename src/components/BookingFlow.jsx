import { useState } from 'react';

const BUSINESS_TYPES = [
  'Trades & home services',
  'Salons, spas & clinics',
  'Hospitality & food',
  'Solicitors & accountants',
  'Independent retail / e-commerce',
  'Mid-market firm (50+)',
  'Other',
];

const SIZES = ['Just me', '2–10', '11–50', '51–200', '200+'];

const DEFAULT_PAINS = [
  'Manual scheduling',
  'Slow quoting/estimates',
  'Missed follow-ups',
  'Inventory & ordering',
  'Customer support load',
  'Reporting & data wrangling',
  'Lead routing',
  'Onboarding & docs',
];

const SLOTS = ['Tue 10:00', 'Tue 14:30', 'Wed 09:00', 'Wed 15:30', 'Thu 11:30', 'Fri 16:00'];

const STEPS = [
  { label: 'Your business', n: '01' },
  { label: 'Pain points', n: '02' },
  { label: 'Contact', n: '03' },
  { label: 'Pick a time', n: '04' },
];

export default function BookingFlow({ accent, muted, surfaceBg, borderColor, textColor }) {
  const [step, setStep] = useState(0);
  const [customType, setCustomType] = useState('');
  const [customPain, setCustomPain] = useState('');
  const [extraPains, setExtraPains] = useState([]);
  const [data, setData] = useState({
    type: '',
    size: '',
    pain: [],
    name: '',
    business: '',
    email: '',
    time: '',
    notes: '',
  });

  const update = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const togglePain = (p) =>
    setData((d) => ({
      ...d,
      pain: d.pain.includes(p) ? d.pain.filter((x) => x !== p) : [...d.pain, p],
    }));

  const addCustomPain = () => {
    const trimmed = customPain.trim();
    if (trimmed && !data.pain.includes(trimmed) && !DEFAULT_PAINS.includes(trimmed)) {
      setExtraPains((prev) => [...prev, trimmed]);
      setData((d) => ({ ...d, pain: [...d.pain, trimmed] }));
      setCustomPain('');
    }
  };

  const canProceed = () => {
    if (step === 0) {
      const typeValid = data.type === 'Other' ? customType.trim().length > 0 : !!data.type;
      return typeValid && data.size;
    }
    if (step === 1) return data.pain.length > 0;
    if (step === 2) return data.name && data.business && data.email.includes('@');
    if (step === 3) return data.time;
    return true;
  };

  const chipStyle = (active) => ({
    padding: '8px 14px',
    border: `1px solid ${active ? accent : borderColor}`,
    background: active ? accent : 'transparent',
    color: active ? '#000' : textColor,
    fontSize: 13,
    cursor: 'pointer',
    borderRadius: 2,
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  });

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${borderColor}`,
    padding: '12px 0',
    color: textColor,
    fontSize: 16,
    outline: 'none',
    fontFamily: 'inherit',
  };

  if (step === 4) {
    return (
      <div style={{
        background: surfaceBg,
        padding: 48,
        border: `1px solid ${borderColor}`,
        textAlign: 'center',
        minHeight: 460,
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', color: accent, marginBottom: 24 }}>
          CONFIRMED
        </div>
        <div style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 12 }}>
          We're on for {data.time.toLowerCase()}.
        </div>
        <div style={{
          color: muted,
          fontSize: 15,
          maxWidth: 420,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          A calendar invite is on the way to {data.email}. I'll review {data.business} beforehand and
          come ready with a working hypothesis.
        </div>
        <button
          onClick={() => {
            setStep(0);
            setCustomType('');
            setCustomPain('');
            setExtraPains([]);
            setData({ type: '', size: '', pain: [], name: '', business: '', email: '', time: '', notes: '' });
          }}
          style={{
            marginTop: 32,
            padding: '10px 20px',
            border: `1px solid ${borderColor}`,
            background: 'transparent',
            color: textColor,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Book another
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: surfaceBg,
      border: `1px solid ${borderColor}`,
      padding: 36,
      minHeight: 460,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Step rail */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: `1px solid ${borderColor}` }}>
        {STEPS.map((s, i) => (
          <div
            key={i}
            onClick={() => i < step && setStep(i)}
            style={{
              flex: 1,
              padding: '0 0 12px 0',
              cursor: i < step ? 'pointer' : 'default',
              borderBottom: `2px solid ${i === step ? accent : 'transparent'}`,
              marginBottom: -1,
              opacity: i <= step ? 1 : 0.4,
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 10, color: muted, letterSpacing: '0.15em' }}>{s.n}</div>
            <div style={{ fontSize: 13, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ flex: 1 }}>
        {step === 0 && (
          <div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 14, letterSpacing: '0.05em' }}>
              What kind of business?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: data.type === 'Other' ? 12 : 28 }}>
              {BUSINESS_TYPES.map((t) => (
                <button key={t} onClick={() => update('type', t)} style={chipStyle(data.type === t)}>
                  {t}
                </button>
              ))}
            </div>
            {data.type === 'Other' && (
              <input
                style={{ ...inputStyle, marginBottom: 28 }}
                placeholder="Tell us what you do"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                autoFocus
              />
            )}
            <div style={{ fontSize: 13, color: muted, marginBottom: 14, letterSpacing: '0.05em' }}>
              Team size
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SIZES.map((s) => (
                <button key={s} onClick={() => update('size', s)} style={chipStyle(data.size === s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 14, letterSpacing: '0.05em' }}>
              What's eating your time? Pick all that apply.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[...DEFAULT_PAINS, ...extraPains].map((p) => (
                <button key={p} onClick={() => togglePain(p)} style={chipStyle(data.pain.includes(p))}>
                  {data.pain.includes(p) ? '✓ ' : '+ '}
                  {p}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Something else? Type it here"
                value={customPain}
                onChange={(e) => setCustomPain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomPain()}
              />
              <button
                onClick={addCustomPain}
                disabled={!customPain.trim()}
                style={{
                  padding: '8px 16px',
                  background: customPain.trim() ? accent : 'transparent',
                  color: customPain.trim() ? '#000' : muted,
                  border: `1px solid ${customPain.trim() ? accent : borderColor}`,
                  borderRadius: 2,
                  fontSize: 13,
                  cursor: customPain.trim() ? 'pointer' : 'default',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                + Add
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <input
              style={inputStyle}
              placeholder="Your name"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
            />
            <div style={{ height: 18 }} />
            <input
              style={inputStyle}
              placeholder="Business name"
              value={data.business}
              onChange={(e) => update('business', e.target.value)}
            />
            <div style={{ height: 18 }} />
            <input
              style={inputStyle}
              placeholder="Email"
              type="email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
            />
            <div style={{ height: 18 }} />
            <textarea
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: 48,
                borderBottom: `1px solid ${borderColor}`,
              }}
              placeholder="Anything else we should know? (optional)"
              value={data.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 14, letterSpacing: '0.05em' }}>
              30 minutes. No prep required.
            </div>
            <div className="booking-slots" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SLOTS.map((s) => (
                <button
                  key={s}
                  onClick={() => update('time', s)}
                  style={{ ...chipStyle(data.time === s), padding: '14px 10px', textAlign: 'center' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
      }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            background: 'none',
            border: 'none',
            color: muted,
            fontSize: 13,
            cursor: step === 0 ? 'default' : 'pointer',
            opacity: step === 0 ? 0.3 : 1,
            fontFamily: 'inherit',
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => canProceed() && setStep((s) => s + 1)}
          disabled={!canProceed()}
          style={{
            padding: '12px 22px',
            background: canProceed() ? accent : borderColor,
            color: canProceed() ? '#000' : muted,
            border: 'none',
            fontSize: 13,
            cursor: canProceed() ? 'pointer' : 'default',
            letterSpacing: '0.05em',
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        >
          {step === 3 ? 'Confirm' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
