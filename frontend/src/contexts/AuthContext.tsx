import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, authHelpers } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (session?.user) {
        await loadUserProfile(session.user);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const session = await authHelpers.getSession();
      
      if (session?.user) {
        await loadUserProfile(session.user);
        setSession(session);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (authUser: User) => {
    try {
      const profile = await authHelpers.getUserProfile(authUser.id);
      
      setUser({
        id: authUser.id,
        email: authUser.email || "",
        name: profile?.name || authUser.email?.split("@")[0] || "User",
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Fallback to auth user data if profile doesn't exist
      setUser({
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.email?.split("@")[0] || "User",
      });
    }
  };

  const signOut = async () => {
    try {
      await authHelpers.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};





