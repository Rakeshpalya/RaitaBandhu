@echo off
echo Starting RaitaBandhu Backend...
start cmd /k "cd backend && npm run dev"

echo Starting RaitaBandhu Machine Learning API...
start cmd /k "cd ml-model && python app.py"

echo Starting RaitaBandhu Frontend...
start cmd /k "cd client && npm run dev"

echo All servers started in separate windows!
