from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import CustomerProject, User
from app.schemas import CustomerProjectCreate, CustomerProjectUpdate, CustomerProjectResponse
from app.routers.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/customer-projects", tags=["Customer Website Tracking"])

# Get logged-in customer's projects
@router.get("/me", response_model=List[CustomerProjectResponse])
def get_my_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Admins see all, customers see only theirs
    if current_user.role == "admin":
        return db.query(CustomerProject).all()
    return db.query(CustomerProject).filter(CustomerProject.customer_id == current_user.id).all()

# Admin endpoints
@router.get("/", response_model=List[CustomerProjectResponse])
def get_all_customer_projects(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(CustomerProject).all()

@router.post("/", response_model=CustomerProjectResponse, status_code=status.HTTP_201_CREATED)
def create_customer_project(project_in: CustomerProjectCreate, current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    # Verify customer exists
    customer = db.query(User).filter(User.id == project_in.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    db_project = CustomerProject(**project_in.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{project_id}", response_model=CustomerProjectResponse)
def update_customer_project(project_id: int, project_in: CustomerProjectUpdate, current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    project = db.query(CustomerProject).filter(CustomerProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Customer project tracking not found")
        
    for key, value in project_in.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
        
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer_project(project_id: int, current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    project = db.query(CustomerProject).filter(CustomerProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Customer project tracking not found")
        
    db.delete(project)
    db.commit()
    return None
