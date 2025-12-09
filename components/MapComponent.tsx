import React, { useState } from 'react';
import { Provider } from '../types';
import { MapPin, X } from 'lucide-react';
import { ProviderCard } from './ProviderCard';

interface MapComponentProps {
  providers: Provider[];
  selectedProviderId: string | null;
  onSelectProvider: (id: string) => void;
  onSearchInArea: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ providers, selectedProviderId, onSelectProvider, onSearchInArea }) => {
  const [showSearchButton, setShowSearchButton] = useState(false);
  
  // Simulate map movement detection
  const handleMapInteraction = () => {
    if (!showSearchButton) setShowSearchButton(true);
  };

  const selectedProvider = providers.find(p => p.id === selectedProviderId);

  return (
    <div 
      className="relative w-full h-full bg-gray-200 overflow-hidden group"
      onMouseDown={handleMapInteraction}
      onTouchStart={handleMapInteraction}
    >
      {/* Simulated Map Background - Abstract Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="black" strokeWidth="0.5"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* River shape */}
            <path d="M 0 300 Q 400 100 800 500 T 1600 600" fill="none" stroke="#a3c4f3" strokeWidth="50" />
         </svg>
      </div>

      {/* Search In Area Button - Appears on move */}
      {showSearchButton && (
        <button 
          onClick={() => {
            onSearchInArea();
            setShowSearchButton(false);
          }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-gray-700 z-10 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 hover:scale-105 transition-transform"
        >
           <MapPin className="w-4 h-4 text-[#1E90FF]" />
           Rechercher dans cette zone
        </button>
      )}

      {providers.map((provider) => {
        const isSelected = selectedProviderId === provider.id;
        // Determine pin color based on status
        const isAvailable = provider.availabilityStatus === 'AVAILABLE';

        // Find min price for display
        const minPrice = Math.min(...provider.services.map(s => s.price));
        const priceDisplay = minPrice === 0 ? "Devis" : `${minPrice}€`;

        return (
          <button
            key={provider.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProvider(provider.id);
            }}
            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 z-20 hover:scale-110 ${isSelected ? 'scale-125 z-30' : 'scale-100'}`}
            style={{ left: `${provider.lng}%`, top: `${provider.lat}%` }}
          >
            {/* Airbnb Style Price Pin */}
            <div className={`relative shadow-md rounded-full px-3 py-1.5 flex flex-col items-center justify-center border transition-colors duration-200 ${isSelected ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-200 hover:z-50'}`}>
               <span className="font-bold text-xs whitespace-nowrap">{priceDisplay}</span>
               
               {/* Pointer */}
               <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 border-b border-r ${isSelected ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}></div>
            </div>
          </button>
        );
      })}

      {/* Preview Card (Slide Up) */}
      <div className={`absolute bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-80 transition-transform duration-500 ease-spring ${selectedProviderId ? 'translate-y-0' : 'translate-y-[150%]'}`}>
         {selectedProvider && (
           <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectProvider(''); }}
                className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              <ProviderCard 
                 provider={selectedProvider} 
                 onClick={() => onSelectProvider(selectedProvider.id)} 
                 compact
              />
           </div>
         )}
      </div>
    </div>
  );
};
