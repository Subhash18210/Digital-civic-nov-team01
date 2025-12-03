# Civix: Digital Civic Engagement & Petition Platform

[cite_start]**Civix** enables citizens to engage in local governance through petitions, voting, and tracking officials' responses[cite: 3]. [cite_start]It fosters community-driven advocacy by allowing geo-targeted issues and public sentiment polling[cite: 4].

[cite_start]The platform bridges the gap between residents and local officials, ensuring transparency and accountability in civic matters[cite: 9].

## 🌟 Key Features

* [cite_start]**Petition Management:** Users can create, edit, sign, and geo-tag petitions to gather community support[cite: 6, 7, 23].
* [cite_start]**Public Polling:** Issue-specific polls allow users to vote and view live sentiment graphs on local topics[cite: 8, 29, 31].
* [cite_start]**Governance Dashboard:** Officials can track public interest, respond to petitions, and view engagement reports[cite: 9, 36, 37].
* [cite_start]**Role-Based Access:** Secure authentication for two distinct user roles: **Citizens** and **Public Officials**[cite: 11, 46].

---

## 🛠 Tech Stack

* **Frontend:** React.js + Vite
* **Backend:** Node.js + Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (JSON Web Tokens)

---

## ⚙️ Local Installation Guide

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/)
* [Git](https://git-scm.com/)
* MongoDB (Locally installed or a MongoDB Atlas connection string)

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/springboardmentor9515a-collab/Digital-civic-nov-team01.git
cd Digital-civic-nov-team01
2. Backend Setup (Server)
Navigate to the server folder and install dependencies:

Bash

cd server
npm install
Configuration: Create a .env file inside the server folder and add your specific variables (ask the Team Lead for credentials):

Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start the Server:

Bash

npm start
# The server should run on http://localhost:5000
3. Frontend Setup (Client)
Open a new terminal window (keep the server running in the first one) and navigate to the client folder:

Bash

cd client
npm install
Start the Frontend:

Bash

npm run dev
# The app should run on http://localhost:5173 (or similar)
4. Verify Connection
Open your browser and go to the frontend URL (e.g., http://localhost:5173). If the page loads and you can see the login screen, the setup is complete!


