import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import styles from './Home.module.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '', category: '', minPrice: '', maxPrice: '', page: 1
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({ ...filters, limit: 8 });
      setProducts(data.data);
      setTotal(data.total);
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const setFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }));

  const totalPages = Math.ceil(total / 8);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroSub}>◈ Catálogo Digital</p>
          <h1 className={styles.heroTitle}>Encontre o produto<br /><span>perfeito para você</span></h1>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar produtos..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar de filtros */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sideTitle}>Filtros</h3>

          <div className={styles.filterGroup}>
            <label>Categoria</label>
            <select
              className="input-field"
              value={filters.category}
              onChange={e => setFilter('category', e.target.value)}
            >
              <option value="">Todas</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Faixa de preço</label>
            <div className={styles.priceRow}>
              <input
                className="input-field"
                type="number"
                placeholder="Mín"
                value={filters.minPrice}
                onChange={e => setFilter('minPrice', e.target.value)}
              />
              <span style={{ color: 'var(--text2)' }}>—</span>
              <input
                className="input-field"
                type="number"
                placeholder="Máx"
                value={filters.maxPrice}
                onChange={e => setFilter('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn-secondary"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={() => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', page: 1 })}
          >
            Limpar filtros
          </button>
        </aside>

        {/* Grid de produtos */}
        <main className={styles.main}>
          <div className={styles.resultsBar}>
            <span className={styles.count}>{total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className={styles.loading}>
              {[...Array(8)].map((_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <span>🔍</span>
              <p>Nenhum produto encontrado com esses filtros.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className="btn-secondary"
                disabled={filters.page <= 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              >← Anterior</button>
              <span className={styles.pageInfo}>{filters.page} / {totalPages}</span>
              <button
                className="btn-secondary"
                disabled={filters.page >= totalPages}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              >Próximo →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
