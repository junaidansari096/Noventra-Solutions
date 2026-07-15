from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Blog
from app.schemas import BlogCreate, BlogResponse
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/blogs", tags=["Blog CMS"])

@router.get("/", response_model=List[BlogResponse])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).order_by(Blog.published_at.desc()).all()

@router.get("/{blog_id}", response_model=BlogResponse)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@router.post("/", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
def create_blog(blog_in: BlogCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    db_blog = Blog(**blog_in.model_dump())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(blog_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db.delete(blog)
    db.commit()
    return None
