// SPYDERS CLOTHER — API helper
window.API = {
  base: '/api',
  async get(p) {
    const r = await fetch(this.base + p, { credentials: 'include' });
    if (!r.ok) throw new Error((await r.json().catch(()=>({}))).error || 'Request failed');
    return r.json();
  },
  async post(p, body) {
    const r = await fetch(this.base + p, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify(body)
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Request failed');
    return d;
  },
  async put(p, body) {
    const r = await fetch(this.base + p, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify(body)
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Request failed');
    return d;
  },
  async del(p) {
    const r = await fetch(this.base + p, { method: 'DELETE', credentials: 'include' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Request failed');
    return d;
  }
};
