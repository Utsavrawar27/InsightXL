import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Development mode flag
const isDevelopmentMode = !supabaseUrl || !supabaseAnonKey;

if (isDevelopmentMode) {
  console.warn(
    "⚠️  Running in DEVELOPMENT MODE without Supabase. Authentication is mocked.\n" +
    "To use real authentication, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env file"
  );
}

// Create Supabase client (or use dummy values for development)
export const supabase = createClient(
  supabaseUrl || "https://dummy.supabase.co",
  supabaseAnonKey || "dummy-anon-key",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Development mode mock storage
const mockUsers = new Map<string, { email: string; password: string; name: string; id: string }>();
let mockSession: any = null;

// Auth helper functions
export const authHelpers = {
  // Sign up a new user
  signUp: async (email: string, password: string, name: string) => {
    if (isDevelopmentMode) {
      // Mock signup for development
      const userId = `user_${Date.now()}`;
      mockUsers.set(email, { email, password, name, id: userId });
      
      mockSession = {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
      };
      
      localStorage.setItem('mock_user', JSON.stringify({ email, name, id: userId }));
      localStorage.setItem('mock_session', JSON.stringify(mockSession));
      
      return {
        user: { email, id: userId, user_metadata: { name } },
        session: mockSession,
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign in an existing user
  signIn: async (email: string, password: string) => {
    if (isDevelopmentMode) {
      // Mock signin for development
      const mockUser = mockUsers.get(email);
      
      // Accept any password in dev mode for ease of testing
      const userId = mockUser?.id || `user_${Date.now()}`;
      const userName = mockUser?.name || email.split('@')[0];
      
      // Store user if not exists
      if (!mockUser) {
        mockUsers.set(email, { email, password, name: userName, id: userId });
      }
      
      mockSession = {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
      };
      
      localStorage.setItem('mock_user', JSON.stringify({ email, name: userName, id: userId }));
      localStorage.setItem('mock_session', JSON.stringify(mockSession));
      
      return {
        user: { email, id: userId, user_metadata: { name: userName } },
        session: mockSession,
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    if (isDevelopmentMode) {
      mockSession = null;
      localStorage.removeItem('mock_user');
      localStorage.removeItem('mock_session');
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: async () => {
    if (isDevelopmentMode) {
      const mockUser = localStorage.getItem('mock_user');
      if (mockUser) {
        const userData = JSON.parse(mockUser);
        return {
          email: userData.email,
          id: userData.id,
          user_metadata: { name: userData.name },
        };
      }
      return null;
    }
    
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  },

  // Get user profile from database
  getUserProfile: async (userId: string) => {
    if (isDevelopmentMode) {
      const mockUser = localStorage.getItem('mock_user');
      if (mockUser) {
        const userData = JSON.parse(mockUser);
        return {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        };
      }
      return null;
    }
    
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: { name?: string }) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get current session
  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    return session;
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    if (isDevelopmentMode) {
      console.warn("Google OAuth not available in development mode. Use email/password instead.");
      throw new Error("Google OAuth is not available in development mode without Supabase setup");
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },
};

// Export development mode flag for other components to use
export { isDevelopmentMode };





