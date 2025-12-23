from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from config.supabase import get_supabase_client
from gotrue.errors import AuthApiError

router = APIRouter()


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user: dict
    session: dict
    message: str


@router.post("/signup", response_model=AuthResponse)
async def sign_up(payload: SignUpRequest):
    """
    Register a new user with Supabase Auth
    """
    try:
        supabase = get_supabase_client()
        
        # Sign up user with Supabase Auth
        response = supabase.auth.sign_up({
            "email": payload.email,
            "password": payload.password,
            "options": {
                "data": {
                    "name": payload.name
                }
            }
        })
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account"
            )
        
        return AuthResponse(
            user={
                "id": response.user.id,
                "email": response.user.email,
                "name": payload.name
            },
            session={
                "access_token": response.session.access_token if response.session else None,
                "refresh_token": response.session.refresh_token if response.session else None
            },
            message="User registered successfully. Please check your email for verification."
        )
        
    except AuthApiError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/signin", response_model=AuthResponse)
async def sign_in(payload: SignInRequest):
    """
    Sign in an existing user with Supabase Auth
    """
    try:
        supabase = get_supabase_client()
        
        # Sign in with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password
        })
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Get user profile from database
        profile_response = supabase.table("user_profiles").select("*").eq("id", response.user.id).execute()
        
        user_data = {
            "id": response.user.id,
            "email": response.user.email,
            "name": profile_response.data[0]["name"] if profile_response.data else response.user.email.split("@")[0]
        }
        
        return AuthResponse(
            user=user_data,
            session={
                "access_token": response.session.access_token if response.session else None,
                "refresh_token": response.session.refresh_token if response.session else None
            },
            message="Signed in successfully"
        )
        
    except AuthApiError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sign in failed: {str(e)}"
        )


@router.post("/signout")
async def sign_out():
    """
    Sign out the current user
    """
    try:
        supabase = get_supabase_client()
        supabase.auth.sign_out()
        
        return {"message": "Signed out successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sign out failed: {str(e)}"
        )


@router.get("/user")
async def get_current_user(access_token: str):
    """
    Get the current authenticated user
    """
    try:
        supabase = get_supabase_client()
        
        # Get user from access token
        user_response = supabase.auth.get_user(access_token)
        
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        # Get user profile
        profile_response = supabase.table("user_profiles").select("*").eq("id", user_response.user.id).execute()
        
        user_data = {
            "id": user_response.user.id,
            "email": user_response.user.email,
            "name": profile_response.data[0]["name"] if profile_response.data else user_response.user.email.split("@")[0]
        }
        
        return {"user": user_data}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to get user: {str(e)}"
        )





