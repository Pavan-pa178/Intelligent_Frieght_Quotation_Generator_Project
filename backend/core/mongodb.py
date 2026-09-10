import os
import time
import logging
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/freight_db')
DB_NAME = os.getenv('MONGO_DB_NAME', 'freight_db')

logger = logging.getLogger(__name__)

_mongo_client = None
_mongo_db = None
_last_failed_attempt = 0
_COOLDOWN_SECONDS = 60

def get_mongo_db():
    """
    Returns MongoDB database instance using PyMongo.
    Gracefully handles connection attempts with fast failover so HTTP requests are never blocked.
    """
    global _mongo_client, _mongo_db, _last_failed_attempt
    if _mongo_db is not None:
        return _mongo_db

    # If recent connection attempt failed, fail fast during cooldown
    now = time.time()
    if now - _last_failed_attempt < _COOLDOWN_SECONDS:
        return None

    try:
        from pymongo import MongoClient
        _mongo_client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=1500,
            connectTimeoutMS=1500,
            socketTimeoutMS=2000
        )
        # Fast test connection
        _mongo_client.admin.command('ping')
        _mongo_db = _mongo_client[DB_NAME]
        logger.info(f"Connected successfully to MongoDB database: {DB_NAME}")
        return _mongo_db
    except Exception as e:
        _last_failed_attempt = time.time()
        logger.warning(f"MongoDB connection notice (will retry after {_COOLDOWN_SECONDS}s): {e}. Using persistent local disk storage.")
        return None

def get_collection(collection_name: str):
    db = get_mongo_db()
    if db is not None:
        return db[collection_name]
    return None
