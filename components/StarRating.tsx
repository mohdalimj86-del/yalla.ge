
import React, { useState } from 'react';

interface StarRatingProps {
    rating: number;
    setRating?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    readOnly?: boolean;
    onHoverChange?: (isHovering: boolean) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, size = 'md', readOnly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    const handleStarClick = (value: number) => {
        if (!readOnly && setRating) {
            setRating(value);
        }
    };

    const handleMouseEnter = (value: number) => {
        if (!readOnly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0);
        }
    };

    return (
        <div className={`flex items-center space-x-1 ${sizeClasses[size]}`} onMouseLeave={handleMouseLeave}>
            {stars.map((starValue) => (
                <button
                    key={starValue}
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleStarClick(starValue)}
                    onMouseEnter={() => handleMouseEnter(starValue)}
                    className={`transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
                        (hoverRating || rating) >= starValue
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-500'
                    }`}
                    aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                >
                    <i className="fas fa-star"></i>
                </button>
            ))}
        </div>
    );
};

export default StarRating;
