```markdown name=backend/README.md
# Mini Logistics Management System - Backend

RESTful API built with Node.js, Express. js, and MongoDB for managing shipments and drivers.

## 🛠 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB Atlas** (Database)
- **Mongoose** (ODM)
- **CORS** & **dotenv**

## 📦 Prerequisites

- Node.js (v14+)
- MongoDB Atlas account
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory: 

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/logistics-system? retryWrites=true&w=majority
```

**Get MongoDB URI:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Setup database user & password
4. Whitelist IP (0.0.0.0/0 for development)
5. Copy connection string to `MONGODB_URI`

### 3. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server runs on:  **http://localhost:5000**

### 4. Test Server

```bash
curl http://localhost:5000/api/health
```

---

## 📚 API Endpoints

**Base URL:** `http://localhost:5000/api`

### 🚗 Driver Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/drivers` | Create a new driver |
| GET | `/drivers` | Get all drivers (pagination & filters) |
| GET | `/drivers/available` | Get all available drivers |
| GET | `/drivers/:id` | Get driver by ID |
| PUT | `/drivers/:id` | Update driver details |
| DELETE | `/drivers/:id` | Delete driver |

### 📦 Shipment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shipments` | Create a new shipment |
| GET | `/shipments` | Get all shipments (pagination, filters & sorting) |
| GET | `/shipments/dashboard/metrics` | Get dashboard statistics |
| GET | `/shipments/:id` | Get shipment by ID |
| PUT | `/shipments/:id` | Update shipment details |
| PATCH | `/shipments/:id/status` | Update shipment status |
| PATCH | `/shipments/:id/assign-driver` | Assign driver to shipment |
| DELETE | `/shipments/:id` | Delete shipment |

### 🏥 Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check server status |

---

## 📋 Example Requests

### Create Driver
```json
POST /api/drivers

{
  "name": "John Doe",
  "email":  "john. doe@example.com",
  "phone": "1234567890",
  "licenseNumber":  "DL123456",
  "vehicleType": "truck"
}
```

### Create Shipment
```json
POST /api/shipments

{
  "shipmentName": "Electronics Package",
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "weight": 25.5,
  "description": "Fragile electronics",
  "driver": "DRIVER_ID_HERE"
}
```

### Update Shipment Status
```json
PATCH /api/shipments/: id/status

{
  "status": "In Transit"
}
```

**Status Flow:** Pending → In Transit → Delivered

### Assign Driver
```json
PATCH /api/shipments/: id/assign-driver

{
  "driverId": "DRIVER_ID_HERE"
}
```

---

## 📂 Project Structure

```
backend/
├── models/
│   ├── Driver.js
│   └── Shipment. js
├── controllers/
│   ├── driverController. js
│   └── shipmentController.js
├── routes/
│   ├── driverRoutes.js
│   └── shipmentRoutes.js
├── server.js
├── package.json
└── .env
```

---

## ☁️ AWS Deployment Strategy

### Recommended Architecture

**Option 1: EC2 Deployment**
- **EC2** - Host Node.js application
- **MongoDB Atlas** - Managed database
- **Elastic Load Balancer** - Load balancing & SSL
- **Route 53** - DNS management
- **CloudWatch** - Monitoring & logs
- **S3** - Store backups

**Option 2: Containerized (ECS)**
- **ECS** - Docker container orchestration
- **ECR** - Store Docker images
- **Application Load Balancer** - Traffic distribution
- **MongoDB Atlas** - Database
- **CloudWatch** - Logging

**Option 3: Serverless**
- **AWS Lambda** - Serverless functions
- **API Gateway** - REST API
- **MongoDB Atlas** - Database

### Deployment Steps (EC2)

1. **Launch EC2 Instance** (Ubuntu/Amazon Linux)
2. **Install Node.js & PM2**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. **Clone & Setup**
   ```bash
   git clone <repo-url>
   cd backend
   npm install
   ```
4. **Configure Environment**
   ```bash
   nano .env
   # Add production MongoDB URI
   ```
5. **Start with PM2**
   ```bash
   pm2 start server.js --name logistics-api
   pm2 startup
   pm2 save
   ```
6. **Setup Nginx Reverse Proxy**
7. **Configure SSL with Let's Encrypt**

### Environment Configuration

**Production . env:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod-user:password@cluster. mongodb.net/logistics
CLIENT_URL=https://yourdomain.com
```

---

## 📝 Notes

- All endpoints support proper error handling
- Input validation on all POST/PUT/PATCH requests
- Automatic shipment ID generation (SHP000001)
- Driver availability tracking
- Status history logging for shipments
- Cannot delete drivers assigned to shipments
- Cannot update delivered shipments

---

## 👤 Author

Muhammad Akmal - [GitHub](https://github.com/muhammadakmal02)

## 📄 License

MIT
```