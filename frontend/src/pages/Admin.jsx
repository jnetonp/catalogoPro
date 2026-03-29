import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import styles from './Admin.module.css';

const EMPTY_FORM = { name: '', category: '', price: '', stock: '', description: '', imageUrl: '' };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({ limit: 100 });
      setProducts(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3500); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editing) {
        await api.updateProduct(editing.id, payload);
        flash('Produto atualizado com sucesso!');
      } else {
        await api.createProduct(payload);
        flash('Produto criado com sucesso!');
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      flash(err.message, true);
    }
  };

  const startEdit = (product) => {
    setEditing(product);
    setForm({ ...product, price: String(product.price), stock: String(product.stock) });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remover "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      flash('Produto removido.');
      fetchProducts();
    } catch (err) {
      flash(err.message, true);
    }
  };

  const cancelForm = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(false); };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.breadcrumb}>◈ Painel Admin</p>
            <h1>Gerenciar Produtos</h1>
          </div>
          {!showForm && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Novo Produto</button>
          )}
        </div>

        {/* Mensagens */}
        {error && <p className="error-msg">{error}</p>}
        {success && <p className={styles.successMsg}>{success}</p>}

        {/* Formulário */}
        {showForm && (
          <div className={styles.formCard}>
            <h2>{editing ? `Editando: ${editing.name}` : 'Novo Produto'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Nome *</label>
                  <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do produto" required />
                </div>
                <div className={styles.field}>
                  <label>Categoria *</label>
                  <input className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Ex: Eletrônicos" required />
                </div>
                <div className={styles.field}>
                  <label>Preço (R$) *</label>
                  <input className="input-field" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" required />
                </div>
                <div className={styles.field}>
                  <label>Estoque *</label>
                  <input className="input-field" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" required />
                </div>
              </div>
              <div className={styles.field}>
                <label>Descrição *</label>
                <textarea className="input-field" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descrição do produto" required rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div className={styles.field}>
                <label>URL da Imagem</label>
                <input className="input-field" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className="btn-primary">{editing ? 'Salvar alterações' : 'Criar produto'}</button>
                <button type="button" className="btn-secondary" onClick={cancelForm}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Tabela de produtos */}
        <div className={styles.tableWrap}>
          {loading ? (
            <p style={{ color: 'var(--text2)', padding: 24 }}>Carregando...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text2)', fontSize: '0.78rem' }}>#{p.id}</span></td>
                    <td>
                      <div className={styles.productCell}>
                        <img src={p.imageUrl} alt={p.name} onError={e => { e.target.style.display = 'none'; }} />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td><span className="tag">{p.category}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>R$ {p.price.toFixed(2).replace('.', ',')}</td>
                    <td style={{ color: p.stock > 0 ? 'var(--text)' : 'var(--danger)' }}>{p.stock}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => startEdit(p)}>Editar</button>
                        <button className="btn-danger" onClick={() => handleDelete(p.id, p.name)}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
