import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import GiftCardVisual from '../components/GiftCardVisual';

export default function CardDetail() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get(`/giftcards/${id}`).then(({ data }) => setCard(data)).catch(() => setCard({ error: true }));
  }, [id]);

  const transfer = async (e) => {
    e.preventDefault();
    setNotice('');
    try {
      await api.post('/giftcards/transfer', { card_id: Number(id), recipient });
      setNotice(`✓ Transferred to ${recipient}`);
    } catch (err) {
      setNotice(err.response?.data?.error || 'transfer failed');
    }
  };

  if (!card) return <div className="p-10 text-center text-gray-500">Loading…</div>;
  if (card.error) return <div className="p-10 text-center text-idfc-red">Card not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm font-medium text-idfc-red hover:underline">← Back to dashboard</Link>

      <div className="grid md:grid-cols-5 gap-8 mt-4">
        {/* card visual */}
        <div className="md:col-span-3">
          <GiftCardVisual card={card} size="lg" />
          {card.message && (
            <div className="card p-5 mt-5">
              <p className="label">Gift message</p>
              {/* VULNERABILITY (A03 / stored XSS): message is rendered as raw HTML.
                  A payload like <img src=x onerror=alert(document.cookie)> executes here
                  and on the admin "All Gift Cards" tab. */}
              <div
                className="bg-idfc-cream border border-idfc-gold/30 rounded-lg p-4 text-sm"
                dangerouslySetInnerHTML={{ __html: card.message }}
              />
            </div>
          )}
        </div>

        {/* details panel */}
        <div className="md:col-span-2 space-y-5">
          <div className="card p-5">
            <div className="flex justify-between items-center">
              <p className="label !mb-0">Status</p>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${card.redeemed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                {card.redeemed ? 'Redeemed' : 'Active'}
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Owner</span><span className="font-medium">{card.owner_username}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Value</span><span className="font-bold text-idfc-red">₹{card.value}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Issued</span><span>{card.created_at}</span></div>
            </div>
          </div>

          <div className="card p-5">
            <p className="label">Voucher credentials</p>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm break-all">{card.code}</div>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm mt-2 flex justify-between items-center">
              <span>{showPin ? card.pin : '••••'}</span>
              <button className="text-idfc-red text-xs font-semibold" onClick={() => setShowPin(!showPin)}>
                {showPin ? 'Hide PIN' : 'Reveal PIN'}
              </button>
            </div>
          </div>

          <form onSubmit={transfer} className="card p-5">
            <p className="label">Send this card</p>
            <input
              className="input text-sm"
              placeholder="recipient username or email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <button className="btn-primary w-full mt-3" type="submit">Transfer gift card</button>
            {notice && <p className="mt-3 text-sm text-gray-600">{notice}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
