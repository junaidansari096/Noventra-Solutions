from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# Service Schemas
class ServiceBase(BaseModel):
    title: str
    description: str
    price_range: str
    icon: str
    features: List[str]
    is_active: Optional[bool] = True

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True

# Project (Portfolio) Schemas
class ProjectBase(BaseModel):
    title: str
    client_name: Optional[str] = None
    description: str
    image_url: str
    preview_url: Optional[str] = None
    tech_stack: List[str]
    category: str
    featured: Optional[bool] = False

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True

# Customer Project (Milestone tracking) Schemas
class CustomerProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    progress_percent: int = 0
    status: str = "Planning"
    milestones: Optional[Dict[str, Any]] = None
    domain: Optional[str] = None
    hosting_status: Optional[str] = "None"
    renewal_date: Optional[str] = None

class CustomerProjectCreate(CustomerProjectBase):
    customer_id: int

class CustomerProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    progress_percent: Optional[int] = None
    status: Optional[str] = None
    milestones: Optional[Dict[str, Any]] = None
    domain: Optional[str] = None
    hosting_status: Optional[str] = None
    renewal_date: Optional[str] = None

class CustomerProjectResponse(CustomerProjectBase):
    id: int
    customer_id: int
    customer: UserResponse

    class Config:
        from_attributes = True

# Blog Schemas
class BlogBase(BaseModel):
    title: str
    content: str
    summary: str
    cover_image: str
    author_name: Optional[str] = "Noventra Team"
    tags: List[str]

class BlogCreate(BlogBase):
    pass

class BlogResponse(BlogBase):
    id: int
    published_at: datetime

    class Config:
        from_attributes = True

# Chat Message Schemas
class ChatMessageBase(BaseModel):
    message: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: int
    ticket_id: int
    sender_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Support Ticket Schemas
class SupportTicketBase(BaseModel):
    subject: str

class SupportTicketCreate(SupportTicketBase):
    pass

class SupportTicketResponse(SupportTicketBase):
    id: int
    customer_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class SupportTicketDetailsResponse(SupportTicketResponse):
    messages: List[ChatMessageResponse] = []
    customer: UserResponse

    class Config:
        from_attributes = True

# Offer (Sale campaign) Schemas
class OfferBase(BaseModel):
    title: str
    discount_percentage: int
    ends_at: str
    is_active: Optional[bool] = True
    coupon_code: str

class OfferCreate(OfferBase):
    pass

class OfferUpdate(BaseModel):
    title: Optional[str] = None
    discount_percentage: Optional[int] = None
    ends_at: Optional[str] = None
    is_active: Optional[bool] = None
    coupon_code: Optional[str] = None

class OfferResponse(OfferBase):
    id: int

    class Config:
        from_attributes = True

# Contact Submission Schemas
class ContactSubmissionBase(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactSubmissionCreate(ContactSubmissionBase):
    pass

class ContactSubmissionUpdate(BaseModel):
    status: str

class ContactSubmissionResponse(ContactSubmissionBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
