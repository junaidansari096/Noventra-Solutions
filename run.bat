@echo off
echo ==========================================
echo       Noventra Solutions Launch Pad
echo ==========================================

echo [1/4] Checking and installing Python dependencies...
cd backend
python -m pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo Python dependencies installation failed. Make sure Python is in your PATH.
    pause
    exit /b
)

echo [2/4] Initializing Database with Seed Data...
python seed.py
if %ERRORLEVEL% neq 0 (
    echo Database seeding failed.
    pause
    exit /b
)

echo [3/4] Checking and installing Node dependencies (Next.js 15)...
cd ../frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo Frontend npm install failed.
    pause
    exit /b
)

echo [4/4] Starting servers...
echo Starting FastAPI Backend on http://localhost:8000
start cmd /k "cd ../backend && python -m uvicorn app.main:app --reload --port 8000"

echo Starting Next.js Frontend on http://localhost:3000
start cmd /k "cd ../frontend && npm run dev"

echo ==========================================
echo   Noventra Solutions is running successfully!
echo   Frontend: http://localhost:3000
echo   Backend APIs: http://localhost:8000
echo   OpenAPI Docs: http://localhost:8000/docs
echo ==========================================
pause
