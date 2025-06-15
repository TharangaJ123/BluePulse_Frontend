
# 💧 BluePulse Frontend

This is the frontend for **BluePulse – Water Purification Management System**, a MERN stack-based application designed to manage water purification business operations efficiently.

## 🌐 Tech Stack

- **React.js** – Frontend framework
- **Tailwind CSS / Bootstrap** – Styling
- **Vite** – Development server and build tool
- **React Router DOM** – Client-side routing
- **Axios** – API requests
- **Context API** – Global state management

## 🚀 Features

- Modern and responsive user interface
- Role-based access (Admin, Employee, Customer)
- Appointment booking UI
- Product catalog, cart, and basic checkout
- Feedback and complaint submission
- Secure authentication using JWT (communicates with backend)

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)
- Vite (optional: installed globally)

### Steps

1. Clone the repo and navigate to the frontend folder:

```bash
git clone https://github.com/your-username/bluepulse.git
cd bluepulse/frontend
Install dependencies:

bash
Copy
Edit
npm install
Create an .env file in the /frontend directory:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000/api
Start the development server:

bash
Copy
Edit
npm run dev
📁 Folder Structure
bash
Copy
Edit
frontend/
├── public/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # App pages (Login, Dashboard, etc.)
│   ├── context/          # Global state and auth context
│   ├── App.jsx           # App entry and routing
│   └── main.jsx          # Vite entry point
├── .env
└── package.json
🧪 Testing
You can add unit and integration tests using:

React Testing Library

Jest

📌 To-Do / Improvements
Add form validations

Integrate payment gateway

Implement real-time notifications

📄 License
This project is licensed under the MIT License.
