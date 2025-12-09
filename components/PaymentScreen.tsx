import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, Lock, CreditCard, Loader2, CheckCircle } from 'lucide-react';

// Initialisation de Stripe avec votre clé publique
const stripePromise = loadStripe('pk_test_51ScUaaCg2M70CiGqD9njZ1eoy0qJREsLy4ZITVh3fSBPYtMEjh8MBVSPL0dKBoUstQZh43um0OmccY3W4HdIawKn00htkFIruv');

interface PaymentFormProps {
  onSuccess: () => void;
  role: 'client' | 'pro';
}

const CheckoutForm: React.FC<PaymentFormProps> = ({ onSuccess, role }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    // Dans une app réelle, vous appelleriez votre backend ici pour créer un PaymentIntent
    // et obtenir le client_secret.
    // const { client_secret } = await fetch('/api/create-payment-intent').then(r => r.json());

    // Pour cette démo, on simule un délai de traitement et une réussite via l'API Stripe "Token"
    // qui est une méthode plus ancienne mais qui fonctionne pour tester l'intégration front sans backend complexe.
    
    const cardElement = elements.getElement(CardElement);
    
    if (cardElement) {
        const { error, token } = await stripe.createToken(cardElement);

        if (error) {
            setError(error.message || "Une erreur est survenue");
            setLoading(false);
        } else {
            console.log("Stripe Token:", token);
            // Simulation de succès
            setTimeout(() => {
                setLoading(false);
                onSuccess();
            }, 1500);
        }
    }
  };

  const amount = role === 'pro' ? '29.99' : '9.99';
  const planName = role === 'pro' ? 'Abonnement Professionnel' : 'Adhésion Membre Gold';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
         <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total à payer</span>
            <span className="text-xl font-bold text-gray-900">{amount} €</span>
         </div>
         <div className="text-xs text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-green-600" /> Paiement sécurisé SSL
         </div>
         <div className="mt-2 text-sm font-medium text-[#1E90FF]">{planName}</div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Informations de carte</label>
        <div className="p-4 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#1E90FF]/20 focus-within:border-[#1E90FF] transition-all">
          <CardElement 
            options={{
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                    invalid: {
                        color: '#9e2146',
                    },
                },
                hidePostalCode: true
            }} 
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-xs bg-red-50 p-2 rounded flex items-center gap-2">
            <span className="font-bold">Erreur :</span> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#1E90FF] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
                <Lock className="w-4 h-4" /> Payer {amount} €
            </>
        )}
      </button>
      
      <div className="flex justify-center gap-2 mt-4">
          <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">VISA</div>
          <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">MC</div>
          <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">AMEX</div>
      </div>
    </form>
  );
};

export const PaymentScreen: React.FC<{ onSuccess: () => void, role: 'client' | 'pro' }> = ({ onSuccess, role }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-[#1E90FF] p-6 text-center text-white">
             <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-xl font-bold">Finaliser l'inscription</h2>
             <p className="text-blue-100 text-sm">Activez votre compte {role === 'pro' ? 'Professionnel' : 'Membre'}</p>
          </div>
          
          <div className="p-8">
             <Elements stripe={stripePromise}>
                <CheckoutForm onSuccess={onSuccess} role={role} />
             </Elements>
          </div>
       </div>
    </div>
  );
};