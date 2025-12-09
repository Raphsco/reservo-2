import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Provider } from '../types';
import { MOCK_PROVIDERS } from '../constants';

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        
        // Appel réel à Supabase
        const { data, error: supabaseError } = await supabase
          .from('providers')
          .select('*');

        if (supabaseError) throw supabaseError;

        if (data && data.length > 0) {
          // On assume que la structure BDD correspond à l'interface Provider
          // Dans un cas réel, on mapperait les champs ici si nécessaire
          setProviders(data as unknown as Provider[]);
        } else {
          // Fallback si la table est vide pour la démo
          console.warn("Table 'providers' vide ou inexistante, utilisation des mocks.");
          setProviders(MOCK_PROVIDERS);
        }
      } catch (err: any) {
        console.error('Erreur Supabase:', err.message);
        setError(err.message);
        // Fallback gracieux sur les mocks en cas d'erreur de connexion/config
        setProviders(MOCK_PROVIDERS);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return { providers, loading, error };
};