import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# Initialize Supabase client
supabase: Client | None = None
supabase_admin: Client | None = None

if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("[OK] Supabase client initialized")
else:
    print("[WARNING] Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_KEY in .env")

# Admin client with service role key for backend operations
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    print("[OK] Supabase admin client initialized")
else:
    print("[WARNING] Supabase service key not found. Some admin operations will not be available.")


def get_supabase_client() -> Client:
    """Get the Supabase client instance"""
    if supabase is None:
        raise Exception("Supabase client not initialized. Please check your environment variables.")
    return supabase


def get_supabase_admin() -> Client:
    """Get the Supabase admin client with service role"""
    if supabase_admin is None:
        raise Exception("Supabase admin client not initialized. Please check your SUPABASE_SERVICE_KEY.")
    return supabase_admin





