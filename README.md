# CineMagic - Movie Ticket Booking App

A complete, production-ready MERN Stack application for booking movie tickets with seat selection, realistic UI/UX, and payment integration.

## Features

- **User Authentication**: JWT based login/registration.
- **Browse Movies**: View trending and upcoming movies.
- **Movie Details**: View synopsis, cast, and trailer.
- **Seat Selection**: Interactive cinema seat grid (prevents double booking).
- **Checkout & Payment**: Razorpay test mode integration.
- **User Dashboard**: View booking history and QR Codes.
- **Admin Dashboard**: Manage movies, theatres, shows, and view stats.
- **Premium UI/UX**: Dark theme, glassmorphism, responsive design with Framer Motion animations.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS v4, Framer Motion, React Query, Axios.
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, Razorpay.

## Setup Instructions

### 1. Environment Variables

#### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_test_example
RAZORPAY_KEY_SECRET=secret_example
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Seed Database (Optional)
To populate the database with realistic sample movies, theatres, and shows:
```bash
cd backend
npm run data:import
```
*(Use `npm run data:destroy` to clear data)*

### 4. Run Locally

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Deployment Instructions

### 1. MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Under "Database Access", create a new database user.
3. Under "Network Access", allow access from anywhere (`0.0.0.0/0`).
4. Click "Connect" -> "Connect your application" and copy the connection string. Replace `<password>` with your user's password.
5. Save this URI for the backend environment variables.

### 2. Render (Backend Deployment)
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository and select the `backend` directory as the Root Directory (or configure the build command).
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Go to the **Environment** tab and add all the variables from your `.env` file.
7. Click "Deploy". Once finished, copy the deployed backend URL (e.g., `https://cinemagic-api.onrender.com`).

### 3. Vercel (Frontend Deployment)
1. Log in to [Vercel](https://vercel.com) and click "Add New Project".
2. Import your GitHub repository.
3. Set the **Framework Preset** to Vite.
4. Set the **Root Directory** to `frontend`.
5. *Important*: You need to point the frontend to the deployed backend URL instead of `localhost:5000`. In your frontend code (e.g., `axios` defaults or environment variables), ensure API calls point to the Render URL.
6. Click "Deploy".

Congratulations! Your Movie Ticket Booking app is live!
