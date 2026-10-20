import React, { useEffect, useState } from 'react';
import api from '../api';

const TABS = ['Users', 'All Gift Cards', 'Catalog', 'Assign', 'Audit Logs'];

export default function Admin() {
  const [tab, setTab] = useState('Users');
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">Admin Portal</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === t ? 'bg-idfc-red text-white' : 'bg-white border text-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'Users' && <UsersTab />}
      {tab === 'All Gift Cards' && <CardsTab />}
      {tab === 'Catalog' && <CatalogTab />}
      {tab === 'Assign' && <AssignTab />}
      {tab === 'Audit Logs' && <AuditTab />}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const load = () => api.get('/admin/users').then(({ data }) => setUsers(data.users));
  useEffect(() => { load(); }, []);

  const toggleRole = async (u) => {
    await api.patch(`/admin/users/${u.id}/role`, { role: u.role === 'admin' ? 'user' : 'admin' });
    load();
  };

  return (
    <div className="card p-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-400 border-b">
            <th className="py-2">ID</th><th>Username</th><th>Email</th><th>Role</th>
            <th>Balance</th><th>Points</th><th>Password hash</th><th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b last:border-0">
              <td className="py-2">{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-idfc-red text-white' : 'bg-gray-100'}`}>
                  {u.role}
                </span>
              </td>
              <td>₹{Number(u.balance).toLocaleString('en-IN')}</td>
              <td>{u.points}</td>
              <td className="font-mono text-xs text-gray-400 max-w-[180px] truncate">{u.password_hash}</td>
              <td>
                <button className="text-idfc-red underline text-xs" onClick={() => toggleRole(u)}>
                  make {u.role === 'admin' ? 'user' : 'admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardsTab() {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    api.get('/admin/giftcards').then(({ data }) => setCards(data.cards));
  }, []);
  return (
    <div className="card p-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-400 border-b">
            <th className="py-2">ID</th><th>Owner</th><th>Brand</th><th>Code</th><th>PIN</th>
            <th>Value</th><th>Redeemed</th><th>Message</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c) => (
            <tr key={c.id} className="border-b last:border-0">
              <td className="py-2">{c.id}</td>
              <td>{c.owner_username}</td>
              <td>{c.brand}</td>
              <td className="font-mono text-xs">{c.code}</td>
              <td className="font-mono">{c.pin}</td>
              <td>₹{c.value}</td>
              <td>{c.redeemed ? 'yes' : 'no'}</td>
              {/* VULNERABILITY (stored XSS): raw message HTML — admin account takeover vector */}
              <td dangerouslySetInnerHTML={{ __html: c.message || '' }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CatalogTab() {
  const [cards, setCards] = useState([]);
  const empty = { brand: '', name: '', description: '', value: '', price: '', points_price: '', discount_pct: 0 };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const load = () => api.get('/admin/catalog').then(({ data }) => setCards(data.cards));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, value: +form.value, price: +form.price, points_price: +form.points_price, discount_pct: +form.discount_pct };
    if (editing) await api.patch(`/admin/catalog/${editing}`, payload);
    else await api.post('/admin/catalog', payload);
    setForm(empty);
    setEditing(null);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-gray-400 border-b">
              <th className="py-2">ID</th><th>Brand</th><th>Name</th><th>Value</th><th>Price</th><th>Active</th><th></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-2">{c.id}</td>
                <td>{c.brand}</td>
                <td>{c.name}</td>
                <td>₹{c.value}</td>
                <td>₹{c.price}</td>
                <td>{c.active ? 'yes' : 'no'}</td>
                <td className="space-x-2">
                  <button className="text-idfc-red underline text-xs" onClick={() => { setEditing(c.id); setForm(c); }}>edit</button>
                  {c.active === 1 && (
                    <button className="text-gray-500 underline text-xs" onClick={async () => { await api.delete(`/admin/catalog/${c.id}`); load(); }}>
                      delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={submit} className="card p-5 space-y-3">
        <h2 className="font-semibold">{editing ? `Edit catalog card #${editing}` : 'Create catalog card'}</h2>
        {['brand', 'name', 'description', 'value', 'price', 'points_price', 'discount_pct'].map((f) => (
          <input
            key={f}
            className="input"
            placeholder={f.replace('_', ' ')}
            value={form[f] ?? ''}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        ))}
        <div className="flex gap-2">
          <button className="btn-primary" type="submit">{editing ? 'Save' : 'Create'}</button>
          {editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

function AssignTab() {
  const [form, setForm] = useState({ user_ids: '', catalog_id: '', count: 1, value: '', message: '' });
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      user_ids: form.user_ids.split(',').map((s) => Number(s.trim())).filter(Boolean),
      catalog_id: Number(form.catalog_id),
      count: Number(form.count),
      message: form.message,
    };
    if (form.value !== '') payload.value = Number(form.value);
    const { data } = await api.post('/admin/giftcards/assign', payload);
    setResult(data);
  };

  return (
    <form onSubmit={submit} className="card p-5 max-w-lg space-y-3">
      <h2 className="font-semibold">Direct assignment</h2>
      <p className="text-xs text-gray-400">
        Assign gift cards to user IDs. Lab note: count is unbounded and value is fully
        attacker-controlled — try count=1000 or value=-5000.
      </p>
      <input className="input" placeholder="user ids, comma separated (e.g. 2,3)" value={form.user_ids}
        onChange={(e) => setForm({ ...form, user_ids: e.target.value })} />
      <input className="input" placeholder="catalog id" value={form.catalog_id}
        onChange={(e) => setForm({ ...form, catalog_id: e.target.value })} />
      <input className="input" type="number" placeholder="count per user" value={form.count}
        onChange={(e) => setForm({ ...form, count: e.target.value })} />
      <input className="input" placeholder="value override (optional)" value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })} />
      <input className="input" placeholder="message (optional)" value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <button className="btn-primary" type="submit">Assign</button>
      {result && <p className="text-sm text-gray-600">Created {result.created_count} card(s).</p>}
    </form>
  );
}

function AuditTab() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    api.get('/admin/audit').then(({ data }) => setLogs(data.logs));
  }, []);
  return (
    <div className="card p-5 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left uppercase text-gray-400 border-b">
            <th className="py-2">ID</th><th>Time</th><th>User</th><th>Method</th><th>Path</th><th>Status</th><th>Body</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-b last:border-0 align-top">
              <td className="py-2">{l.id}</td>
              <td className="whitespace-nowrap">{l.created_at}</td>
              <td>{l.user_id ?? '-'}</td>
              <td>{l.method}</td>
              <td className="font-mono">{l.path}</td>
              <td>{l.status}</td>
              <td className="font-mono text-gray-400 max-w-[300px] truncate">{l.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
