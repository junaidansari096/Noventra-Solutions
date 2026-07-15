from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import ContactSubmission
from app.schemas import ContactSubmissionCreate, ContactSubmissionResponse, ContactSubmissionUpdate
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/contacts", tags=["Contact Submissions"])

@router.post("/", response_model=ContactSubmissionResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(contact_in: ContactSubmissionCreate, db: Session = Depends(get_db)):
    db_contact = ContactSubmission(**contact_in.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.get("/", response_model=List[ContactSubmissionResponse])
def get_all_contacts(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    return db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).all()

@router.put("/{contact_id}", response_model=ContactSubmissionResponse)
def update_contact_status(contact_id: int, contact_in: ContactSubmissionUpdate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    contact = db.query(ContactSubmission).filter(ContactSubmission.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact submission not found")
    
    contact.status = contact_in.status
    db.commit()
    db.refresh(contact)
    return contact

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    contact = db.query(ContactSubmission).filter(ContactSubmission.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact submission not found")
        
    db.delete(contact)
    db.commit()
    return None
