import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { id, name, category, price, stock, imageUrl } = product;

  return (
    <Link to={`/produto/${id}`} className={styles.card}>
      <div className={styles.imgWrap}>
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'}
          alt={name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'; }}
        />
        <span className={styles.categoryBadge}>{category}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.footer}>
          <span className={styles.price}>R$ {price.toFixed(2).replace('.', ',')}</span>
          <span className={stock > 0 ? styles.inStock : styles.outStock}>
            {stock > 0 ? `${stock} em estoque` : 'Esgotado'}
          </span>
        </div>
      </div>
    </Link>
  );
}
