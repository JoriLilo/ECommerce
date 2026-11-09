import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'

// Describes the values and callbacks accepted by this component.
interface ProductCardProps {
  product: Product
}

// Displays a linked product preview using its first image when available.
export default function ProductCard({ product }: ProductCardProps) {
  const [firstImage] = product.images

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-card__image"
        aria-label={`View ${product.name}`}
      >
        {firstImage ? (
          <img src={firstImage} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">No image available</div>
        )}
      </Link>

      <div className="product-card__content">
        <p className="product-card__store">{product.storeName}</p>

        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </article>
  )
}
