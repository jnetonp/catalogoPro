import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span>Catálogo<strong>Pro</strong></span>
        </Link>

        <div className={styles.links}>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Produtos</Link>
          {isAdmin && <Link to="/admin" className={location.pathname === '/admin' ? styles.active : ''}>Admin</Link>}
        </div>

        <div className={styles.auth}>
          {user ? (
            <>
              <span className={styles.userBadge}>
                {isAdmin && <span className={styles.adminTag}>admin</span>}
                {user.name}
              </span>
              <button className="btn-secondary" onClick={handleLogout} style={{ padding: '7px 16px', fontSize: '0.82rem' }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-secondary" style={{ padding: '7px 16px', fontSize: '0.82rem' }}>Entrar</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '7px 16px', fontSize: '0.82rem' }}>Cadastrar</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
