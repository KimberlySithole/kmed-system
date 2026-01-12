from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import Union
import logging
import traceback
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class KMEDException(Exception):
    """Custom exception for KMED application"""
    def __init__(self, message: str, error_code: str = None, details: dict = None):
        self.message = message
        self.error_code = error_code or "INTERNAL_ERROR"
        self.details = details or {}
        super().__init__(self.message)

class AuthenticationError(KMEDException):
    """Authentication related errors"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "AUTH_ERROR", details)

class AuthorizationError(KMEDException):
    """Authorization related errors"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "AUTHZ_ERROR", details)

class ValidationError(KMEDException):
    """Validation related errors"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "VALIDATION_ERROR", details)

class DatabaseError(KMEDException):
    """Database related errors"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "DATABASE_ERROR", details)

class BusinessLogicError(KMEDException):
    """Business logic related errors"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "BUSINESS_ERROR", details)


async def kmed_exception_handler(request: Request, exc: KMEDException):
    """Handle custom KMED exceptions"""
    logger.error(f"KMED Exception: {exc.error_code} - {exc.message}")
    logger.error(f"Details: {exc.details}")
    logger.error(f"Request: {request.method} {request.url}")
    
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
                "timestamp": time.time(),
                "path": str(request.url.path),
                "method": request.method
            }
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    logger.warning(f"Request: {request.method} {request.url}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail,
                "timestamp": time.time(),
                "path": str(request.url.path),
                "method": request.method
            }
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation exceptions"""
    logger.warning(f"Validation Error: {exc.errors()}")
    logger.warning(f"Request: {request.method} {request.url}")
    
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request data",
                "details": {
                    "validation_errors": exc.errors()
                },
                "timestamp": time.time(),
                "path": str(request.url.path),
                "method": request.method
            }
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions"""
    logger.error(f"Unhandled Exception: {type(exc).__name__} - {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    logger.error(f"Request: {request.method} {request.url}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again later.",
                "timestamp": time.time(),
                "path": str(request.url.path),
                "method": request.method
            }
        }
    )


def setup_error_handlers(app):
    """Setup all error handlers for the FastAPI app"""
    app.add_exception_handler(KMEDException, kmed_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)


# Error response utilities
def create_error_response(code: str, message: str, details: dict = None, status_code: int = 400):
    """Create standardized error response"""
    return {
        "error": {
            "code": code,
            "message": message,
            "details": details or {},
            "timestamp": time.time()
        }
    }


def create_success_response(data: any = None, message: str = "Operation successful"):
    """Create standardized success response"""
    response = {
        "success": True,
        "message": message,
        "timestamp": time.time()
    }
    
    if data is not None:
        response["data"] = data
    
    return response


# Logging utilities
def log_api_request(request: Request, user_id: str = None):
    """Log API request"""
    logger.info(f"API Request: {request.method} {request.url.path} - User: {user_id or 'anonymous'}")


def log_api_response(request: Request, status_code: int, user_id: str = None):
    """Log API response"""
    logger.info(f"API Response: {request.method} {request.url.path} - Status: {status_code} - User: {user_id or 'anonymous'}")


def log_business_action(action: str, user_id: str, resource_id: str = None, details: dict = None):
    """Log business actions for audit trail"""
    logger.info(f"Business Action: {action} - User: {user_id} - Resource: {resource_id or 'N/A'} - Details: {details or {}}")


def log_security_event(event: str, user_id: str = None, ip_address: str = None, details: dict = None):
    """Log security events"""
    logger.warning(f"Security Event: {event} - User: {user_id or 'anonymous'} - IP: {ip_address or 'N/A'} - Details: {details or {}}")


def log_system_error(error: str, context: dict = None):
    """Log system errors"""
    logger.error(f"System Error: {error} - Context: {context or {}}")
