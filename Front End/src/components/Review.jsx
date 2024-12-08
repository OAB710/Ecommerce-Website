import React, { useState, useEffect } from "react";
import { MdStar } from "react-icons/md";

const Review = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    console.log("Fetching reviews for productId:", productId); // Add this line to log productId
    console.log("Fetching reviews for productId:", productId); // Add this line to log productId
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
            <p style={{ display: 'flex', alignItems: 'center', fontSize: '1.2em', color: 'black' }}>
              Rating: 
              {[...Array(review.rating)].map((_, index) => (
                <MdStar key={index} style={{ color: 'orange', marginLeft: '5px', fontSize: '2em' }} />
              ))}
            </p>
            <p style={{ fontSize: '1.2em', color: 'black' }}>
              <strong>{review.user.name}</strong>: {review.review}
            </p>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;