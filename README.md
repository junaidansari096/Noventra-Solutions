# Noventra Solutions agency frontend & backend

This project consists of a modernized Next.js 15 frontend styled using the Stitch Design System, paired with a FastAPI backend.

## Project Structure
- `/frontend` - Next.js 15 client portal, admin dashboard, careers, and services modules.
- `/backend` - FastAPI backend handling authentication, ticket chat messaging, database seed, and tracking APIs.

---

## Local Development

### 1. Backend Setup
1. Move to `/backend`.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the seed script to create and populate the local SQLite database (`noventra.db`):
   ```bash
   python seed.py
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

### 2. Frontend Setup
1. Move to `/frontend`.
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Production Deployment Guide

### 1. Frontend: Deploying to Vercel
Vercel is the recommended hosting platform for Next.js. Since the frontend is in a subdirectory, configure the following settings during import:

1. **Import the Repository**: Connect your GitHub account to Vercel and select `Noventra-Solutions`.
2. **Configure Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build & Development Settings**: Leave as default.
3. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` and set its value to your deployed FastAPI backend URL (e.g. `https://your-backend-service.onrender.com`).
4. **Deploy**: Click "Deploy". Vercel will build and serve your frontend.

### 2. Backend: Deploying to Render / Railway
Because the backend uses SQLite and persistent state, you should deploy it to a platform that supports persistent disks (like Render or Railway) or configure an external PostgreSQL database.

#### Hosting on Render:
1. Click **New** -> **Web Service** on Render.
2. Select your repository.
3. Configure the following:
   - **Runtime**: Python
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
   - **Build Command**: `pip install -r requirements.txt && python seed.py`
4. Go to the **Environment** tab and add the variables:
   - `SECRET_KEY`: Set to a strong random key (e.g., `openssl rand -hex 32`).
   - `DATABASE_URL`: Defaults to `sqlite:///./noventra.db`. (If using PostgreSQL, provide your connection URI).
5. (Optional) To persist the SQLite database between restarts, mount a persistent Disk at `/data` and update your `DATABASE_URL` environment variable to `sqlite:////data/noventra.db`.
