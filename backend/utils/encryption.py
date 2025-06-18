import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import secrets
import base64

# The AES-GCM encryption key for user/ticket secure key generation must be set as 
# environment variable TICKET_ENCRYPTION_KEY (base64-encoded 32 bytes).
TICKET_ENCRYPTION_KEY = os.getenv("TICKET_ENCRYPTION_KEY")
if TICKET_ENCRYPTION_KEY is None:
    raise RuntimeError("TICKET_ENCRYPTION_KEY environment variable not set")

# Convert from base64 (if you stock it in base64 for easy env management)
key_bytes = base64.b64decode(TICKET_ENCRYPTION_KEY)

def generate_and_encrypt_key(length: int = 32) -> str:
    """
    Generates a random key and encrypts it using AES-GCM.
    The encryption key is loaded from environment variable TICKET_ENCRYPTION_KEY.
    Returns a base64-encoded string containing nonce + ciphertext + tag.
    """
    raw_key = secrets.token_bytes(length)
    aesgcm = AESGCM(key_bytes)
    nonce = secrets.token_bytes(12)
    ciphertext = aesgcm.encrypt(nonce, raw_key, None)
    encrypted = nonce + ciphertext
    return base64.b64encode(encrypted).decode('utf-8')


def decrypt_key(encrypted_key_b64: str) -> bytes:
    """
    Decrypts a key previously encrypted with generate_and_encrypt_key().
    Args:
        encrypted_key_b64 (str): The base64 string containing nonce + ciphertext + tag.
    Returns:
        bytes: The original random key (raw bytes).
    """
    encrypted = base64.b64decode(encrypted_key_b64)
    nonce = encrypted[:12]  # AES-GCM nonce is 12 bytes
    ciphertext = encrypted[12:]
    aesgcm = AESGCM(key_bytes)
    raw_key = aesgcm.decrypt(nonce, ciphertext, None)
    return raw_key
