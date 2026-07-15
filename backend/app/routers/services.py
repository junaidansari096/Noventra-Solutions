from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Service
from app.schemas import ServiceCreate, ServiceResponse
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("/", response_model=List[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).filter(Service.is_active == True).all()

@router.get("/all", response_model=List[ServiceResponse])
def get_all_services_admin(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    return db.query(Service).all()

@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(service_in: ServiceCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    db_service = Service(**service_in.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(service_id: int, service_in: ServiceCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    for key, value in service_in.model_dump().items():
        setattr(service, key, value)
        
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db.delete(service)
    db.commit()
    return None
