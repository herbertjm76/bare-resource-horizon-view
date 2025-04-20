
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6">
          Professional Account Dashboard
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Projects</h2>
            <p className="text-white/80">Manage and track your unlimited projects</p>
          </div>
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Team</h2>
            <p className="text-white/80">Collaborate with up to 50 team members</p>
          </div>
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Analytics</h2>
            <p className="text-white/80">Access advanced performance insights</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
