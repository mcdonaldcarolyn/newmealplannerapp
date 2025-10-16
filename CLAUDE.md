# Meal Planner Project - Context for Claude

## Project Overview

This is a full-stack meal planning application with a Django REST API backend and React frontend.

## Project Structure

```
meal-planner/
├── backend/          # Django REST API
│   ├── backend/      # Django project settings
│   ├── mealplan/     # Meal planning app
│   ├── pantry/       # Pantry management app
│   ├── venv/         # Python virtual environment
│   ├── manage.py     # Django management script
│   └── db.sqlite3    # SQLite database
└── frontend/         # React application
    ├── src/          # React source code
    ├── public/       # Static assets
    ├── build/        # Production build
    ├── .env          # Environment variables (Recipe API key)
    └── package.json  # Node dependencies
```

## Backend (Django)

### Technology Stack
- Django 5.2.5
- Django REST Framework
- SQLite database
- Token & JWT authentication
- CORS enabled for all origins

### Django Apps
- `pantry` - Pantry management functionality
- `mealplan` - Meal planning functionality

### Running the Backend

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Default URL: `http://localhost:8000`

### Common Django Commands

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Make migrations after model changes
python manage.py makemigrations
```

## Frontend (React)

### Technology Stack
- React 19.1.1
- React Router DOM 7.9.3
- Axios 1.12.2 (API calls)
- Create React App (react-scripts)

### Environment Variables
- `REACT_APP_RECIPE_API_KEY` - External recipe API key (stored in `.env`)

### Running the Frontend

```bash
cd frontend
npm start
```

Default URL: `http://localhost:3000`

### Building for Production

```bash
cd frontend
npm run build
```

## Development Workflow

1. Start backend: `cd backend && source venv/bin/activate && python manage.py runserver`
2. Start frontend: `cd frontend && npm start`
3. Frontend runs on port 3000, backend on port 8000
4. CORS is configured to allow communication between frontend and backend

## Database

- SQLite database (`backend/db.sqlite3`)
- Already populated with data
- Managed through Django ORM

## Python Environment

- Virtual environment located at `backend/venv/`
- Python 3.13.3
- Dependencies managed through Django's requirements (installed in venv)