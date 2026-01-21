# 🏛️ Digital Civic Engagement Platform

##  Introduction

The **Digital Civic Engagement Platform** is a MERN Stack web application designed to bridge the gap between citizens and government officials. It empowers users to voice their concerns through digital petitions, participate in polls, and track the status of community issues in real-time.

This project aims to promote transparency and active citizenship by providing a secure, role-based environment where:
* **Citizens** can create petitions, sign existing ones, and view community reports.
* **Officials** can view issues specific to their jurisdiction (upcoming feature) and analyze community feedback.

---

##  Features
* **User Authentication:** Secure Login and Registration using JWT (JSON Web Tokens).
* **Role-Based Access:** Distinct features for Citizens and Officials.
* **Petition Management:** Create, Read, and Sign petitions.
* **Smart Filtering:** Filter petitions by Category (Health, Infrastructure, etc.), Status, or Location.
* **Dashboard:** A personalized dashboard showing user stats and activity.
* **Duplicate Prevention:** Ensures a user cannot sign the same petition twice.
* **Responsive UI:** Built with React and Lucide Icons for a clean interface.

--

##  Tech Stack
* **Frontend:** React.js, React Router, Axios, Tailwind CSS (optional/if used).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud Database).
* **Visualization & Maps:** Recharts (for Polls/Stats), Leaflet (for Location Maps).
* **Authentication:** BCrypt (Password Hashing), JWT.

--

##  Local Setup Guide

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites
* **Node.js** (v14 or higher) installed.
* **MongoDB Atlas** account (or a local MongoDB instance).
* **Git** installed.

### 2. Clone the Repository

Open your terminal and run:
```bash

git clone <YOUR_GITHUB_REPO_LINK_HERE>

cd Digital-civic-nov-team01


3. Backend Setup (Server)Navigate to the backend folder and install dependencies:Bashcd backend

npm install

Configure Environment Variables:Create a file named .env inside the backend folder and add the following:Code snippetPORT=5000

MONGO_URI=your_mongodb_connection_string_here

JWT_SECRET=your_super_secret_key_here

(Note: Replace your_mongodb_connection_string_here with your actual Atlas connection link).Start the Server:Bashnpm start
You should see: Server running on port 5000 and MongoDB Connected.4. Frontend Setup (Client)Open a new terminal window (leave the backend running) and navigate to the frontend folder:Bashcd frontend

Install Core Dependencies: npm install

Install Visualization & Map Libraries:(As per project requirements for Graphs and Maps)Bashnpm install recharts leaflet react-leaflet axios lucide-react react-router-dom

Start the React App:npm start

The app should now open in your browser at http://localhost:3000.

Project StructureBashDigital-civic-nov-team01/

├── backend/                # Server-side logic
│   ├── config/             # DB connection
│   ├── controllers/        # Logic for Petitions/Users
│   ├── models/             # Mongoose Schemas (User, Petition)
│   ├── routes/             # API Routes
│   ├── middleware/         # Auth Middleware
│   └── index.js            # Entry point
│
└── frontend/               # Client-side logic
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # Auth Context (Login state)
    │   ├── pages/          # Dashboard, Login, Petition Lists
    │   └── api.js          # Axios configuration
    └── package.json

    
🔗 API EndpointsMethodEndpointDescription

POST/api/auth/registerRegister      a new user
POST/api/auth/loginLogin            user & get Token
GET/api/petitionsGet                all petitions (with filters)
POST/api/petitionsCreate            a new petition (Auth required)
POST/api/petitions/:id/sign         Sign a petition (Auth required)


🤝 ContributingFork the repository.
Create a new branch (git checkout -b feature-name).Commit your changes (git commit -m 'Added new feature').Push to the branch (git push origin feature-name).Open a Pull Request.