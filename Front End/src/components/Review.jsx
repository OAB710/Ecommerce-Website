import React, { useState, useEffect } from "react";

const Review = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const response = await fetch(`http://localhost:4000/reviews/${productId}`);
    const data = await response.json();
    if (data.success) {
      setReviews(data.reviews);
    }
  };

  return (
    <div className="reviews-section">
      <h3 className="h3">Reviews</h3>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review._id} className="review">
            <p><strong>{review.user.name}</strong>: {review.review}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;