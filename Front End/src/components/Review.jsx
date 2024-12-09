import React, { useState, useEffect } from "react";
import { MdStar } from "react-icons/md";

const Review = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    console.log("Fetching reviews for productId:", productId);
    const response = await fetch(`http://localhost:4000/reviews/${productId}`);
    const data = await response.json();
    if (data.success) {
      setReviews(data.reviews);
    }
  };

  // Calculate the reviews to display on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(reviews.length / reviewsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="reviews-section">
      <h3 className="h3">Reviews</h3>
      <div className="reviews-list">
        {currentReviews.map((review) => (
          <div key={review._id} className="review" style={{ marginBottom: '20px' }}>
            <p style={{ display: 'flex', alignItems: 'center', fontSize: '1.1em', color: 'black' }}>
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
      <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FF813F', padding: '10px', borderRadius: '5px' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1} style={{ backgroundColor: '#FF813F', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', width: '100px' }}>
          Previous
        </button>
        <span style={{ color: 'white', fontWeight: 'bold' }}>
          Page {currentPage} of {Math.ceil(reviews.length / reviewsPerPage)}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)} style={{ backgroundColor: '#FF813F', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', width: '100px' }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Review;