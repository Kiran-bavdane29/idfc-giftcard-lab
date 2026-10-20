import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import GiftCardVisual from '../components/GiftCardVisual';

export default function Store() {
  const { refresh } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [payWith, setPayWith] = useState('balance');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get('/store/cards').then(({ data }) => setCatalog(data.cards));
  }, []);

  const buy = async () => {
    setNotice('');
    try {
      await api.post('/store/purchase', { catalog_id: selected.id, message, payWith });
      setNotice(`✓ Purchased ${selected.name}`);
      setSelected(null);
      setMessage('');
      refresh();
    } catch (err) {
      setNotice(err.response?.data?.error || 'purchase failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Gift Card Store</h1>
          <p className="text-sm text-gray-500 mt-1">
            Instant e-vouchers from your favourite brands — pay with balance or FIRST Rewards points.
          </p>
        </div>
      </div>
      {notice && (
        <p className="mb-5 text-sm font-medium bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5">{notice}</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.map((c) => (
          <div key={c.id} className="group">
            <GiftCardVisual card={c} className="group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-200" />
            <div className="card -mt-5 pt-8 pb-4 px-5 relative z-0 mx-3 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{c.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ₹{c.price} or {c.points_price.toLocaleString('en-IN')} pts
                    {c.discount_pct > 0 && (
                      <span className="ml-2 bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        {c.discount_pct}% OFF
                      </span>
                    )}
                  </p>
                </div>
                <button className="btn-primary !px-4 !py-1.5 text-sm" onClick={() => setSelected(c)}>
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* purchase modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="card max-w-md w-full p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <GiftCardVisual card={{ ...selected, code: 'XXXX-XXXX-XXXX' }} size="lg" className="mb-5" />
            <h2 className="font-bold text-lg">{selected.name}</h2>
            <p className="text-sm text-gray-500">{selected.brand} · value ₹{selected.value}</p>

            <div className="mt-4">
              <label className="label">Gift message (optional)</label>
              <textarea
                className="input"
                rows={2}
                placeholder="Happy Birthday!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { k: 'balance', label: 'Account balance', sub: `₹${selected.price}` },
                { k: 'points', label: 'Reward points', sub: `${selected.points_price} pts` },
              ].map((o) => (
                <button
                  key={o.k}
                  type="button"
                  onClick={() => setPayWith(o.k)}
                  className={`rounded-xl border-2 p-3 text-left transition-colors ${
                    payWith === o.k ? 'border-idfc-red bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-500">{o.label}</p>
                  <p className="font-bold">{o.sub}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button className="btn-primary flex-1" onClick={buy}>Confirm purchase</button>
              <button className="btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
