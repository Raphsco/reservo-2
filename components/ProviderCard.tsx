import React, { useState } from 'react';
import { Provider } from '../types';
import { Star, ShieldCheck, Clock, Heart } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
  isSelected?: boolean;
  onClick: () => void;
  compact?: boolean; // For map preview
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, isSelected, onClick, compact = false }) => {
  const [isLiked, setIsLiked] = useState(provider.isFavorite);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Reset animation state
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg border group relative ${isSelected ? 'border-[#1E90FF] ring-1 ring-[#1E90FF]' : 'border-gray-100'} ${compact ? 'shadow-xl' : ''}`}
    >
      {/* Favorite Button */}
      <button 
        onClick={toggleLike}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm"
      >
        <Heart 
          className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'} ${isAnimating ? 'scale-150' : 'scale-100'}`} 
        />
      </button>

      <div className="flex gap-4">
        <div className={`relative flex-shrink-0 ${compact ? 'w-20 h-20' : 'w-24 h-24'}`}>
          <img 
            src={provider.image} 
            alt={provider.name} 
            className="w-full h-full object-cover rounded-lg"
          />
          {provider.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm" title="Vérifié par Reservo">
              <ShieldCheck className="w-4 h-4 text-[#1E90FF] fill-[#1E90FF]/10" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start pr-8">
              <h3 className="font-bold text-gray-900 truncate text-base">{provider.name}</h3>
            </div>
            <p className="text-xs text-gray-500 truncate">{provider.category} • {provider.address}</p>
            
            <div className="flex items-center gap-1 text-xs font-medium mt-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{provider.rating}</span>
              <span className="text-gray-400 font-normal">({provider.reviewCount})</span>
            </div>
          </div>

          {!compact && (
            <div className="mt-2 flex flex-wrap gap-2">
              {provider.services.slice(0, 2).map(s => (
                <span key={s.id} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                  {s.name}
                </span>
              ))}
            </div>
          )}

          <div className={`mt-2 flex items-center justify-between ${compact ? 'mt-1' : ''}`}>
             {provider.availabilityStatus === 'AVAILABLE' ? (
                <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                   <Clock className="w-3 h-3" />
                   {compact ? provider.nextSlot : `Dispo: ${provider.nextSlot}`}
                </div>
             ) : (
                <div className="flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                    Complet
                </div>
             )}
             
             {/* Price Tag */}
             <div className="font-bold text-gray-900 text-sm">
                {Math.min(...provider.services.map(s => s.price)) === 0 
                  ? "Sur Devis" 
                  : `dès ${Math.min(...provider.services.map(s => s.price))}€`}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
