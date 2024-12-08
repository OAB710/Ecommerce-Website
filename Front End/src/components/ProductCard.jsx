import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.image.startsWith('http') ? product.image : `http://localhost:4000/${product.image}`;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={imageUrl} alt={product.name} />
        <h2>{product.name}</h2>
        <p>${product.new_price}</p>
        <p className="old-price">${product.old_price}</p>
      </Link>
    </div>
  );
};

export default ProductCard;