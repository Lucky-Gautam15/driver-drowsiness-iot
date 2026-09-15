import os
from pathlib import Path

# Load environment variables
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path.exists():
    try:
        from dotenv import load_dotenv
        load_dotenv(env_path)
    except ImportError:
        pass

PORT = int(os.getenv("PORT", 8000))
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000/api")

# Drowsiness detection parameters
EAR_THRESHOLD = float(os.getenv("EAR_THRESHOLD", 0.22))
MAR_THRESHOLD = float(os.getenv("MAR_THRESHOLD", 0.60))
MAX_CLOSED_FRAMES = int(os.getenv("MAX_CLOSED_FRAMES", 15))
ALERT_COOLDOWN_SECONDS = float(os.getenv("ALERT_COOLDOWN_SECONDS", 4.0))
