import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ratingService from '../../services/ratingService';

const RatingModal = ({ isOpen, onClose, contract, ratedUser, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [communication, setCommunication] = useState(0);
  const [quality, setQuality] = useState(0);
  const [timeliness, setTimeliness] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);

    const ratingData = {
      contractId: contract._id,
      ratedUserId: ratedUser._id,
      rating,
      review: review.trim(),
      communication,
      quality,
      timeliness,
    };

    const result = await ratingService.createRating(ratingData);

    if (result.success) {
      toast.success('✅ Rating submitted successfully!');
      onSubmitSuccess && onSubmitSuccess(result.rating);
      onClose();
      // Reset form
      setRating(0);
      setReview('');
      setCommunication(0);
      setQuality(0);
      setTimeliness(0);
    } else {
      toast.error(result.message || 'Failed to submit rating');
    }

    setSubmitting(false);
  };

  const StarRating = ({ value, onChange, label, size = 'large' }) => {
    const [localHover, setLocalHover] = useState(0);
    const starSize = size === 'large' ? 'text-4xl' : 'text-2xl';

    return (
      <div>
        {label && <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setLocalHover(star)}
              onMouseLeave={() => setLocalHover(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <FiStar
                className={`${starSize} ${
                  star <= (localHover || value)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h3 className="text-xl font-poppins font-bold text-white">Rate Your Experience</h3>
              <p className="text-white/90 text-sm font-inter mt-1">
                How was your experience with {ratedUser?.name || 'this user'}?
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl font-bold"
            >
              <FiX />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Main Rating */}
            <div className="text-center space-y-3">
              <StarRating
                value={rating}
                onChange={setRating}
                size="large"
              />
              <p className="text-sm text-gray-600 font-inter">
                {rating === 0 && 'Select a rating'}
                {rating === 1 && '⭐ Poor'}
                {rating === 2 && '⭐⭐ Fair'}
                {rating === 3 && '⭐⭐⭐ Good'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
              </p>
            </div>

            {/* Specific Ratings */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h4 className="font-poppins font-semibold text-gray-900">Rate Specific Aspects</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StarRating
                  value={communication}
                  onChange={setCommunication}
                  label="Communication"
                  size="small"
                />
                <StarRating
                  value={quality}
                  onChange={setQuality}
                  label="Quality"
                  size="small"
                />
                <StarRating
                  value={timeliness}
                  onChange={setTimeliness}
                  label="Timeliness"
                  size="small"
                />
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
                Write a Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with others..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-gray-700 placeholder-gray-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1 font-inter">
                {review.length}/500 characters
              </p>
            </div>

            {/* Order Info */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-900 font-inter">
                <strong>Order:</strong> {contract?.cropId?.cropType || 'N/A'} - {contract?.quantity} {contract?.cropId?.unit || 'units'}
              </p>
              <p className="text-xs text-blue-700 mt-1 font-inter">
                Order #{contract?._id?.slice(-8)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-poppins font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-poppins font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RatingModal;
