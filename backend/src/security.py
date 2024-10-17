# src/security.py
import json
from cryptography.fernet import Fernet
from src.config import settings

# Убедитесь, что ключ шифрования является валидным Fernet ключом
encryption_key = settings.encryption_key.encode()
cipher_suite = Fernet(encryption_key)

def encrypt_payload(payload: dict) -> bytes:
    payload_json = json.dumps(payload).encode()
    return cipher_suite.encrypt(payload_json)

def decrypt_payload(encrypted_payload: bytes) -> dict:
    decrypted_payload = cipher_suite.decrypt(encrypted_payload).decode()
    return json.loads(decrypted_payload)