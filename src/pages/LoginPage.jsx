import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      setError('');
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } else {
      setError('Harap masukkan email dan kata sandi Anda.');
    }
  };

  return (
    <div style={{ 
        display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', 
        backgroundColor: 'var(--bg-soft)', padding: '24px', animation: 'fadeIn 0.8s ease-out' 
    }}>
      <div className="card-soft" style={{ width: '100%', maxWidth: '440px', padding: '48px 40px', textAlign: 'center' }}>
        
        {/* 🏫 SCHOOL LOGO POD */}
        <div className="card-soft" style={{ 
            width: '100px', height: '100px', borderRadius: '24px', 
            backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 32px', padding: '10px'
        }}>
          <img src="/logo-budiluhur.png" alt="SDIT Budi Luhur" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px', color: '#2D3436' }}>Selamat Datang</h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>Portal Jurnal Aktivitas SDIT Budi Luhur</p>
        </div>

        {error && (
          <div className="card-soft" style={{ backgroundColor: '#FFF5F5', color: 'var(--danger)', padding: '14px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #FFEBEB' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Akses Email</label>
            <div className="card-soft card-inset" style={{ position: 'relative', padding: '0', borderRadius: '18px', background: 'white' }}>
              <Mail size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ustadzah@sditbudiluhur.sch.id"
                style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '18px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', fontWeight: 600 }} 
              />
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kata Sandi</label>
            <div className="card-soft card-inset" style={{ position: 'relative', padding: '0', borderRadius: '18px', background: 'white' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '18px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', fontWeight: 600 }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-soft btn-primary-soft"
            style={{ 
                width: '100%', padding: '18px', borderRadius: '20px', 
                fontSize: '1rem', fontWeight: 900, marginTop: '12px',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                backgroundColor: '#2D3436', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            Masuk Sekarang <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ marginTop: '40px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Butuh bantuan akses? Hubungi Admin IT Budi Luhur
        </div>
      </div>

      <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
