import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p>${product.new_price}</p>
        <p className="old-price">${product.old_price}</p>
      </Link>
    </div>
  );
};

export default ProductCard;