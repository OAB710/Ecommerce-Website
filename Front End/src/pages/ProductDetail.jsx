import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>{product.price} đ</p>
        <p>GIÁ HẤP DẪN</p>
        <p>{product.discountedPrice} đ</p>
        <p>Giá hời áp dụng đến hết ngày {product.discountEndDate}</p>
        <div className="product-variants">
          {product.variants.map(variant => (
            <div key={variant.id} className="variant">
              <p>{variant.color}, {variant.size}</p>
              <p>{variant.stock} Cửa hàng</p>
              <button>Giỏ hàng</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}