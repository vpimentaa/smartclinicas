'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Account, UserRole } from '@/lib/supabase';

type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  account: Account | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAccount: (name: string, email: string) => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Get user's account and role
      const fetchUserData = async () => {
        try {
          const { data: accountsUsers, error } = await supabase
            .from('accounts_users')
            .select('account_id, role')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          if (accountsUsers) {
            setRole(accountsUsers.role as UserRole);

            const { data: accountData, error: accountError } = await supabase
              .from('accounts')
              .select('*')
              .eq('id', accountsUsers.account_id)
              .single();

            if (accountError) throw accountError;
            setAccount(accountData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    } else {
      setAccount(null);
      setRole(null);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const createAccount = async (name: string, email: string) => {
    if (!user) throw new Error('User must be authenticated to create an account');

    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .insert([{ name, email }])
      .select()
      .single();

    if (accountError) throw accountError;

    const { error: accountsUsersError } = await supabase
      .from('accounts_users')
      .insert([{ account_id: account.id, user_id: user.id, role: 'owner' }]);

    if (accountsUsersError) throw accountsUsersError;

    setAccount(account);
    setRole('owner');
  };

  const value = {
    user,
    session,
    account,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    createAccount,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {!loading && children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
} 