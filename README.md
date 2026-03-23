# TEA
TEA - Track Everything App 🍵 - Here you can keep track of your (or your team) hours. Actually saving time. Simple, efficient and direct to the point. No extra steps. Do it quickly and enjoy a cuppa.

# 🍵 TEA (Track Everything App)

**Time tracking should be as calm and easy as a cup of tea.**

TEA is a minimalist, user-friendly time tracking tool designed to stay out of your way while providing deep insights into where your hours go: no clutter, no steep learning curves, just clarity.

---

## ✨ Features

* **Instant Logging:** Start and stop timers with a single click or command.
* **Contextual Tags:** Organise your time by projects, clients or people.
* **Minimalist Dashboard:** See your day at a glance without the noise.
* **Export Ready:** Your data is yours. Export to CSV or PDF anytime.
* **Reports:** Generate reports within a timeframe to facilitate payroll.

# 🛠️ Tech Stack
* **Frontend:** React.js + Vite (Fast, modern build tool)
* **Backend:** Django (Robust Python framework)
* **Styling:** Tailwind CSS (Utility-first CSS for a minimalist UI)
* **Languages:** JavaScript (Frontend) & Python (Backend)
* **Database:** SQLite (Development)
* **API:** Django REST Framework (Communication between Front and Back)

## 🎨 Philosophy

Most time trackers feel like a boss hovering over your shoulder. **TEA feels like a break.** We focus on:
* **Low Friction:** Tracking shouldn't feel like work.
* **Privacy First:** Your data stays local (or encrypted).
* **Intentionality:** Knowing where your time goes helps you spend it better.
# 📄 License
* This project is licensed under the MIT License - see the LICENSE file for details.
* Built with ☕ (and 🍵) by **Guilherme Balestro**

## 🚀 Quick Start

### Installation
```bash
# Clone the repository
git clone [https://github.com/gbalestro/tea.git](https://github.com/seu-usuario/tea.git)

# Enter the project folder
cd tea

## 🛠️ How to run the project:

### Backend (Django)
1. `cd backend`
2. `python3 -m venv venv`
3. Activate venv: `source venv/bin/activate` (Mac/Linux) ou `venv\Scripts\activate` (Windows)
4. `pip install django djangorestframework django-cors-headers` (Or pip install -r requirements.txt)
5. `python manage.py migrate`
6. `python manage.py runserver`

### Frontend (React + Vite)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

###🍵 TEA Project: Daily Checklist:
On the terminal

1. STARTING THE DAY (Sync)

* git pull (Get latest changes)

2. FRONTEND (UI)

* cd frontend
* npm run dev
* Open http://localhost:5173

3. BACKEND (Data)

* cd backend
* source venv/bin/activate (Mac/Linux) OR venv\Scripts\activate(Windows)
* python manage.py runserver
* Open http://127.0.0.1:8000

4. FINISHING (Save)

* git add .
* git commit -m "feat: what I did"
* git push origin main
