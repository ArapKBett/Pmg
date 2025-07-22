# Password Manager System

A secure, self-hosted password manager with cross-platform support.

## Features

- End-to-end encrypted credential storage
- Cross-platform sync (Web, Mobile, Browser Extension)
- Two-factor authentication
- Secure password generator
- Automatic form filling
- Self-hosted solution


## Installation

### Prerequisites

- Docker
- Docker Compose
- Node.js 16+

### Setup

Clone the repository:
   
   `git clone https://github.com/ArapKBett/Pmg.git
   cd Pmg`

Configure env variables 

`cp server/.env.example server/.env`

Build and Start service 

`docker-compose up -d --build`

access at `http://localhost`

## Mobile App Set-up 

Install dependencies 

`cd mobile-app
npm install`

Start development server

`npm start`

## Browser Extension Setup

Load the extension in Chrome/Edge:
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `browser-extension` directory

## Backup and Restore

Database backups are automatically stored in the Docker volume `pgdata`. To create a manual backup:

`docker-compose exec db pg_dump -U pmadmin passwordmanager > backup.sql`

To restore from backup:

```cat backup.sql | docker-compose exec -T db psql -U pmadmin passwordmanager```


# Deployment 

### **Step 1: Prepare Your Codebase**
1. **Replace all placeholders** (see [previous list](https://chat.openai.com/c/1855e3b5-9770-4f6f-8e5e-3b5c1b9e0b1d)) in:
   - `server/.env`
   - `web-ui` and `mobile-app` config files
   - Database `init.sql`

2. **Commit changes** to your Git repository (GitHub/GitLab).

---

### **Step 2: Set Up PostgreSQL on Render**
1. Go to [Render Dashboard](https://dashboard.render.com/) → "New" → **PostgreSQL**.
2. Configure:
   - **Name**: `password-manager-db`
   - **Database**: `passwordmanager`
   - **User**: `pmadmin` (or custom)
   - **Password**: Save this securely (use in `server/.env`).
3. Note the **internal database URL** (e.g., `postgres://pmadmin:password@dpg-xxxxxx-a.oregon-postgres.render.com/passwordmanager`).

---

### **Step 3: Deploy Backend (Node.js)**
1. **Create a Web Service**:
   - "New" → "Web Service" → Connect your Git repo.
   - Select **Node.js** environment (not Docker).

2. **Configure Settings**:
   - **Name**: `password-manager-backend`
   - **Region**: Choose closest to you (e.g., "Oregon").
   - **Branch**: `main` (or your deployment branch).
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     node src/server.js
     ```

3. **Environment Variables**:
   Add these from your `server/.env`:
   ```ini
   NODE_ENV=production
   DB_HOST=dpg-xxxxxx-a.oregon-postgres.render.com  # From Render PostgreSQL
   DB_USER=pmadmin
   DB_PASSWORD=your_render_db_password
   DB_NAME=passwordmanager
   JWT_SECRET=your_generated_jwt_secret
   ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
   ```

4. **Deploy**.

---

### **Step 4: Deploy Frontend (Static Site)**
1. **Build your React frontend**:
   ```bash
   cd web-ui
   npm run build
   ```
2. **Create a Static Site** on Render:
   - "New" → "Static Site" → Connect your repo.
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `web-ui/dist`
   - **Environment Variables**:
     ```ini
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

---

### **Step 5: Configure Mobile App & Browser Extension**
1. **Mobile App** (`mobile-app/App.js`):
   ```javascript
   const API_URL = 'https://your-backend-url.onrender.com/api';
   ```
   - Rebuild with Expo:
     ```bash
     expo build:android -t apk
     expo build:ios
     ```

2. **Browser Extension**:
   Update in `manifest.json`:
   ```json
   "host_permissions": [
     "https://your-backend-url.onrender.com/*"
   ]
   ```
   - Zip and publish to Chrome Web Store/Firefox Add-ons.

---

### **Step 6: Verify Deployment**
1. **Test Backend**:
   - Visit `https://your-backend-url.onrender.com/api/health`. Should return `200 OK`.
   - Check WebSockets: `wss://your-backend-url.onrender.com/ws`.

2. **Test Frontend**:
   - Open `https://your-frontend-url.onrender.com` and log in.

3. **Database**:
   - Connect via PGAdmin or `psql` to verify tables:
     ```bash
     psql postgres://pmadmin:password@dpg-xxxxxx-a.oregon-postgres.render.com/passwordmanager
     ```

---

### **Troubleshooting**
- **CORS Errors**: Double-check `ALLOWED_ORIGINS` in backend.
- **Database Timeouts**: Ensure `DB_HOST` uses Render’s internal URL.
- **WebSocket Issues**: Render supports WS by default—no extra config needed.

---

### **Final Architecture**
```
User → https://frontend.onrender.com → https://backend.onrender.com → PostgreSQL
          (Static Site)                  (Node.js API)
```

**Cost**:  
- PostgreSQL: $7/month (Free tier available for testing).  
- Web Service: Free tier (or $7/month for better performance).  
- Static Site: Free.  

