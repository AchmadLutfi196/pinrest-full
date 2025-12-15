import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pin } from '../types';

interface PinCardProps {
  pin: Pin;
  onSave?: (pin: Pin) => void;
  onLike?: (pin: Pin) => void;
}

export function PinCard({ pin, onSave, onLike }: PinCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(pin.isLiked || false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onLike) onLike(pin);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) onSave(pin);
  };

  return (
    <div
      className="break-inside-avoid relative group mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/pin/${pin.id}`}>
        <div className="relative rounded-[1.5rem] overflow-hidden bg-gray-100">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full h-auto block object-cover transform transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 p-4 flex flex-col justify-between ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-primary text-white font-bold px-4 py-2 rounded-full text-sm hover:bg-primary/90 transition-colors shadow-lg"
              >
                Save
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors size-8 flex items-center justify-center shadow-sm ${
                  isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-gray-900 hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isLiked ? 'favorite' : 'favorite_border'}
                </span>
              </button>
              <button className="bg-white/90 text-gray-900 p-2 rounded-full hover:bg-white transition-colors size-8 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
              <button className="bg-white/90 text-gray-900 p-2 rounded-full hover:bg-white transition-colors size-8 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Pin Info */}
      <div className="mt-2 px-1">
        <h3 className="font-bold text-sm text-gray-900 truncate">{pin.title}</h3>
        {pin.user && (
          <Link to={`/profile/${pin.user.id}`} className="flex items-center gap-2 mt-1 group/user">
            <div className="size-5 rounded-full bg-gray-200 overflow-hidden">
              {pin.user.avatar ? (
                <img src={pin.user.avatar} alt={pin.user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white text-[10px] font-bold">
                  {pin.user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 group-hover/user:text-gray-700 transition-colors">
              @{pin.user.username}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}

export default PinCard;
