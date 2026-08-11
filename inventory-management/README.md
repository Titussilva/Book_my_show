# 📦 InventoryPro — Production MERN Inventory Management System

A full-stack, enterprise-grade **Inventory Management System** built using the MERN Stack (MongoDB Atlas, Express.js, React.js with Vite, Node.js). Features role-based access control (Admin & Employee), real-time stock tracking, Cloudinary image upload, Chart.js analytics, export to PDF/Excel, dark mode support, and comprehensive API documentation.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- **JWT Authentication** with password hashing using `bcryptjs`.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access (Dashboard analytics, CRUD on Products, Categories, Suppliers).
  - **Employee**: Search/Filter products, View product details, Record Stock In/Out, View transaction history.
- **Protected Client Routes** & Express Middleware guards.

### 📦 Product & Inventory Management
- **Full Product CRUD** with auto SKU generation & unit support.
- **Cloudinary Image Upload** for high-resolution product photos.
- **Stock In & Stock Out Operations** with real-time stock updates.
- **Negative Stock Prevention**: Guards against deducting more than available inventory.
- **Transaction Audit Log**: Logs every stock adjustment with date, user, quantity, and remarks.
- **Low Stock Alerts**: Visual badges and dashboard warnings for products with low quantity (< 10).

### 📊 Dashboard & Reporting
- **Chart.js Analytics**:
  - Monthly Stock Flow (Bar Chart)
  - Products by Category (Doughnut Chart)
  - Low Stock Products (Horizontal Bar Chart)
- **Data Exporting**: Download product lists & transaction logs as **PDF** (via jsPDF) or **Excel** (.xlsx via SheetJS).

### 🎨 Modern UI & UX
- **Responsive Layout**: Designed for Desktop, Tablet, and Mobile screens.
- **Dark Mode Support**: Seamless toggle between sleek Navy Dark mode & crisp Light mode.
- **Toast Notifications**: Interactive status alerts via `react-toastify`.
- **Delete Confirmation Dialogs**: Prevents accidental record deletion.

---

## 📁 Folder Structure

```
inventory-management/
├── client/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Branding assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── charts/         # CategoryChart, StockChart, LowStockChart
│   │   │   ├── common/         # Button, Table, Modal, Badge, Spinner, etc.
│   │   │   └── layout/         # Layout, Sidebar, Navbar
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── hooks/              # useAuth hook
│   │   ├── pages/              # Login, Register, Dashboard, Products, Categories, etc.
│   │   ├── services/           # Axios API services (auth, product, category, supplier, inventory)
│   │   └── utils/              # PDF/Excel export helpers, date/currency formatters
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (Mongoose connection), cloudinary.js
│   ├── controllers/            # authController, productController, categoryController, etc.
│   ├── middleware/             # auth.js, role.js, upload.js, errorHandler.js
│   ├── models/                 # User, Category, Supplier, Product, InventoryTransaction
│   ├── routes/                 # authRoutes, productRoutes, categoryRoutes, etc.
│   ├── utils/                  # generateToken, activityLog
│   ├── seed.js                 # Database Seeder script
│   ├── server.js               # Main Express entrypoint
│   └── package.json
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Chart.js, React Icons, react-toastify, jsPDF, SheetJS (xlsx), Tailwind CSS.
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, Multer, Cloudinary, express-validator.

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/inventory_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ⚡ Installation & Setup

### 1. Clone & Setup Backend
```bash
cd server
npm install
```

### 2. Seed Initial Demo Data
```bash
npm run seed
```
> **Default Seed Accounts:**
> - 🔑 **Admin**: `admin@inventory.com` / `Admin@123`
> - 👤 **Employee**: `employee@inventory.com` / `Employee@123`

### 3. Run Backend Server
```bash
npm run dev
# Server running on http://localhost:5000
```

### 4. Setup & Run Frontend
```bash
cd ../client
npm install
npm run dev
# Frontend running on http://localhost:5173
```

---

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Authenticate user & receive JWT
- `GET /api/auth/profile` — Get logged in user profile *(Protected)*
- `PUT /api/auth/change-password` — Change password *(Protected)*

### Products
- `GET /api/products` — List products with search, filter, sort & pagination *(Protected)*
- `GET /api/products/:id` — Get product details *(Protected)*
- `POST /api/products` — Create product with Cloudinary image upload *(Admin Only)*
- `PUT /api/products/:id` — Update product *(Admin Only)*
- `DELETE /api/products/:id` — Delete product *(Admin Only)*

### Categories & Suppliers
- `GET /api/categories` & `POST/PUT/DELETE /api/categories` *(Admin Only for mutations)*
- `GET /api/suppliers` & `POST/PUT/DELETE /api/suppliers` *(Admin Only for mutations)*

### Inventory
- `POST /api/inventory/stock-in` — Add incoming stock *(Protected)*
- `POST /api/inventory/stock-out` — Deduct stock *(Protected)*
- `GET /api/inventory/history` — Get stock audit log *(Protected)*
- `GET /api/inventory/stats` — Get aggregation metrics for Dashboard *(Protected)*

---

## 🚢 Deployment Steps

### Frontend Deployment (Netlify / Vercel)
1. Push `client` to your GitHub repository.
2. Link project to **Netlify** or **Vercel**.
3. Set build command: `npm run build` and publish directory: `dist`.
4. Add environment variable `VITE_API_URL` pointing to your deployed Express backend.

### Backend Deployment (Render / Railway)
1. Push `server` to GitHub.
2. Create a Web Service on **Render**.
3. Set build command: `npm install` and start command: `npm start`.
4. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URL`).

---

## 📄 License
This project is open-source under the MIT License.
