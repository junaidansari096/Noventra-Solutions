import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="customer", nullable=False)  # "admin", "customer", "visitor"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    customer_projects = relationship("CustomerProject", back_populates="customer")
    tickets = relationship("SupportTicket", back_populates="customer")

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price_range = Column(String, nullable=False)  # e.g., "$500 - $1500"
    icon = Column(String, nullable=False)         # Lucide icon name, e.g., "Code", "Globe"
    features = Column(JSON, nullable=False)       # List of strings
    is_active = Column(Boolean, default=True)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    client_name = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=False)
    preview_url = Column(String, nullable=True)
    tech_stack = Column(JSON, nullable=False)     # List of strings
    category = Column(String, nullable=False)     # "Web Design", "Hosting", "Maintenance"
    featured = Column(Boolean, default=False)

class CustomerProject(Base):
    __tablename__ = "customer_projects"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    progress_percent = Column(Integer, default=0, nullable=False)
    status = Column(String, default="Planning", nullable=False) # Planning, Designing, Development, Testing, Deploying, Completed
    milestones = Column(JSON, nullable=True) # Dict of milestone name -> boolean or percentage
    domain = Column(String, nullable=True)
    hosting_status = Column(String, nullable=True) # "Active", "Pending", "None"
    renewal_date = Column(String, nullable=True)

    # Relationships
    customer = relationship("User", back_populates="customer_projects")

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    cover_image = Column(String, nullable=False)
    author_name = Column(String, default="Noventra Team", nullable=False)
    tags = Column(JSON, nullable=False)           # List of strings
    published_at = Column(DateTime, default=datetime.datetime.utcnow)

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    status = Column(String, default="Open", nullable=False) # "Open", "In Progress", "Resolved"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="tickets")
    messages = relationship("ChatMessage", back_populates="ticket", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("support_tickets.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    ticket = relationship("SupportTicket", back_populates="messages")

class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)        # e.g., "Summer Launch Sale"
    discount_percentage = Column(Integer, nullable=False) # e.g., 30
    ends_at = Column(String, nullable=False)      # ISO string or date string, e.g., "2026-08-31T23:59:59Z"
    is_active = Column(Boolean, default=True)
    coupon_code = Column(String, nullable=False)  # e.g., "NOVENTRA30"

class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String, default="New", nullable=False) # "New", "Read", "Replied"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
