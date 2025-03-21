import React from 'react';
import './FlipCard.css';

interface FlipCardProps {
    frontContent: React.ReactNode;
    backContent?: React.ReactNode;
    isFlipped: boolean;
    onClick?: () => void;
    className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
    frontContent,
    backContent,
    isFlipped,
    onClick,
    className = ''
}) => {
    const hasFlippedContent = Boolean(backContent);

    return (
        <div 
            className={`flip-card ${className} ${hasFlippedContent ? 'has-flipped-content' : ''}`}
            onClick={hasFlippedContent && onClick ? onClick : undefined}
        >
            <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                <div className="flip-card-front">
                    {frontContent}
                </div>
                {hasFlippedContent && (
                    <div className="flip-card-back">
                        {backContent}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlipCard; 