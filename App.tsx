import React, { useState, useEffect } from 'react';
import { MOCK_PROVIDERS } from './constants';
import { Provider, ServiceCategory } from './types';
import { MapComponent } from './components/MapComponent';
import { ProviderCard } from './components/ProviderCard';
import { WalletView } from './components/WalletView';
import { MerchantDashboard } from './components/MerchantDashboard';
import { GeminiChat } from './components/GeminiChat';
import { ProviderDetail } from './components/ProviderDetail';
import { ProfileView } from './components/ProfileView';
import { AuthScreen } from './components/AuthScreen';
import { Search, SlidersHorizontal, Map as MapIcon, List, User, QrCode, Loader2 } from 'lucide-react';
import { useProviders } from './hooks/useProviders';
import { supabase } from './lib/supabaseClient';

type ViewMode = 'CLIENT' | 'MERCHANT' | 'WALLET' | 'PROFILE';
type DisplayMode = 'LIST' | 'MAP' | 'SPLIT';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [viewMode, setViewMode] = useState<ViewMode>('CLIENT');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('SPLIT');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'All'>('All');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  
  // Remplacement du loading manuel par celui du hook Supabase
  const { providers, loading: dataLoading } = useProviders();

  // Authentication Check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) handleRoleRedirect(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) handleRoleRedirect(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRoleRedirect = (session: any) => {
     const role = session.user?.user_metadata?.role;
     if (role === 'pro') {
        setViewMode('MERCHANT');
     } else {
        setViewMode('CLIENT');
     }
  };

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDisplayMode(prev => prev === 'SPLIT' ? 'LIST' : prev);
      } else {
        setDisplayMode('SPLIT');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter Providers
  const filteredProviders = providers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProviderSelect = (id: string) => {
    setSelectedProviderId(id);
  };

  const handleSearchInArea = () => {
    console.log("Searching in area...");
  };

  if (authLoading) {
     return (
        <div className="h-screen flex items-center justify-center bg-white">
           <Loader2 className="w-8 h-8 text-[#1E90FF] animate-spin" />
        </div>
     );
  }

  if (!session) {
     return <AuthScreen />;
  }

  const renderClientView = () => {
     // Desktop Detail Overlay
     if (selectedProviderId && displayMode === 'LIST') {
        const provider = providers.find(p => p.id === selectedProviderId);
        if (provider) return <ProviderDetail provider={provider} onBack={() => setSelectedProviderId(null)} />;
     }

     return (
    <div className="absolute inset-0 flex overflow-hidden">
      {/* Detail View Overlay for Desktop Split View */}
      {selectedProviderId && displayMode === 'SPLIT' && (
         <div className="absolute top-0 left-0 w-1/3 h-full z-40 bg-white shadow-2xl border-r border-gray-200 animate-in slide-in-from-left duration-300">
             <ProviderDetail 
                provider={providers.find(p => p.id === selectedProviderId)!} 
                onBack={() => setSelectedProviderId(null)} 
             />
         </div>
      )}

      {/* List Panel */}
      <div className={`flex-1 flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden ${displayMode === 'MAP' ? 'hidden' : 'flex'}`}>
        
        {/* Search Header */}
        <div className="p-4 bg-white border-b border-gray-100 shadow-sm z-10 sticky top-0">
          <div className="relative mb-3">
             <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
             <input 
               type="text" 
               placeholder="Coiffeur, Garagiste, Plombier..." 
               className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#1E90FF]/20 transition-all"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <button className="absolute right-2 top-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-transform">
               <SlidersHorizontal className="w-4 h-4 text-gray-600" />
             </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             <button 
               onClick={() => setSelectedCategory('All')}
               className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${selectedCategory === 'All' ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
             >
               Tout
             </button>
             {Object.values(ServiceCategory).map(cat => (
               <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${selectedCategory === cat ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {dataLoading ? (
              // Skeleton Loading
              [1,2,3].map(i => (
                 <div key={i} className="bg-white rounded-xl p-4 h-32 animate-pulse flex gap-4 border border-gray-100">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                       <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                       <div className="h-3 bg-gray-200 rounded w-1/4 mt-4"></div>
                    </div>
                 </div>
              ))
           ) : (
             <>
               <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                 {filteredProviders.length} Résultats
               </h2>
               {filteredProviders.map(provider => (
                 <ProviderCard 
                   key={provider.id} 
                   provider={provider} 
                   isSelected={selectedProviderId === provider.id}
                   onClick={() => handleProviderSelect(provider.id)}
                 />
               ))}
               {filteredProviders.length === 0 && (
                 <div className="text-center py-10 text-gray-400">
                   Aucun résultat trouvé pour cette zone.
                 </div>
               )}
             </>
           )}
           
           {/* Bottom padding for mobile nav */}
           <div className="h-20 md:h-0"></div>
        </div>
      </div>

      {/* Map Panel */}
      <div className={`flex-1 relative bg-gray-200 ${displayMode === 'LIST' ? 'hidden' : 'block'}`}>
         <MapComponent 
            providers={filteredProviders} 
            selectedProviderId={selectedProviderId}
            onSelectProvider={handleProviderSelect}
            onSearchInArea={handleSearchInArea}
         />
      </div>

      {/* Mobile Map Toggle Button Overlay */}
      <div className="md:hidden absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50">
         <button 
            onClick={() => setDisplayMode(displayMode === 'MAP' ? 'LIST' : 'MAP')}
            className={`px-5 py-2.5 rounded-full shadow-xl font-medium flex items-center gap-2 hover:scale-105 transition-transform border border-gray-200/20 ${displayMode === 'MAP' ? 'bg-white text-gray-900 border-gray-200' : 'bg-gray-900 text-white'}`}
         >
            {displayMode === 'MAP' ? (
                <>
                    <List className="w-4 h-4"/>
                    <span className="text-sm">Liste</span>
                </>
            ) : (
                <>
                    <MapIcon className="w-4 h-4"/> 
                    <span className="text-sm">Carte</span>
                </>
            )}
         </button>
      </div>
    </div>
  )};

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
      
      {/* Mode Switcher for Demo (Top Bar) - Only show if Logged In */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center text-xs text-gray-500 z-50 relative shrink-0">
         <span className="font-bold text-[#1E90FF] text-lg tracking-tight">Reservo</span>
         <div className="flex gap-2 items-center">
            <span className="hidden md:inline mr-2 text-gray-400">Mode Démo:</span>
            <button onClick={() => setViewMode('CLIENT')} className={`px-2 py-1 rounded transition-colors ${viewMode === 'CLIENT' || viewMode === 'WALLET' || viewMode === 'PROFILE' ? 'bg-blue-50 text-[#1E90FF] font-bold' : 'hover:bg-gray-100'}`}>Client</button>
            <button onClick={() => setViewMode('MERCHANT')} className={`px-2 py-1 rounded transition-colors ${viewMode === 'MERCHANT' ? 'bg-blue-50 text-[#1E90FF] font-bold' : 'hover:bg-gray-100'}`}>Pro</button>
         </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {viewMode === 'CLIENT' && renderClientView()}
        {viewMode === 'WALLET' && <WalletView />}
        {viewMode === 'PROFILE' && <ProfileView />}
        {viewMode === 'MERCHANT' && <MerchantDashboard />}
        
        {/* Gemini Chat - Only visible in Client/Wallet mode */}
        {viewMode !== 'MERCHANT' && <GeminiChat />}
      </main>

      {/* Mobile Bottom Navigation (Only for Client/Wallet/Profile) */}
      {viewMode !== 'MERCHANT' && (
        <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden z-50 pb-safe">
           <div className="flex justify-around items-center h-16">
              <button 
                onClick={() => setViewMode('CLIENT')} 
                className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'CLIENT' ? 'text-[#1E90FF]' : 'text-gray-400'}`}
              >
                 <Search className="w-6 h-6" />
                 <span className="text-[10px] font-medium">Explorer</span>
              </button>
              
              {/* Central QR Button with Pulse Effect if unused reward */}
              <button 
                onClick={() => setViewMode('WALLET')}
                className={`relative -top-5 bg-[#1E90FF] text-white p-4 rounded-full shadow-lg border-4 border-gray-50 transform transition-transform hover:scale-105 active:scale-95 group z-50 ${viewMode === 'WALLET' ? 'ring-2 ring-offset-2 ring-[#1E90FF]' : ''}`}
              >
                 <QrCode className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                 {/* Notification Dot */}
                 <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border border-white rounded-full"></span>
              </button>
              
              <button 
                onClick={() => setViewMode('PROFILE')}
                className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'PROFILE' ? 'text-[#1E90FF]' : 'text-gray-400'}`}
              >
                 <User className="w-6 h-6" />
                 <span className="text-[10px] font-medium">Profil</span>
              </button>
           </div>
        </nav>
      )}
    </div>
  );
}