import React, { useState } from 'react';
import { MOCK_PROVIDERS } from '../constants';
import { QrCode, CreditCard, Gift, RotateCw, ChevronRight } from 'lucide-react';

export const WalletView: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  const loyaltyCards = MOCK_PROVIDERS.filter(p => p.loyaltyProgram);

  // Handle slide to unlock
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (val === 100) {
       // Trigger reward action
       setTimeout(() => {
          alert("Récompense activée ! Code : 8821");
          setSliderValue(0);
       }, 300);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-gray-50 pb-24 overflow-x-hidden">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Portefeuille</h1>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 mb-8 h-64 w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
         <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* Front of Card */}
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 flex flex-col items-center justify-center text-white">
               <div className="absolute top-4 right-4 text-gray-400">
                  <RotateCw className="w-5 h-5" />
               </div>
               <div className="bg-white p-4 rounded-xl mb-4">
                  <QrCode className="w-32 h-32 text-gray-900" />
               </div>
               <p className="text-sm font-medium tracking-widest uppercase text-gray-300">Reservo Member</p>
               <p className="text-xs text-gray-500 mt-1">Toucher pour voir les détails</p>
            </div>

            {/* Back of Card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl p-6 shadow-xl border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Martin Dupont</h3>
                  <p className="text-sm text-gray-500">Membre depuis 2023</p>
                </div>
                
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Statut</span>
                      <span className="font-bold text-[#1E90FF]">Gold</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Points Totaux</span>
                      <span className="font-bold">1,250 pts</span>
                   </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                  className="w-full py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                   Agrandir QR Code
                </button>
            </div>
         </div>
      </div>

      {/* Rewards Slider */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
         <div className="flex items-center gap-2 mb-3">
             <Gift className="w-5 h-5 text-[#1E90FF]" />
             <h2 className="font-semibold text-gray-900">Activer une récompense</h2>
         </div>
         <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden flex items-center px-1">
            <div className="absolute left-0 top-0 h-full bg-[#1E90FF]/20 w-full" style={{ width: `${sliderValue}%`, transition: 'none' }}></div>
            <div className="w-full text-center text-xs font-semibold text-gray-400 pointer-events-none uppercase tracking-wide z-0">
               Glisser pour utiliser -20%
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderValue} 
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-grab active:cursor-grabbing"
            />
            <div 
              className="absolute h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center pointer-events-none transition-all z-10"
              style={{ left: `calc(${sliderValue}% - ${sliderValue * 0.4}px)` }}
            >
               <ChevronRight className="w-5 h-5 text-[#1E90FF]" />
            </div>
         </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-[#1E90FF]" />
        Mes Cartes de Fidélité
      </h2>

      <div className="space-y-4">
        {loyaltyCards.map(provider => {
           const prog = provider.loyaltyProgram!;
           const percentage = (prog.currentPoints / prog.targetPoints) * 100;

           return (
             <div key={provider.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-transform active:scale-[0.98]">
                <div className="flex items-center gap-3 mb-3">
                   <img src={provider.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                   <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{provider.name}</h3>
                      <p className="text-xs text-gray-500">{prog.currentPoints} / {prog.targetPoints} points</p>
                   </div>
                   {percentage >= 100 && (
                     <span className="bg-[#1E90FF] text-white text-xs px-2 py-1 rounded-full animate-pulse">
                       Dispo !
                     </span>
                   )}
                </div>

                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-[#1E90FF] transition-all duration-1000 ease-out" 
                      style={{ width: `${percentage}%`}}
                   ></div>
                </div>
             </div>
           )
        })}
      </div>

      {/* Full Screen QR Modal */}
      {showQrModal && (
         <div 
            className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-8 animate-in fade-in duration-200"
            onClick={() => setShowQrModal(false)}
         >
             <p className="text-white/60 mb-8 text-sm uppercase tracking-widest">Luminosité max activée</p>
             <div className="bg-white p-8 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.3)] transform scale-110">
                <QrCode className="w-64 h-64 text-black" />
             </div>
             <p className="text-white mt-8 font-mono text-lg tracking-widest">RES-8821-9920</p>
             <p className="text-white/40 mt-2 text-sm">Appuyez pour fermer</p>
         </div>
      )}

      {/* Styles for Flip Card */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
