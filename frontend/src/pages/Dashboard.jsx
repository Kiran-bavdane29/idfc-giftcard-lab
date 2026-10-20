import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import GiftCardVisual from '../components/GiftCardVisual';

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const [cards, setCards] = useState([]);
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [redeemCode, setRedeemCode] = useState('');
  const [notice, setNotice] = useState('');

  const load = () => api.get('/giftcards').then(({ data }) => setCards(data.cards));
  useEffect(() => {
    load();
  }, []);

  const search = async (e) => {
    e.preventDefault();
    const { data } = await api.get('/giftcards/search', { params: { q } });
    setResults(data.results);
  };

  const redeem = async (e) => {
    e.preventDefault();
    setNotice('');
    try {
      const { data } = await api.post('/giftcards/redeem', { code: redeemCode });
      setNotice(`✓ ₹${data.credited} credited — new balance ₹${data.new_balance}`);
      setRedeemCode('');
      refresh();
      load();
    } catch (err) {
      setNotice(err.response?.data?.error || 'redeem failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* greeting */}
      <div>
        <h1 className="text-2xl font-extrabold">Good day, {user.username}</h1>
        <p className="text-sm text-gray-500">Here's your account and gift cards at a glance.</p>
      </div>

      {/* account hero — debit-card style */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f1f1f] via-[#2b2b2b] to-[#4d0000] text-white shadow-card p-6 md:col-span-1 aspect-[8/5] flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/[0.06]" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">Savings Account</p>
              <p className="font-mono text-sm text-white/80 mt-1">•••• •••• {String(user.id).padStart(4, '0')}</p>
            </div>
            <div className="w-9 h-7 rounded bg-gradient-to-br from-[#e8c95a] to-[#a8871a]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/50">Available balance</p>
            <p className="text-3xl font-extrabold tracking-tight">₹{Number(user.balance).toLocaleString('en-IN')}</p>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-xs font-semibold tracking-widest text-white/70">IDFC FIRST BANK</p>
            <p className="text-[10px] text-white/40 uppercase">{user.username}</p>
          </div>
        </div>

        {/* rewards points */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="label">FIRST Rewards points</p>
              <p className="text-3xl font-extrabold text-idfc-gold">{user.points.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-400 mt-1">≈ ₹{Math.floor(user.points / 10).toLocaleString('en-IN')} redeemable value</p>
            </div>
            <span className="w-10 h-10 rounded-full bg-idfc-gold/15 text-idfc-gold flex items-center justify-center text-lg">★</span>
          </div>
          <Link to="/store" className="text-sm font-semibold text-idfc-red hover:underline mt-4">
            Spend points in the store →
          </Link>
        </div>

        {/* quick redeem */}
        <form onSubmit={redeem} className="card p-6 flex flex-col">
          <p className="label">Have a voucher code?</p>
          <input
            className="input font-mono text-sm"
            placeholder="e.g. IDFC-AMAZON-DEMO1"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
          />
          <button className="btn-gold mt-3" type="submit">Redeem to balance</button>
          {notice && <p className="mt-3 text-xs text-gray-600">{notice}</p>}
        </form>
      </div>

      {/* search */}
      <form onSubmit={search} className="card p-5">
        <div className="flex items-center gap-3">
          <input
            className="flex-1 outline-none text-sm py-1 bg-transparent"
            placeholder="Search gift cards by brand, name or message…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-primary !py-1.5" type="submit">Search</button>
        </div>
        {results && (
          <ul className="mt-4 divide-y text-sm">
            {results.length === 0 && <li className="py-3 text-gray-400">No matching cards</li>}
            {results.map((r, i) => (
              <li key={i} className="py-2.5 flex justify-between items-center">
                <span>{r.catalog_name || r.brand || `Card #${r.id}`}
                  <span className="text-gray-400 text-xs ml-2">₹{r.value}</span>
                </span>
                <Link className="text-idfc-red font-medium hover:underline" to={`/cards/${r.id}`}>View →</Link>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* my gift cards — realistic card tiles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">My gift cards
            <span className="ml-2 text-sm font-normal text-gray-400">{cards.length} card{cards.length !== 1 && 's'}</span>
          </h2>
          <Link to="/store" className="btn-ghost !py-1.5 text-sm">+ Buy new</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link key={c.id} to={`/cards/${c.id}`} className="group block">
              <GiftCardVisual card={c} className="group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-200" />
            </Link>
          ))}
          {cards.length === 0 && (
            <Link to="/store" className="card border-dashed border-2 aspect-[8/5] flex flex-col items-center justify-center text-gray-400 hover:border-idfc-red hover:text-idfc-red transition-colors">
              <span className="text-3xl">+</span>
              <span className="text-sm font-medium mt-1">Get your first gift card</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
