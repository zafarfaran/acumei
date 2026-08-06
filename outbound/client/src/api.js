async function request(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  put: (url, body) => request('PUT', url, body),
  patch: (url, body) => request('PATCH', url, body),
  del: (url) => request('DELETE', url),
};

export const STAGES = ['cold', 'contacted', 'replied', 'warm', 'discovery', 'proposal', 'won', 'lost'];

export const STAGE_LABELS = {
  cold: 'Cold',
  contacted: 'Contacted',
  replied: 'Replied',
  warm: 'Warm',
  discovery: 'Discovery booked',
  proposal: 'Proposal sent',
  won: 'Won',
  lost: 'Lost',
};

export function fmtDate(s) {
  if (!s) return '—';
  const d = new Date(s.includes('T') ? s : s.replace(' ', 'T') + 'Z');
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Minimal CSV parser with quoted-field support.
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const aliases = {
    name: 'first_name', firstname: 'first_name', first: 'first_name',
    lastname: 'last_name', surname: 'last_name', last: 'last_name',
    company_name: 'company', business: 'company', organisation: 'company', organization: 'company',
    sector: 'industry', town: 'city', location: 'city',
    email_address: 'email', phone_number: 'phone', mobile: 'phone', tel: 'phone',
    linkedin: 'linkedin_url', linkedin_profile: 'linkedin_url',
    pain: 'pain_point', note: 'notes',
  };
  const keys = headers.map((h) => aliases[h] || h);
  return rows.slice(1).map((r) => {
    const obj = {};
    keys.forEach((k, i) => { obj[k] = (r[i] ?? '').trim(); });
    return obj;
  });
}
