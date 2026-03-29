import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getProduct(id)
      .then(setProduct)
      .catch(() => setError('Produto não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.center}><div className={styles.spinner} /></div>;
  if (error || !product) return (
    <div className={styles.center}>
      <p className="error-msg">{error}</p>
      <Link to="/" style={{ marginTop: 16, display: 'inline-block' }}><button className="btn-secondary">← Voltar ao catálogo</button></Link>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link to="/" className={styles.back}>← Voltar ao catálogo</Link>

        <div className={styles.content}>
          <div className={styles.imgSection}>
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'}
              alt={product.name}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'; }}
            />
          </div>

          <div className={styles.info}>
            <span className="tag">{product.category}</span>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.desc}>{product.description}</p>

            <div className={styles.priceBox}>
              <span className={styles.price}>R$ {product.price.toFixed(2).replace('.', ',')}</span>
              <span className={product.stock > 0 ? styles.inStock : styles.outStock}>
                {product.stock > 0 ? `✓ ${product.stock} unidades em estoque` : '✗ Esgotado'}
              </span>
            </div>

            <div className={styles.meta}>
              <div><span>ID do Produto</span><span>#{String(product.id).padStart(4, '0')}</span></div>
              <div><span>Categoria</span><span>{product.category}</span></div>
              <div><span>Disponibilidade</span><span>{product.stock > 0 ? 'Disponível' : 'Indisponível'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
