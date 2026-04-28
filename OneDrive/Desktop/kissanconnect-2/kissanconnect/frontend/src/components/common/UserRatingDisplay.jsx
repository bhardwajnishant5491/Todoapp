import React from 'react';
import { FiStar, FiAward } from 'react-icons/fi';

const UserRatingDisplay = ({ stats, showDetails = false, size = 'medium' }) => {
  if (!stats) return null;

  const { averageRating = 0, totalRatings = 0, completedTransactions = 0 } = stats;

  // Size variants
  const sizeClasses = {
    small: {
      container: 'flex items-center gap-1.5',
      star: 'text-xs',
      rating: 'text-sm font-bold',
      text: 'text-xs',
    },
    medium: {
      container: 'flex items-center gap-2',
      star: 'text-sm',
      rating: 'text-base font-bold',
      text: 'text-sm',
    },
    large: {
      container: 'flex items-center gap-3',
      star: 'text-base',
      rating: 'text-lg font-bold',
      text: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FiStar key={`full-${i}`} className={`${classes.star} fill-yellow-400 text-yellow-400`} />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <FiStar className={`${classes.star} text-gray-300`} />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <FiStar className={`${classes.star} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FiStar key={`empty-${i}`} className={`${classes.star} text-gray-300`} />
        ))}
      </div>
    );
  };

  if (!showDetails) {
    // Compact display
    return (
      <div className={classes.container}>
        {averageRating > 0 ? (
          <>
            <FiStar className={`${classes.star} fill-yellow-400 text-yellow-400`} />
            <span className={`${classes.rating} text-gray-900`}>
              {averageRating.toFixed(1)}
            </span>
            <span className={`${classes.text} text-gray-500`}>
              ({totalRatings})
            </span>
            {completedTransactions > 0 && (
              <>
                <span className="text-gray-300">•</span>
                <span className={`${classes.text} text-green-600 font-medium flex items-center gap-1`}>
                  <FiAward className={classes.star} />
                  {completedTransactions} deals
                </span>
              </>
            )}
          </>
        ) : (
          <span className={`${classes.text} text-gray-400 italic`}>No ratings yet</span>
        )}
      </div>
    );
  }

  // Detailed display
  return (
    <div className="space-y-3">
      {/* Rating Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
          </div>
          {renderStars(averageRating)}
          <p className="text-sm text-gray-600 mt-1">
            {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
          </p>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-12">5 ⭐</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{
                  width: `${totalRatings > 0 ? (stats.distribution?.[5] / totalRatings) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8 text-right">
              {stats.distribution?.[5] || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-12">4 ⭐</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{
                  width: `${totalRatings > 0 ? (stats.distribution?.[4] / totalRatings) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8 text-right">
              {stats.distribution?.[4] || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-12">3 ⭐</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{
                  width: `${totalRatings > 0 ? (stats.distribution?.[3] / totalRatings) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8 text-right">
              {stats.distribution?.[3] || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-12">2 ⭐</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{
                  width: `${totalRatings > 0 ? (stats.distribution?.[2] / totalRatings) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8 text-right">
              {stats.distribution?.[2] || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-12">1 ⭐</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{
                  width: `${totalRatings > 0 ? (stats.distribution?.[1] / totalRatings) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8 text-right">
              {stats.distribution?.[1] || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-green-600">
          <FiAward className="text-lg" />
          <span className="font-semibold">
            {completedTransactions} Successful {completedTransactions === 1 ? 'Deal' : 'Deals'}
          </span>
        </div>

        {stats.avgCommunication > 0 && (
          <div className="text-sm text-gray-600">
            Communication: ⭐ {stats.avgCommunication}
          </div>
        )}

        {stats.avgQuality > 0 && (
          <div className="text-sm text-gray-600">
            Quality: ⭐ {stats.avgQuality}
          </div>
        )}

        {stats.avgTimeliness > 0 && (
          <div className="text-sm text-gray-600">
            Timeliness: ⭐ {stats.avgTimeliness}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRatingDisplay;
