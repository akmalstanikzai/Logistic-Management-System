```markdown name=README.md
# Mini Logistics Management System

A full-stack web application for managing shipments, drivers, and logistics operations with real-time tracking and analytics.

## 🚀 Features

- **Dashboard Analytics** - Real-time metrics for shipments and drivers
- **Shipment Management** - Create, track, and manage shipments with status workflows
- **Driver Management** - Manage driver profiles, availability, and assignments
- **Status Tracking** - Automated status flow validation (Pending → In Transit → Delivered)
- **Driver Assignment** - Assign and reassign drivers to shipments
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🛠 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB Atlas (Database)
- Mongoose (ODM)
- RESTful API architecture

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router
- Axios for API calls
- Headless UI components

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd logistics-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster. mongodb.net/logistics-system
```

Run backend:
```bash
npm run dev
```

Backend runs on:  **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:
```bash
npm run dev
```

Frontend runs on: **http://localhost:3000**

## 📚 API Endpoints

**Base URL:** `http://localhost:5000/api`

### Drivers
- `GET /drivers` - Get all drivers
- `POST /drivers` - Create driver
- `GET /drivers/:id` - Get driver by ID
- `PUT /drivers/:id` - Update driver
- `DELETE /drivers/:id` - Delete driver

### Shipments
- `GET /shipments` - Get all shipments
- `POST /shipments` - Create shipment
- `GET /shipments/:id` - Get shipment by ID
- `PUT /shipments/:id` - Update shipment
- `PATCH /shipments/:id/status` - Update status
- `PATCH /shipments/:id/assign-driver` - Assign driver
- `DELETE /shipments/:id` - Delete shipment
- `GET /shipments/dashboard/metrics` - Get dashboard metrics

See detailed API documentation in `backend/README.md`

## 📂 Project Structure

```
logistics-management-system/
├── backend/
│   ├── models/          # Database schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── server.js        # Entry point
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.jsx
│   └── README.md
└── README.md
```

## ☁️ Deployment

### Backend (AWS EC2)
1. Launch EC2 instance
2. Install Node.js and PM2
3. Clone repository and install dependencies
4. Configure environment variables
5. Start with PM2: `pm2 start server.js`
6. Setup Nginx reverse proxy
7. Configure SSL with Let's Encrypt

### Frontend (AWS S3 + CloudFront)
1. Build:  `npm run build`
2. Upload to S3 bucket
3. Create CloudFront distribution
4. Configure custom domain with Route 53

**Alternative:** AWS Amplify for automated deployment

See detailed deployment guides in respective README files. 

## 🎨 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Shipments Management
![Shipments](screenshots/shipments.png)

### Drivers Management
![Drivers](screenshots/drivers.png)

## 📝 Key Features Explained

### Status Workflow
Shipments follow a strict status flow:
- **Pending** → **In Transit** → **Delivered**
- Cannot skip statuses or revert from Delivered
- Driver automatically freed when shipment is delivered

### Driver Assignment
- Drivers can only be assigned if available
- Assigned driver status changes to "Busy"
- One driver can handle one shipment at a time
- Driver becomes available after shipment delivery

### Validation
- Email and license number uniqueness
- Phone number format validation
- Required fields enforcement
- Cannot delete busy drivers
- Cannot edit delivered shipments

## 🧪 Testing

Use the included Postman collection (`backend/Logistics-API-Postman-Collection.json`) to test all API endpoints.

Or test via frontend:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Create drivers and shipments through the UI

## 📄 Documentation

- [Backend Documentation](backend/README.md) - API endpoints, data models, deployment
- [Frontend Documentation](frontend/README.md) - Components, routing, styling

## 👤 Author

Muhammad Akmal - [@muhammadakmal02](https://github.com/muhammadakmal02)

## 📄 License

MIT

## 🙏 Acknowledgments

Built as a technical assessment for logistics management system requirements. 

---

**Note:** Make sure MongoDB Atlas is configured and both backend and frontend servers are running for full functionality.
```
