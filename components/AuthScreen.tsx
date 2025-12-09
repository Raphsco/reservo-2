import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Briefcase, Mail, Lock, Loader2, ArrowRight, Check } from 'lucide-react';
import { PaymentScreen } from './PaymentScreen';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const [error, setError] = useState<string | null>(null);
  
  // État pour gérer l'étape de paiement
  const [showPayment, setShowPayment] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // LOGIN : Connexion directe
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // REGISTER : Inscription puis affichage du paiement
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              payment_status: 'pending' // On marque le paiement comme en attente
            },
          },
        });
        
        if (error) throw error;
        
        // Si l'inscription Supabase réussit, on passe à l'étape de paiement
        setShowPayment(true);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction appelée quand le paiement Stripe est validé
  const handlePaymentSuccess = async () => {
     // Ici, on pourrait mettre à jour le profil utilisateur dans Supabase pour confirmer le paiement
     // Pour l'instant, on recharge simplement la page ou on connecte l'utilisateur
     // Comme l'utilisateur est déjà inscrit, une simple connexion suffit souvent, 
     // ou on peut forcer une redirection si l'auto-login a fonctionné.
     
     // Pour cette démo, on force une connexion propre pour entrer dans l'app
     const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
     });
     
     if (!error) {
         window.location.reload(); // Recharge pour entrer dans l'app via App.tsx session check
     }
  };

  // Si l'étape paiement est active, on affiche PaymentScreen
  if (showPayment) {
      return <PaymentScreen role={role} onSuccess={handlePaymentSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#1E90FF] p-8 text-center">
           <h1 className="text-3xl font-bold text-white mb-2">Reservo</h1>
           <p className="text-blue-100 text-sm">La plateforme universelle de services</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${isLogin ? 'text-[#1E90FF] border-b-2 border-[#1E90FF]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Connexion
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${!isLogin ? 'text-[#1E90FF] border-b-2 border-[#1E90FF]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inscription
          </button>
        </div>

        {/* Form */}
        <div className="p-8">
           <form onSubmit={handleAuth} className="space-y-5">
              
              {/* Role Selection (Only for Register) */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div 
                     onClick={() => setRole('client')}
                     className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === 'client' ? 'border-[#1E90FF] bg-blue-50 text-[#1E90FF]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                   >
                      <User className="w-6 h-6" />
                      <span className="text-xs font-bold">Je suis Client</span>
                      {role === 'client' && <div className="absolute top-2 right-2"><Check className="w-3 h-3"/></div>}
                   </div>
                   <div 
                     onClick={() => setRole('pro')}
                     className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === 'pro' ? 'border-[#1E90FF] bg-blue-50 text-[#1E90FF]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                   >
                      <Briefcase className="w-6 h-6" />
                      <span className="text-xs font-bold">Je suis Pro</span>
                   </div>
                </div>
              )}

              {!isLogin && (
                <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom Complet</label>
                   <input 
                     type="text" 
                     required
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20 outline-none transition-all text-sm"
                     placeholder="Ex: Martin Dupont"
                   />
                </div>
              )}

              <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20 outline-none transition-all text-sm"
                        placeholder="nom@exemple.com"
                      />
                   </div>
              </div>

              <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mot de passe</label>
                   <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20 outline-none transition-all text-sm"
                        placeholder="••••••••"
                      />
                   </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs flex items-start gap-2">
                   <span className="font-bold">Erreur:</span> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1E90FF] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                       {isLogin ? 'Se connecter' : 'Suivant'}
                       <ArrowRight className="w-5 h-5" />
                    </>
                 )}
              </button>
           </form>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <p className="text-xs text-gray-500">
              En continuant, vous acceptez nos <a href="#" className="text-[#1E90FF] hover:underline">Conditions d'utilisation</a>.
           </p>
        </div>
      </div>
    </div>
  );
};