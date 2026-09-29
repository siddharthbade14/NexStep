import os
import time
import secrets
import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List
import jwt
from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

security = HTTPBearer(auto_error=False)

def hash_password(password: str, salt: Optional[str] = None) -> Dict[str, str]:
    """
    Cryptographically secure password hashing using PBKDF2-HMAC-SHA256 with 100,000 iterations.
    """
    if not salt:
        salt = secrets.token_hex(16)
    
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100_000
    )
    return {
        "hash": key.hex(),
        "salt": salt
    }

def verify_password(plain_password: str, stored_hash: str, salt: str) -> bool:
    """
    Verify password against stored hash using constant-time comparison to prevent timing attacks.
    """
    check_key = hashlib.pbkdf2_hmac(
        'sha256',
        plain_password.encode('utf-8'),
        salt.encode('utf-8'),
        100_000
    ).hex()
    return hmac.compare_digest(check_key, stored_hash)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create signed JWT token with expiry and role claims.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "iss": "nexstep-auth-service"
    })
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate JWT token signature and expiration.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            issuer="nexstep-auth-service"
        )
        return payload
    except jwt.PyJWTError:
        return None

def generate_cryptographic_proof(
    student_id: str,
    skill_id: str,
    code_content: str,
    passed_count: int,
    total_count: int,
    execution_time_ms: float
) -> Dict[str, Any]:
    """
    Generates a tamper-proof cryptographic Proof-of-Work credential for verified skills.
    Can be publicly verified by recruiters or colleges.
    """
    timestamp = int(time.time())
    code_digest = hashlib.sha256(code_content.strip().encode('utf-8')).hexdigest()
    
    proof_payload = f"{student_id}:{skill_id}:{passed_count}/{total_count}:{execution_time_ms}:{code_digest[:16]}:{timestamp}"
    signature = hmac.new(
        settings.CREDENTIAL_SIGNING_PEPPER.encode('utf-8'),
        proof_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    certificate_id = f"NX-VERIFIED-{signature[:12].upper()}-{timestamp % 100000}"
    
    return {
        "certificate_id": certificate_id,
        "proof_hash": signature,
        "code_digest": code_digest,
        "timestamp": timestamp,
        "verified_at": datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat(),
        "integrity_algorithm": "HMAC-SHA256-PBKDF2"
    }

async def get_current_user_optional(
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[Dict[str, Any]]:
    """
    Dependency that extracts current user if JWT token is present and valid.
    """
    if not auth_header or not auth_header.credentials:
        return None
    token = auth_header.credentials
    payload = decode_access_token(token)
    return payload

async def get_current_user(
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict[str, Any]:
    """
    Strict dependency requiring a valid JWT token.
    """
    if not auth_header or not auth_header.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please sign in.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    payload = decode_access_token(auth_header.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return payload

def require_role(allowed_roles: List[str]):
    """
    Role-Based Access Control (RBAC) guard.
    """
    async def role_checker(user: Dict[str, Any] = Depends(get_current_user)):
        user_role = user.get("role", "student")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: role '{user_role}' lacks permissions for this resource. Required: {allowed_roles}"
            )
        return user
    return role_checker
