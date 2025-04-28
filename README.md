<img width="1429" alt="Screenshot 2025-04-28 at 9 56 27 AM" src="https://github.com/user-attachments/assets/c002e286-a174-4879-83d9-bb4ddd10ff32" />
<img width="1429" alt="Screenshot 2025-04-28 at 9 56 17 AM" src="https://github.com/user-attachments/assets/26a8285d-9cb0-4212-9852-93baeee0215f" />
<img width="1429" alt="Screenshot 2025-04-28 at 9 55 33 AM" src="https://github.com/user-attachments/assets/d9df0501-d325-46cd-9a7a-8a52a2a3ddd1" />
<img width="1429" alt="Screenshot 2025-04-28 at 9 55 23 AM" src="https://github.com/user-attachments/assets/71ac3acf-d511-4a37-8528-538be640b173" />
<img width="1429" alt="Screenshot 2025-04-28 at 9 54 54 AM" src="https://github.com/user-attachments/assets/0dc42bdb-5381-4d7d-bd3d-7d5b866c3f1d" />
<img width="1429" alt="Screenshot 2025-04-28 at 9 54 47 AM" src="https://github.com/user-attachments/assets/f8518d7b-1d6f-40da-9bb8-253ba69a4c0a" />
# Blogi

A full-stack blogging platform built with **Django REST Framework** (backend), **React** (frontend), and **PostgreSQL** (database). Includes JWT authentication, blog CRUD, image uploads, pagination, and Docker support.

---

## 🚀 Features
- User registration & login (JWT-based)
- Create, edit, delete your own blog posts
- List all blog posts with title, author, created/updated time
- Image upload for posts
- Pagination & search
- Responsive UI (Tailwind CSS)
- Dockerized for easy setup (with Compose)

---

## Running the Project

### Option 1: With Docker (Recommended)

1. **Build and start all services:**
   ```sh
   docker-compose up --build
   ```
2. **Run migrations:**
   ```sh
   docker-compose exec backend python manage.py migrate
   ```
3. **Create a superuser (optional):**
   ```sh
   docker-compose exec backend python manage.py createsuperuser
   ```
4. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)

---

### Option 2: Run Locally (Without Docker)

#### Backend (Django)
1. Install Python 3.11+
2. Create a virtualenv and activate it
3. Install dependencies:
   ```sh
   pip install -r backend/requirements.txt
   ```
4. Configure your database in `backend/blogi_backend/settings.py` (default is PostgreSQL, can use SQLite for quick start)
5. Run migrations:
   ```sh
   python backend/manage.py migrate
   ```
6. Start the server:
   ```sh
   python backend/manage.py runserver
   ```

#### Frontend (React)
1. Install Node.js 18+
2. In the `frontend` folder:
   ```sh
   npm install
   npm start
   ```
3. Make sure `REACT_APP_API_BASE_URL` in `frontend/.env` points to your backend (e.g., `http://localhost:8000/api`)

---

##  Environment Variables

- **Backend:**
  - `DATABASE_URL` (for Docker/PostgreSQL)
- **Frontend:**
  - `REACT_APP_API_BASE_URL`

---

## Project Structure
```
blogi/
├── backend/      # Django backend
├── frontend/     # React frontend
├── docker-compose.yml
├── README.md
```

