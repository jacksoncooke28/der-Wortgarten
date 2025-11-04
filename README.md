🌱 Der Wortgarten

Der Wortgarten is an interactive German vocabulary learning app that transforms language study into a gardening experience. Words are planted like seeds, grow into flowers as you review them correctly, and wilt if forgotten. It blends gamification with persistence, making studying both engaging and sustainable.

✨ Features
Vocabulary Garden: Each German word you add is planted as a seed and visually grows as you review it.

Quiz Mode: Practice with fill-in-the-blank quizzes (German → English or English → German).

Animated Garden UI: Plots with soil-textured backgrounds and plant growth animations.

Persistence with Database: Words and progress are stored using SQLite via a FastAPI backend.

CRUD Operations: Add, review, update, and delete vocabulary seamlessly.

Cross-platform: Built with React (frontend) and FastAPI (backend).

🛠 Tech Stack
Frontend: React (Vite), Framer Motion, CSS

Backend: FastAPI, SQLModel, SQLite

Other Tools: CORS Middleware, Fetch API

🚀 Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/jacksoncooke28/der-wortgarten.git
cd der-wortgarten
2. Set Up the Backend
bash
Copy
Edit
cd backend
python3 -m venv venv
source venv/bin/activate   # (on macOS/Linux)
venv\Scripts\activate      # (on Windows PowerShell)

pip install -r requirements.txt
Run the FastAPI server:

bash
Copy
Edit
uvicorn main:app --reload
By default, the backend will run at:
👉 http://127.0.0.1:8000

3. Set Up the Frontend
Open a new terminal:

bash
Copy
Edit
cd frontend
npm install
npm run dev
The frontend should now be live at:
👉 http://localhost:5173

🧪 API Endpoints

GET /api/vocab → Fetch all vocabulary words

POST /api/vocab → Add a new word

PUT /api/vocab/{id} → Update a word’s score or details

DELETE /api/vocab/{id} → Remove a word

GET /api/review-due → Fetch words due for review

🌼 How It Works

When you plant a new word, it starts wilted 🥀.

Each time you review correctly, the plant grows 🌱 → 🌿 → 🌼 → 🌸 → 🌳.

If you answer incorrectly, the plant wilts back to 🥀.

Words persist in the SQLite database so your progress is saved.


📜 License
MIT License — free to use, modify, and share.

👤 Author
Built by Jackson Cooke as a personal project for learning React + FastAPI while gamifying language study.
