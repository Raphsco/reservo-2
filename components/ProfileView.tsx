
import React, { useState } from 'react';
import { User, Settings, CreditCard, Bell, Shield, LogOut, ChevronRight, History, Heart } from 'lucide-react';
import { MOCK_PROVIDERS } from '../constants';
import { ProviderCard } from './ProviderCard';

export const ProfileView: React.FC = () => {
  const favorites = MOCK_PROVIDERS.filter(p => p.isFavorite);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleMenuClick = (label: string) => {
    // Simulation de navigation
    alert(`Navigation vers : ${label}`);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    alert("Vous avez été déconnecté.");
    // Logique de redirection ici
  };

  return (
    // FIX: absolute inset-0 overflow-y-auto enables scrolling within the fixed main container
    <div className="absolute inset-0 overflow-y-auto bg-gray-50 pb-32 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-8 border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-5 mb-8">
           <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg relative shrink-0">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
           </div>
           <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">Martin Dupont</h1>
              <p className="text-sm text-gray-500 mb-2 truncate">martin.dupont@email.com</p>
              <div className="flex gap-2">
                 <span className="px-3 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200 flex items-center gap-1">
                    👑 Membre Gold
                 </span>
              </div>
           </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between gap-4">
           <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
              <span className="block text-xl font-bold text-gray-900">12</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Réservations</span>
           </div>
           <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
              <span className="block text-xl font-bold text-gray-900">{favorites.length}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Favoris</span>
           </div>
           <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <span className="block text-xl font-bold text-[#1E90FF]">1,250</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Points</span>
           </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
         
         {/* Favorites Section */}
         {favorites.length > 0 && (
            <section>
               <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                     <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Mes Favoris
                  </h2>
                  <button onClick={() => handleMenuClick("Mes Favoris")} className="text-xs text-[#1E90FF] font-semibold bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors">Voir tout</button>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x">
                  {favorites.map(p => (
                     <div key={p.id} className="w-72 flex-shrink-0 snap-center">
                        <ProviderCard provider={p} onClick={() => handleMenuClick(`Provider ${p.name}`)} compact />
                     </div>
                  ))}
               </div>
            </section>
         )}

         {/* Menu Groups */}
         <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-2">Compte & Paramètres</h3>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                <MenuItem icon={User} label="Informations personnelles" onClick={() => handleMenuClick("Informations personnelles")} />
                <MenuItem icon={CreditCard} label="Moyens de paiement" subLabel="Visa •••• 4242" onClick={() => handleMenuClick("Moyens de paiement")} />
                <MenuItem icon={Bell} label="Notifications" hasBadge onClick={() => handleMenuClick("Notifications")} />
                <MenuItem icon={Shield} label="Confidentialité et sécurité" onClick={() => handleMenuClick("Sécurité")} />
            </section>
         </div>
         
         <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-2">Activités</h3>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                <MenuItem icon={History} label="Historique des rendez-vous" onClick={() => handleMenuClick("Historique")} />
                <MenuItem icon={Settings} label="Préférences de l'application" onClick={() => handleMenuClick("Préférences")} />
            </section>
         </div>

         <button 
            onClick={handleLogoutClick}
            className="w-full py-4 text-red-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-2 hover:bg-red-50 active:scale-[0.98] transition-all"
         >
            <LogOut className="w-5 h-5" /> Déconnexion
         </button>

         <div className="text-center pt-4 pb-8">
            <p className="text-xs text-gray-400 font-medium">Reservo App v1.0.2 (Build 2024)</p>
            <p className="text-[10px] text-gray-300 mt-1">Made with ❤️ by Reservo Team</p>
         </div>
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Se déconnecter ?</h3>
              <p className="text-sm text-gray-500 mb-6">Êtes-vous sûr de vouloir vous déconnecter de votre compte ?</p>
              <div className="flex gap-3">
                 <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                 >
                    Annuler
                 </button>
                 <button 
                    onClick={handleConfirmLogout}
                    className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                 >
                    Oui, partir
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon: Icon, label, subLabel, hasBadge, onClick }: any) => (
  <button 
    onClick={onClick} 
    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors group text-left outline-none"
  >
     <div className="flex items-center gap-4">
        <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 group-hover:bg-[#1E90FF] group-hover:text-white transition-colors duration-200">
           <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
           <div className="text-sm font-semibold text-gray-900">{label}</div>
           {subLabel && <div className="text-xs text-gray-500 mt-0.5 truncate">{subLabel}</div>}
        </div>
     </div>
     <div className="flex items-center gap-2">
        {hasBadge && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
     </div>
  </button>
);
