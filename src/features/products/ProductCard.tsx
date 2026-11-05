
import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [firstImage] = product.images

  return (
    <article className="product-card">

      <div className="product-card__image">
        {firstImage ? (
          <img src={firstImage} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">
            No image available
          </div>
        )}
      </div>

      <div className="product-card__content">

        <p className="product-card__store">
          {product.storeName}
        </p>

        <h3>{product.name}</h3>

        <p className="product-card__description">
          {product.description}
        </p>

        <div className="product-card__footer">
          <span className="product-card__price">
            ${product.price.toFixed(2)}
          </span>
        </div>

      </div>
    </article>
  )
}
