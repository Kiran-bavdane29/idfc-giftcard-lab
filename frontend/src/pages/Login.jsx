import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import BankLogo from '../components/BankLogo';
import GiftCardVisual from '../components/GiftCardVisual';

const FEATURES = [
  'Instant e-gift cards from top brands',
  'Pay with balance or FIRST Rewards points',
  'Send gift cards to friends & family',
  'Track every voucher in one place',
];

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(form.username, form.password);
      else await register(form.username, form.email, form.password);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.error || 'request failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* left brand panel */}
      <div className="hidden lg:flex w-[46%] relative overflow-hidden bg-gradient-to-br from-[#4d0000] via-idfc-red to-idfc-redLight text-white flex-col justify-between p-12">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/[0.06]" />
        <div className="absolute bottom-10 -left-24 w-80 h-80 rounded-full bg-white/[0.05]" />
        <BankLogo dark={false} />
        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight">
            Gift Cards &<br />FIRST Rewards
          </h1>
          <p className="mt-3 text-white/80 text-lg">Always You First.</p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-white/90">
                <span className="w-5 h-5 rounded-full bg-idfc-gold text-[#4d0000] flex items-center justify-center text-xs font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-10 w-80 rotate-[-4deg]">
            <GiftCardVisual
              card={{ brand: 'IDFC FIRST', catalog_name: 'Rewards Mega Card', value: 5000, code: 'IDFC-ALWAYS-FIRST' }}
            />
          </div>
        </div>
        <p className="relative text-xs text-white/50">
          Security-testing lab build — intentionally vulnerable. Not affiliated with IDFC FIRST Bank.
        </p>
      </div>

      {/* right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-idfc-cream">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><BankLogo /></div>
          <div className="card p-8 shadow-card">
            <h2 className="text-xl font-bold">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'login' ? 'Sign in to your rewards account' : 'Join FIRST Rewards in seconds'}
            </p>

            <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1 mt-6 mb-6">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 rounded-md text-sm font-semibold capitalize transition-colors ${
                    mode === m ? 'bg-white shadow text-idfc-red' : 'text-gray-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="label">{mode === 'login' ? 'Username or email' : 'Username'}</label>
                <input
                  className="input"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              {mode === 'register' && (
                <div>
                  <label className="label">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              )}
              <div>
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              {error && <p className="text-sm text-idfc-red font-medium">{error}</p>}
              <button className="btn-primary w-full" type="submit">
                {mode === 'login' ? 'Sign in securely' : 'Create account'}
              </button>
            </form>
          </div>
          <p className="text-xs text-gray-400 mt-5 text-center">
            Demo users — alice/alice123 · bob/bob123 · admin/admin123
          </p>
        </div>
      </div>
    </div>
  );
}
