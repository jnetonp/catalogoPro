import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../services/AuthContext.jsx';
import styles from './Auth.module.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register(name, email, password);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>◈</span>
          <h1>Criar conta</h1>
          <p>Bem-vindo ao CatálogoPro</p>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Nome</label>
            <input className="input-field" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" required />
          </div>
          <div className={styles.field}>
            <label>E-mail</label>
            <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div className={styles.field}>
            <label>Senha <span style={{ color: 'var(--text2)', fontWeight: 400 }}>(mín. 6 caracteres)</span></label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required minLength={6} />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <p className={styles.switch}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
