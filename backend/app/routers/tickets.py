from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import SupportTicket, ChatMessage, User
from app.schemas import SupportTicketCreate, SupportTicketResponse, SupportTicketDetailsResponse, ChatMessageCreate, ChatMessageResponse
from app.routers.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/tickets", tags=["Support Tickets & Chat"])

# List tickets
@router.get("/", response_model=List[SupportTicketResponse])
def get_my_tickets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "admin":
        return db.query(SupportTicket).all()
    return db.query(SupportTicket).filter(SupportTicket.customer_id == current_user.id).all()

# Get single ticket details (including messages)
@router.get("/{ticket_id}", response_model=SupportTicketDetailsResponse)
def get_ticket_details(ticket_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Restrict if not owner and not admin
    if current_user.role != "admin" and ticket.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this ticket")
        
    return ticket

# Create ticket
@router.post("/", response_model=SupportTicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(ticket_in: SupportTicketCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_ticket = SupportTicket(
        customer_id=current_user.id,
        subject=ticket_in.subject,
        status="Open"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

# Send chat message inside ticket
@router.post("/{ticket_id}/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
def send_chat_message(ticket_id: int, message_in: ChatMessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    # Restrict message sending
    if current_user.role != "admin" and ticket.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to message on this ticket")
        
    db_message = ChatMessage(
        ticket_id=ticket.id,
        sender_id=current_user.id,
        message=message_in.message
    )
    db.add(db_message)
    # If customer sends message, set ticket status to Open (needs attention)
    # If admin sends, set to In Progress / answered
    if current_user.role == "admin":
        ticket.status = "In Progress"
    else:
        ticket.status = "Open"
        
    db.commit()
    db.refresh(db_message)
    return db_message

# Resolve ticket (Admin/Customer)
@router.put("/{ticket_id}/resolve", response_model=SupportTicketResponse)
def resolve_ticket(ticket_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    if current_user.role != "admin" and ticket.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    ticket.status = "Resolved"
    db.commit()
    db.refresh(ticket)
    return ticket
