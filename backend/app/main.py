from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.database import engine, Base
from app.routers import auth, services, projects, customer_projects, tickets, offers, blogs, contacts

# Initialize database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Noventra Solutions API",
    description="Backend services for Noventra Solutions Agency",
    version="1.0.0"
)

# CORS setup for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global custom exception handling for structured error codes
@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_code": "INTERNAL_SERVER_ERROR",
            "detail": f"An unexpected error occurred: {str(exc)}"
        }
    )

@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error_code": "VALIDATION_ERROR",
            "detail": "Input validation failed",
            "errors": [{"field": " -> ".join([str(p) for p in err["loc"]]), "message": err["msg"]} for err in errors]
        }
    )

@app.exception_handler(SQLAlchemyError)
def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_code": "DATABASE_ERROR",
            "detail": "A database operation failed. Please check logs."
        }
    )

# Basic sanity check
@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Noventra Solutions API",
        "docs": "/docs"
    }

# Include modular API routers
app.include_router(auth.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(customer_projects.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(offers.router, prefix="/api")
app.include_router(blogs.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")
