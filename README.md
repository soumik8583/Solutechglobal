Running Your Project Locally in VS Code
Option 1: Download via GitHub (Recommended)
Push to GitHub from Emergent:

Click the GitHub icon in Emergent's top bar
Connect your GitHub account and create a new repository
Your code will be pushed automatically
Clone locally:

git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
Prerequisites to install:

Node.js (v18+): https://nodejs.org
Python (3.10+): https://python.org
MongoDB: https://mongodb.com/try/download/community
Yarn: npm install -g yarn
Setup Backend:

cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
Create backend/.env:

MONGO_URL=mongodb://localhost:27017
DB_NAME=solutech_db
CORS_ORIGINS=*
RESEND_API_KEY=re_eJM6eX7i_Gdhi9UviGMJCxBcjxeaMeNFb
SENDER_EMAIL=onboarding@resend.dev
Setup Frontend:

cd frontend
yarn install
Create frontend/.env:

REACT_APP_BACKEND_URL=http://localhost:8001
Run the app (2 terminals):

# Terminal 1 - Backend
cd backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend
cd frontend && yarn start
Open in browser: http://localhost:3000

Option 2: Use Emergent's Built-in VS Code
Click the Code Editor icon in Emergent to access VS Code directly in browser
Full editing capabilities without local setup


