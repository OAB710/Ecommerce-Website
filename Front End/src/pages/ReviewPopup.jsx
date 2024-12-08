import React, { useState } from 'react';

const ReviewPopup = ({ product, onClose, review, orderId }) => {
  const [comment, setComment] = useState(review ? review.review : '');
  const [rating, setRating] = useState(review ? review.rating : 0);

  const handleSubmit = async () => {
    const url = review ? `http://localhost:4000/editreview/${review._id}` : 'http://localhost:4000/addreview';
    const method = review ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
      body: JSON.stringify({
        orderId, // Thêm thuộc tính orderId vào đây
        product: product.product,
        review: comment,
        rating,
      }),
    });
    const data = await response.json();
    if (data.success) {
      alert('Review submitted successfully');
      window.location.reload();
      onClose();
    } else {
      alert('Error submitting review');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{review ? 'Edit Review' : 'Write Review'}</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows="5"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength="500"
        />
        <div className="flex items-center mb-4">
          <span className="mr-2">Rating:</span>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>{star}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;