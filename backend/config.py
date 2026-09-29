"""
Configuration module for ReviewMind.

Loads environment variables using python-dotenv and provides
configuration settings for the application.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Get the directory where this config.py file is located
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env file in the same directory as config.py
load_dotenv(BASE_DIR / ".env")


class Settings:
    """
    Application settings loaded from environment variables.
    """
    
    # Hindsight API Configuration
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "")
    HINDSIGHT_BASE_URL: str = os.getenv("HINDSIGHT_BASE_URL", "")
    
    # Groq LLM Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "")
    
    # Team Configuration
    TEAM_ID: str = os.getenv("TEAM_ID", "")


# Create a global settings instance
settings = Settings()
