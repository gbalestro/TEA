# 🍵 TEA (Track Everything App)

**Time tracking should be as calm and easy as a cup of tea.**

TEA is a professional, full-stack time tracking tool designed for clarity and efficiency. It allows for seamless individual or bulk hour logging, whether in real-time or via manual back-dated entries. With a powerful reporting engine and a secure role-based access system, TEA stays out of your way while providing deep insights into where your team's hours go.

---

## ✨ Primary Features

*   **⚡ Instant & Bulk Logging:** Start/stop timers with a single click or clock-in entire teams into a venue simultaneously.
*   **📅 Manual Entry Support:** Easily add past records or edit existing logs to ensure your data is always accurate.
*   **🌍 Internationalization (i18n):** Full multi-language support (English & Portuguese) with real-time UI switching.
*   **🔐 Role-Based Access (RBAC):** Secure access control with Admin, Manager, and Staff roles to protect sensitive data and management tools.
*   **📊 Interactive Reports:** Robust reporting dashboard with advanced filtering by date, collaborator, or venue.
*   **📉 Sorting & Insights:** Real-time sorting in reports to find the most recent entries or top contributors at a glance.
*   **📤 Export Ready:** Generate professionally formatted **PDF** and **Excel (XLSX)** reports for payroll and client billing.

---

## 🛠️ Tech Stack

### Frontend
*   **React.js + Vite:** Fast, modern frontend architecture.
*   **React-Bootstrap:** Clean, responsive UI components.
*   **i18next:** Scalable internationalization framework.
*   **Custom CSS:** Tailored design system for a premium look and feel.

### Backend
*   **Django:** Robust, secure Python framework.
*   **Django REST Framework:** Efficient API communication between front and back.
*   **SQLite:** Reliable local database for development.

---

## 🎨 Philosophy

Most time trackers feel like a boss hovering over your shoulder. **TEA feels like a break.** We focus on:
*   **Low Friction:** Tracking shouldn't feel like work.
*   **Professional Clarity:** Data should be easy to read, export, and act upon.
*   **Adaptability:** Whether you're a freelancer or managing a large event team, TEA scales to your needs.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/gbalestro/tea.git

# Enter the project folder
cd tea
```

### 🛠️ How to run the project:

#### Backend (Django)
1. `cd backend`
2. `python3 -m venv venv`
3. Activate venv: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

#### Frontend (React + Vite)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 🍵 Project Checklist:

*   **Sync:** `git pull` before starting.
*   **UI:** `npm run dev` in `/frontend`.
*   **Data:** `python manage.py runserver` in `/backend`.
*   **Save:** Commit and push your milestones!

---

# 📄 License
* This project is licensed under the MIT License.
* Built with ☕ (and 🍵) by **Guilherme Balestro** & **Joao Pedro**.
