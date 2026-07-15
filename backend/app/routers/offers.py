from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Offer
from app.schemas import OfferCreate, OfferResponse, OfferUpdate
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/offers", tags=["Active Offers & Sales"])

@router.get("/", response_model=List[OfferResponse])
def get_offers(db: Session = Depends(get_db)):
    return db.query(Offer).filter(Offer.is_active == True).all()

@router.get("/all", response_model=List[OfferResponse])
def get_all_offers_admin(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    return db.query(Offer).all()

@router.post("/", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
def create_offer(offer_in: OfferCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    db_offer = Offer(**offer_in.model_dump())
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer

@router.put("/{offer_id}", response_model=OfferResponse)
def update_offer(offer_id: int, offer_in: OfferUpdate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    for key, value in offer_in.model_dump(exclude_unset=True).items():
        setattr(offer, key, value)
        
    db.commit()
    db.refresh(offer)
    return offer

@router.delete("/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_offer(offer_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    db.delete(offer)
    db.commit()
    return None
