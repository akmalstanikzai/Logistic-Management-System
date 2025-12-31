```markdown name=frontend/README.md
# Mini Logistics Management System - Frontend

Modern, responsive React application built with Vite and Tailwind CSS for managing logistics operations.

## 🛠 Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Headless UI** - Accessible components
- **Heroicons** - Beautiful icons

## 📦 Prerequisites

- Node.js (v14+)
- npm or yarn
- Backend API running on `http://localhost:5000`

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory: 

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application

**Development mode:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

Application runs on:  **http://localhost:3000**

---

## ✨ Features

### 📊 Dashboard
- Real-time metrics (Total, Delivered, In Transit, Pending shipments)
- Driver statistics (Total, Available, Busy)
- Recent shipments table
- Responsive stat cards with icons

### 📦 Shipments Management
- Create new shipments with form validation
- Edit shipment details (cannot edit delivered shipments)
- Delete shipments (frees assigned driver)
- Assign/reassign drivers to shipments
- Update shipment status with flow validation
- View all shipments in sortable table
- Status badges with color coding
- Real-time availability checking

### 🚗 Drivers Management
- Create new drivers with validation
- Edit driver information
- Delete drivers (only if available/not assigned)
- View driver availability status
- See current shipment assignments
- Vehicle type indicators

### 🎨 UI/UX Features
- Fully responsive design (mobile, tablet, desktop)
- Sidebar navigation with active states
- Modal dialogs with smooth transitions
- Form validation with error messages
- Loading states with spinners
- Success/error alerts
- Action tooltips
- Color-coded status indicators
- Empty states with icons

---

## 📂 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.jsx        # Main layout with sidebar
│   ├── pages/
│   │   ├── Dashboard.jsx         # Dashboard with metrics
│   │   ├── Shipments.jsx         # Shipments management
│   │   └── Drivers.jsx           # Drivers management
│   ├── services/
│   │   └── api.js                # API service & endpoints
│   ├── App.jsx                   # Root component with routes
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind & custom styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── . env
```

---

## 🎨 Tailwind Custom Classes

Custom utility classes defined in `src/index.css`:

### Buttons
- `.btn-primary` - Blue primary button
- `.btn-secondary` - Gray secondary button
- `.btn-danger` - Red danger button

### Components
- `.card` - White card with shadow
- `.input-field` - Styled input field
- `.label` - Form label

### Badges
- `.badge` - Base badge
- `.badge-success` - Green badge (Delivered, Available)
- `.badge-warning` - Yellow badge (Pending)
- `.badge-primary` - Blue badge (In Transit)
- `.badge-danger` - Red badge (Busy)
- `.badge-gray` - Gray badge (default)

---

## 🔌 API Integration

The app connects to the backend API via Axios.  All API calls are centralized in `src/services/api.js`.

### Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

### API Service Structure

```javascript
// Driver API
driverAPI.getAll(params)
driverAPI.getById(id)
driverAPI.getAvailable()
driverAPI.create(data)
driverAPI.update(id, data)
driverAPI.delete(id)

// Shipment API
shipmentAPI.getAll(params)
shipmentAPI.getById(id)
shipmentAPI.create(data)
shipmentAPI.update(id, data)
shipmentAPI.delete(id)
shipmentAPI.updateStatus(id, status)
shipmentAPI.assignDriver(id, driverId)
shipmentAPI.getDashboardMetrics()
```

---

## 🎯 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to `/dashboard` |
| `/dashboard` | Dashboard | Metrics & recent shipments |
| `/shipments` | Shipments | Manage all shipments |
| `/drivers` | Drivers | Manage all drivers |

---

## 📱 Responsive Breakpoints

Tailwind CSS breakpoints used: 

- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up (sidebar becomes fixed)
- `xl:` - 1280px and up

---

## ☁️ AWS Deployment Strategy

### Recommended Architecture

**Option 1: S3 + CloudFront**
- **S3** - Host static build files
- **CloudFront** - CDN for global distribution & SSL
- **Route 53** - DNS management
- **Certificate Manager** - SSL certificates

**Option 2: Amplify**
- **AWS Amplify** - All-in-one hosting (CI/CD, SSL, CDN)
- Automatic deployments from Git
- Built-in preview environments

**Option 3: EC2 + Nginx**
- **EC2** - Host with Nginx
- **Elastic Load Balancer** - Load balancing
- **Route 53** - DNS

### Deployment Steps (S3 + CloudFront)

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Set bucket policy for public read

3. **Upload Build Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Enable HTTPS
   - Set default root object:  `index.html`
   - Custom error response: 404 → /index.html (for SPA routing)

5. **Configure Route 53**
   - Create A record pointing to CloudFront

6. **Update Environment Variables**
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```

### Deployment Steps (AWS Amplify)

1. **Connect Repository**
   - Link GitHub/GitLab repository
   - Select branch

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend: 
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files: 
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Set Environment Variables**
   - Add `VITE_API_URL` in Amplify console

4. **Deploy**
   - Automatic deployment on git push
   - Preview URLs for pull requests

### Production Environment

**Production `.env`:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**Build Command:**
```bash
npm run build
```

**Output Directory:** `dist/`

---

## 🔧 Configuration Files

### Vite Config (`vite.config.js`)
```javascript
export default defineConfig({
  plugins:  [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

### Tailwind Config (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* custom blue shades */ }
      }
    }
  }
}
```

---

## 🎨 Color Scheme

- **Primary (Blue)**: `#2196f3` - Buttons, links, In Transit status
- **Success (Green)**: `#2e7d32` - Delivered status, available drivers
- **Warning (Yellow)**: `#ed6c02` - Pending status
- **Danger (Red)**: `#dc004e` - Delete actions, busy drivers
- **Gray**:  Background, borders, secondary elements

---

## ⚡ Performance Optimizations

- Vite for fast HMR (Hot Module Replacement)
- Code splitting with React Router
- Lazy loading of components
- Optimized production builds
- Tailwind CSS purging unused styles
- Axios interceptors for error handling

---

## 📝 Development Guidelines

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/Layout/Layout.jsx`

### Adding API Endpoint

1. Add function to `src/services/api.js`
2. Use in component with try/catch for error handling

### Styling

- Use Tailwind utility classes first
- Add custom classes to `src/index.css` for reusable components
- Follow existing color scheme and spacing

---

## 🐛 Common Issues

### API Connection Failed
- Ensure backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in `.env` file
- Restart dev server after changing `.env`

### Port Already in Use
```bash
# Change port in vite.config.js or: 
npm run dev -- --port 3001
```

### Tailwind Styles Not Applying
- Check `tailwind.config.js` content paths
- Ensure `@tailwind` directives in `index.css`
- Restart dev server

---

## 📦 Build Output

Production build creates optimized static files in `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...  (other chunks)
└── vite.svg
```

---

## 🧪 Testing

The app can be tested with:
- Backend running on `http://localhost:5000`
- Sample data created via Postman or API
- Different screen sizes for responsiveness
- Various user flows (create, edit, delete)

---

## 👤 Author

Muhammad Akmal - [GitHub](https://github.com/muhammadakmal02)

## 📄 License

MIT
```