# 🚀 WorldScars Deployment Guide

Complete step-by-step guide to deploy WorldScars with separate services: Frontend (Netlify) + Backend (Render) + Database (Render PostgreSQL).

## 📋 Quick Overview

| Service  | Platform | URL Pattern                               |
| -------- | -------- | ----------------------------------------- |
| Frontend | Netlify  | `https://worldscars.netlify.app`          |
| Backend  | Render   | `https://worldscars-backend.onrender.com` |
| Database | Render   | PostgreSQL managed service                |

## 🐳 Alternative: Docker Deployment (Single Platform)

**Yes! You can deploy your entire application using Docker!** Here are the best options:

### Option A: Railway (Recommended for Docker)
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repo
3. Railway auto-detects `docker-compose.yml`
4. Set environment variables in Railway dashboard
5. Deploy!

### Option B: Render (Docker Compose Support)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Blueprint" (supports docker-compose.yml)
3. Connect your GitHub repository
4. Render will deploy all services automatically

### Option C: DigitalOcean App Platform
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Select "Docker" as source type
4. Deploy with environment variables

### Environment Variables for Docker Deployment
```env
# Database
POSTGRES_PASSWORD=your_secure_password
DB_PORT=5432

# Backend
DATABASE_URL=postgresql://postgres:password@db:5432/worldscars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
VITE_API_BASE_URL=http://backend:8080
FRONTEND_URL=https://your-app-domain.com
```

### Benefits of Docker Deployment
- ✅ **Single platform** - No service separation complexity
- ✅ **Consistent environment** - Same setup as local development
- ✅ **Easier scaling** - Scale entire stack together
- ✅ **Cost effective** - Often cheaper than separate services

## 🗄️ Step 1: Deploy Database (Render PostgreSQL)

### 1.1 Create Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   ```
   Name: worldscars-db
   Database: worldscars
   Username: postgres
   ```
4. Click **"Create Database"**
5. **Wait** for database to be ready (green status)
6. **Copy** the connection details from the dashboard

### 1.2 Note Database Credentials

You'll need these for the backend deployment:

- **Host**: `your-db-host.render.com`
- **Port**: `5432`
- **Database**: `worldscars`
- **Username**: `postgres`
- **Password**: `[generated-password]`

## 🔧 Step 2: Deploy Backend (Render)

### 2.1 Set Up Environment Secrets

1. In Render Dashboard → **Settings** → **Secrets**
2. Add these secrets:

```env
# Database Connection
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/worldscars
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[your-db-password]

# Cloudinary (get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=[your-cloudinary-cloud-name]
CLOUDINARY_API_KEY=[your-cloudinary-api-key]
CLOUDINARY_API_SECRET=[your-cloudinary-api-secret]

# CORS (will update after frontend deployment)
FRONTEND_URL=https://your-app-domain.com
```

### Benefits of Docker Deployment
- ✅ **Single platform** - No service separation complexity
- ✅ **Consistent environment** - Same setup as local development
- ✅ **Easier scaling** - Scale entire stack together
- ✅ **Cost effective** - Often cheaper than separate services

---

## 🔀 Choose Your Deployment Method

### Method 1: Docker Deployment (Easier)
**Recommended if you want simplicity and already have Docker setup**

- **Railway**: Best for Docker Compose, auto-scaling
- **Render**: Supports docker-compose.yml, familiar platform
- **DigitalOcean**: Good Docker support, predictable pricing

### Method 2: Separate Services (More Scalable)
**Recommended for production with high traffic**

- **Frontend**: Netlify (CDN, fast)
- **Backend**: Render (Java support, good for APIs)
- **Database**: Render PostgreSQL (managed, reliable)

---

## 🆓 Render Free Tier Deployment (Docker Alternative)

**Perfect for you!** Render supports your existing Docker setup with their free tier.

### Step 1: Deploy from GitHub
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository: `Siyam-Bhuiyan/WorldScars`
4. Render will detect your `render.yaml` and `docker-compose.yml`

### Step 2: Configure Services
Render will create 3 services automatically:
- **PostgreSQL Database** (Free tier)
- **Backend API** (Free tier - sleeps after 15min)
- **Frontend** (Free tier - static site)

### Step 3: Set Environment Secrets
In each service dashboard, add these environment variables:

**For Backend Service:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://worldscars-frontend.onrender.com
```

### Step 4: Deploy
1. Click **"Create Blueprint"**
2. Wait for all services to deploy (5-10 minutes)
3. Get your URLs from the service dashboards

### Step 5: Update CORS
After frontend deploys, update the backend's `FRONTEND_URL` with the actual frontend URL.

### 🎯 Free Tier Limitations
- **Web services sleep** after 15 minutes of inactivity
- **Database**: 512MB storage, limited connections
- **Static sites**: Unlimited bandwidth, always awake

### 🚀 Your URLs will be:
- **Frontend**: `https://worldscars-frontend.onrender.com`
- **Backend**: `https://worldscars-backend.onrender.com`
- **Database**: Managed PostgreSQL (internal only)

**Total Cost: $0/month** (but services sleep when inactive)

---

## 🌐 Separate Services Deployment (Advanced)
```

### 2.2 Deploy Backend Service

1. Click **"New +"** → **"Web Service"**
2. **Connect** your GitHub repository: `Siyam-Bhuiyan/WorldScars`
3. Configure build settings:
   ```
   Name: worldscars-backend
   Runtime: Java
   Build Command: ./mvnw clean package -DskipTests
   Start Command: java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```
4. **Environment**: Select all secrets you created
5. **Advanced**: Set health check path to `/api/test`
6. Click **"Create Web Service"**

### 2.3 Verify Backend Deployment

- Wait for deployment to complete (green status)
- Visit: `https://worldscars-backend.onrender.com/api/test`
- Should return: `{"message":"API is working!"}`

## 🌐 Step 3: Deploy Frontend (Netlify)

### 3.1 Deploy via Git (Recommended)

1. Go to [Netlify](https://netlify.com)
2. Click **"New site from Git"**
3. **Connect** GitHub repository: `Siyam-Bhuiyan/WorldScars`
4. Configure build settings:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
5. **Environment variables**:
   ```
   VITE_API_BASE_URL=https://worldscars-backend.onrender.com
   ```
6. Click **"Deploy site"**

### 3.2 Alternative: Manual Deploy

```bash
cd frontend
npm run build
# Drag and drop the 'dist' folder to Netlify dashboard
```

### 3.3 Get Frontend URL

- After deployment, copy your Netlify URL
- Example: `https://amazing-site-name.netlify.app`

## 🔄 Step 4: Update CORS Configuration

### 4.1 Update Backend Environment

1. Go to Render Dashboard → **worldscars-backend** → **Environment**
2. Update the `FRONTEND_URL` secret with your actual Netlify URL:
   ```
   FRONTEND_URL=https://your-actual-netlify-site.netlify.app
   ```
3. **Redeploy** the backend service

## ✅ Step 5: Verify Full Deployment

### 5.1 Test Endpoints

```bash
# Test backend health
curl https://worldscars-backend.onrender.com/api/test

# Test images endpoint
curl https://worldscars-backend.onrender.com/api/images
```

### 5.2 Test Frontend

- Visit your Netlify URL
- Try uploading an image
- Check gallery view
- Test delete functionality

### 5.3 Update README Links

Update the README.md with your actual URLs:

```markdown
- **Frontend**: [https://your-netlify-site.netlify.app](https://your-netlify-site.netlify.app)
- **Backend API**: [https://worldscars-backend.onrender.com](https://worldscars-backend.onrender.com)
```

## 🔧 Environment Variables Summary

### Frontend (Netlify)

```
VITE_API_BASE_URL=https://worldscars-backend.onrender.com
```

### Backend (Render Secrets)

```
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/worldscars
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[db-password]
CLOUDINARY_CLOUD_NAME=[cloudinary-name]
CLOUDINARY_API_KEY=[cloudinary-key]
CLOUDINARY_API_SECRET=[cloudinary-secret]
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## 🚨 Troubleshooting Deployment

### Database Issues

- **Connection failed**: Check DATABASE_URL format
- **Migration errors**: Verify database credentials

### Backend Issues

- **Build failed**: Check Maven wrapper permissions
- **CORS errors**: Verify FRONTEND_URL matches Netlify URL
- **Cloudinary errors**: Check API credentials

### Frontend Issues

- **API calls fail**: Verify VITE_API_BASE_URL
- **Build errors**: Check Node.js version (18+)

### Common Fixes

```bash
# Clear build cache
docker system prune -f

# Redeploy services
# Go to each service dashboard and click "Manual Deploy"
```

## 📊 Service Status Check

| Service  | URL                                       | Status Check                    |
| -------- | ----------------------------------------- | ------------------------------- |
| Database | Render Dashboard                          | Green indicator                 |
| Backend  | `https://[service].onrender.com/api/test` | `{"message":"API is working!"}` |
| Frontend | Netlify URL                               | Gallery loads, upload works     |

## 💰 Cost Comparison

### Docker Deployment (Single Platform)
- **Railway**: $5/month base + usage
- **Render Free Tier**: **$0/month** (services sleep after 15min inactivity)
- **Render Paid**: $7/month for web service + $7/month for DB
- **DigitalOcean**: $12/month (App Platform)

### Separate Services
- **Render PostgreSQL**: $7/month (Basic plan)
- **Render Web Service**: $7/month (Basic plan)
- **Netlify**: Free tier (100GB bandwidth)
- **Cloudinary**: Free tier (25GB storage)

**🎉 Render Free Tier is FREE and uses your Docker setup!**

## 🎯 Deployment Checklist

- [ ] Database created and running
- [ ] Backend secrets configured
- [ ] Backend deployed successfully
- [ ] Frontend deployed to Netlify
- [ ] CORS updated with actual frontend URL
- [ ] All services tested and working
- [ ] README updated with live URLs

---

**🎉 Your WorldScars application is now live with separate, scalable services!**
