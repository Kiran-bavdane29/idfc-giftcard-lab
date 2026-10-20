import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import BankLogo from './BankLogo';

const navLink = ({ isActive }) =>
  `px-4 h-11 inline-flex items-center text-sm font-medium border-b-2 transition-colors ${
    isActive
      ? 'border-idfc-gold text-white'
      : 'border-transparent text-white/75 hover:text-white'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="sticky top-0 z-40">
      {/* white banking header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <BankLogo />
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-idfc-cream border border-idfc-gold/40 rounded-full pl-1.5 pr-4 py-1.5">
              <span className="w-7 h-7 rounded-full bg-idfc-gold text-white flex items-center justify-center text-xs font-bold">
                ★
              </span>
              <span className="text-sm font-semibold text-idfc-charcoal">
                {Number(user.points).toLocaleString('en-IN')}
                <span className="text-gray-400 font-normal"> pts</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-idfc-red text-white flex items-center justify-center font-bold">
                {user.username[0].toUpperCase()}
              </span>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-[11px] text-gray-400 capitalize">{user.role} account</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); nav('/login'); }}
              className="text-sm text-gray-500 hover:text-idfc-red font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* crimson sub-navigation strip */}
      <nav className="bg-gradient-to-r from-idfc-redDark via-idfc-red to-idfc-redLight">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          <NavLink to="/" end className={navLink}>Dashboard</NavLink>
          <NavLink to="/store" className={navLink}>Gift Card Store</NavLink>
          {user.role === 'admin' && <NavLink to="/admin" className={navLink}>Admin Portal</NavLink>}
        </div>
      </nav>
    </div>
  );
}
