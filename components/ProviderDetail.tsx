
import React, { useState } from 'react';
import { Provider, CartItem } from '../types';
import { ChevronLeft, Star, Clock, MapPin, Share2, Heart, ShieldCheck, Plus, Minus, Check, Bell, Loader2 } from 'lucide-react';

interface ProviderDetailProps {
  provider: Provider;
  onBack: () => void;
}

export const ProviderDetail: React.FC<ProviderDetailProps> = ({ provider, onBack }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services');

  // Waitlist Logic
  const [isWaitlistLoading, setIsWaitlistLoading] = useState(false);
  const [isJoinedWaitlist, setIsJoinedWaitlist] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleJoinWaitlist = () => {
    if (isJoinedWaitlist) return;
    
    setIsWaitlistLoading(true);
    
    // Simulate network request
    setTimeout(() => {
       setIsWaitlistLoading(false);
       setIsJoinedWaitlist(true);
       setShowToast(true);
       
       // Hide toast after 3s
       setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const addToCart = (serviceId: string, serviceName: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.serviceId === serviceId);
      if (existing) {
        return prev.map(item => item.serviceId === serviceId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { serviceId, providerId: provider.id, serviceName, price, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => {
       const existing = prev.find(item => item.serviceId === serviceId);
       if (existing && existing.quantity > 1) {
         return prev.map(item => item.serviceId === serviceId ? { ...item, quantity: item.quantity - 1 } : item);
       }
       return prev.filter(item => item.serviceId !== serviceId);
    });
  };

  const getQuantity = (serviceId: string) => cart.find(i => i.serviceId === serviceId)?.quantity || 0;
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
               <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
               <Heart className={`w-5 h-5 ${provider.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Hero Image */}
        <div className="relative h-64 w-full">
           <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
           <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                 {provider.name}
                 {provider.isVerified && <ShieldCheck className="w-5 h-5 text-blue-400 fill-blue-400/20" />}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-100 mt-1">
                 <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/> {provider.rating} ({provider.reviewCount})</span>
                 <span>•</span>
                 <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {provider.address}</span>
              </div>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-4 px-4 sticky top-14 bg-white z-30">
          {['services', 'reviews', 'about'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`pb-3 pt-2 px-4 text-sm font-medium capitalize relative ${activeTab === tab ? 'text-[#1E90FF]' : 'text-gray-500'}`}
             >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1E90FF] rounded-t-full layoutId='activeTab'" />}
             </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
           {activeTab === 'services' && (
              <div className="space-y-6">
                 {/* Categories would ideally group services, flat list for demo */}
                 <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-900">Services Populaires</h3>
                    {provider.services.map(service => {
                       const qty = getQuantity(service.id);
                       return (
                         <div key={service.id} className="flex justify-between items-center group">
                            <div>
                               <h4 className="font-medium text-gray-900">{service.name}</h4>
                               <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                  <span>{service.durationMin > 0 ? `${service.durationMin} min` : 'Durée variable'}</span>
                                  <span>•</span>
                                  <span className="font-semibold text-gray-900">{service.price === 0 ? 'Sur Devis' : `${service.price}€`}</span>
                               </div>
                            </div>
                            
                            {/* Quantity Selector / Add Button */}
                            <div className="flex items-center gap-3">
                               {qty > 0 ? (
                                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                                     <button onClick={() => removeFromCart(service.id)} className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-[#1E90FF]">
                                        <Minus className="w-4 h-4" />
                                     </button>
                                     <span className="font-medium w-3 text-center text-sm">{qty}</span>
                                     <button onClick={() => addToCart(service.id, service.name, service.price)} className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-[#1E90FF]">
                                        <Plus className="w-4 h-4" />
                                     </button>
                                  </div>
                               ) : (
                                  <button 
                                    onClick={() => addToCart(service.id, service.name, service.price)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] transition-all"
                                  >
                                     <Plus className="w-5 h-5" />
                                  </button>
                               )}
                            </div>
                         </div>
                       );
                    })}
                 </div>

                 {/* Waitlist Promo if Full - ONLY IF ITEMS IN CART */}
                 {provider.availabilityStatus === 'FULL' && totalItems > 0 && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
                       <div className="bg-orange-100 p-2 rounded-full">
                          <Clock className="w-5 h-5 text-orange-600" />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-orange-900 text-sm">Complet aujourd'hui</h4>
                          <p className="text-xs text-orange-700 mt-1 mb-3 leading-relaxed">
                             Inscrivez-vous sur la liste d'attente intelligente. Si un RDV s'annule, vous recevez un SMS instantané : <span className="font-semibold">"Premier arrivé, premier servi"</span>.
                          </p>
                          
                          <button 
                            onClick={handleJoinWaitlist}
                            disabled={isWaitlistLoading || isJoinedWaitlist}
                            className={`
                                text-xs font-semibold px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2 transition-all
                                ${isJoinedWaitlist 
                                    ? 'bg-green-50 text-green-700 border-green-200 cursor-default' 
                                    : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50 active:scale-95'
                                }
                            `}
                          >
                             {isWaitlistLoading ? (
                                <>
                                   <Loader2 className="w-3 h-3 animate-spin" />
                                   Inscription...
                                </>
                             ) : isJoinedWaitlist ? (
                                <>
                                   <Check className="w-3 h-3" />
                                   Vous êtes inscrit(e)
                                </>
                             ) : (
                                <>
                                   <Bell className="w-3 h-3" />
                                   M'inscrire sur liste d'attente
                                </>
                             )}
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           )}

           {activeTab === 'reviews' && (
              <div className="text-center py-10 text-gray-400">
                 <p>Section Avis Clients (Simulation)</p>
              </div>
           )}
        </div>
      </div>

      {/* Sticky Bottom Booking Bar */}
      {totalItems > 0 && (
         <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-8 animate-in slide-in-from-bottom-10 fade-in duration-300 z-50">
            <div className="flex justify-between items-center mb-1">
               <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase font-semibold">{totalItems} service{totalItems > 1 ? 's' : ''}</span>
                  <span className="text-xl font-bold text-gray-900">{totalPrice === 0 ? 'Sur devis' : `${totalPrice.toFixed(2)}€`}</span>
               </div>
               <button 
                  onClick={() => alert("Flow de réservation suivant : Choix du créneau")}
                  className="bg-[#1E90FF] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-transform active:scale-95 flex items-center gap-2"
               >
                  Continuer
                  <ChevronLeft className="w-4 h-4 rotate-180" />
               </button>
            </div>
         </div>
      )}

      {/* Success Toast */}
      {showToast && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] w-3/4 max-w-sm">
             <div className="bg-gray-900/95 backdrop-blur-md text-white px-6 py-5 rounded-2xl shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-green-500/30">
                   <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">C'est noté !</h3>
                <p className="text-sm text-gray-300">Vous êtes sur la liste. Gardez votre téléphone à proximité, ça peut aller très vite ! 🚀</p>
             </div>
          </div>
      )}
    </div>
  );
};
