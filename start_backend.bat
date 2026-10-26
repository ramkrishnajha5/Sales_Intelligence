@echo off
echo ========================================================
echo Starting Sales Intelligence - FastAPI Backend
echo Port: 8000 ^| URL: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo ========================================================
cd /d "%~dp0backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
