import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating, count, size = 14, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-zinc-200" />
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-[10px] text-zinc-400 font-bold">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
