# WorldScars 🌍

A powerful web application that preserves and shares historical images, documenting the scars of our world through visual storytelling.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 📸 **Image Upload**: Upload historical images with metadata
- 🖼️ **Gallery View**: Beautiful responsive gallery with hover effects
- 🔍 **Image Details**: Detailed view with full metadata and source links
- 🗑️ **Delete Functionality**: Remove images with confirmation
- 🔗 **Source Links**: Attach source URLs to images
- 📱 **Responsive Design**: Works on all devices
- 🚀 **Production Ready**: Optimized for deployment

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Netlify** - Frontend hosting

### Backend

- **Spring Boot 3** - Java web framework
- **Spring Data JPA** - Database access
- **PostgreSQL** - Production database
- **Cloudinary** - Image storage and optimization
- **Render** - Backend hosting

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Local development
- **Maven** - Java dependency management

## 🌐 Live Demo

- **Frontend**: [https://worldscars.netlify.app](https://worldscars.netlify.app)
- **Backend API**: [https://worldscars-backend.onrender.com](https://worldscars-backend.onrender.com)
- **Database**: PostgreSQL on Render

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+ and Maven
- **Docker** and Docker Compose
- **Git**
- **Cloudinary** account (for image storage)

## 🚀 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/Siyam-Bhuiyan/WorldScars.git
cd WorldScars
```

### 2. Environment Setup

#### Backend Environment Variables

Create `.env` file in the root directory:

```env
# Database
POSTGRES_DB=worldscars
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Application
SPRING_PROFILES_ACTIVE=docker

# Cloudinary (get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend Environment Variables

Create `.env.local` in `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up --build

# Or start individual services
docker-compose up db          # Database only
docker-compose up backend     # Backend only
docker-compose up frontend    # Frontend only
```

### 4. Manual Setup (Alternative)

#### Backend Setup

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 🚀 Deployment

### Frontend Deployment (Netlify)

#### Option 1: Git Integration (Recommended)

1. **Connect Repository**:

   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**:

   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

3. **Environment Variables**:

   ```
   VITE_API_BASE_URL=https://worldscars-backend.onrender.com
   ```

4. **Deploy**: Push to main branch or click "Deploy site"

#### Option 2: Manual Deploy

```bash
cd frontend
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Backend Deployment (Render)

#### 1. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `worldscars-db`
   - **Database**: `worldscars`
   - **Username**: `postgres`
4. **Copy the connection string**

#### 2. Set Up Secrets

Go to Render Dashboard → Settings → Secrets, add:

```env
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/worldscars
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[your-db-password]
CLOUDINARY_CLOUD_NAME=[your-cloudinary-cloud-name]
CLOUDINARY_API_KEY=[your-cloudinary-api-key]
CLOUDINARY_API_SECRET=[your-cloudinary-api-secret]
FRONTEND_URL=https://worldscars.netlify.app
```

#### 3. Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `worldscars-backend`
   - **Runtime**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
4. **Environment**: Add all secrets
5. **Deploy**

### Database Deployment (Render PostgreSQL)

Already covered in Backend deployment step 1. Your database will be:

- **Host**: `[your-db-host].render.com`
- **Port**: `5432`
- **Database**: `worldscars`
- **Username**: `postgres`

## 📚 API Documentation

### Base URL

```
Production: https://worldscars-backend.onrender.com
Local: http://localhost:8080
```

### Endpoints

#### GET /api/images

Get all images

```bash
curl https://worldscars-backend.onrender.com/api/images
```

#### GET /api/images/{id}

Get image by ID

```bash
curl https://worldscars-backend.onrender.com/api/images/1
```

#### POST /api/images/upload

Upload new image

```bash
curl -X POST https://worldscars-backend.onrender.com/api/images/upload \
  -F "file=@image.jpg" \
  -F "title=Historical Event" \
  -F "description=Description here" \
  -F "location=Location" \
  -F "source=https://source-url.com"
```

#### DELETE /api/images/{id}

Delete image by ID

```bash
curl -X DELETE https://worldscars-backend.onrender.com/api/images/1
```

#### GET /api/test

Health check

```bash
curl https://worldscars-backend.onrender.com/api/test
```

## 🔧 Environment Variables

### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8080  # Local development
VITE_API_BASE_URL=https://worldscars-backend.onrender.com  # Production
```

### Backend (.env)

```env
# Database
POSTGRES_DB=worldscars
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Application
SPRING_PROFILES_ACTIVE=docker

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Production (Render)
DATABASE_URL=postgresql://...
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
FRONTEND_URL=https://worldscars.netlify.app
```

## 🗄️ Database Schema

```sql
CREATE TABLE images (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description VARCHAR(2000),
    image_url VARCHAR(1000) NOT NULL,
    location VARCHAR(300),
    source VARCHAR(1000),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors

- **Local**: Check `@CrossOrigin` annotation in `ImageController.java`
- **Production**: Verify `FRONTEND_URL` environment variable

#### 2. Database Connection

- **Local**: Ensure PostgreSQL container is running
- **Production**: Check Render database credentials

#### 3. Image Upload Issues

- Check Cloudinary credentials
- Verify file size limits
- Check network connectivity

#### 4. Build Failures

```bash
# Clear Docker cache
docker system prune -f
docker-compose build --no-cache

# Clear npm cache
cd frontend && npm cache clean --force
```

#### 5. Port Conflicts

- Change ports in `docker-compose.yml` if needed
- Update frontend API calls accordingly

### Logs

```bash
# Docker logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Application logs (in production)
# Check Render dashboard for logs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for frontend code
- Follow Spring Boot best practices
- Write descriptive commit messages
- Test locally before pushing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Images stored on [Cloudinary](https://cloudinary.com)
- Hosted on [Netlify](https://netlify.com) and [Render](https://render.com)
- Built with [React](https://reactjs.org) and [Spring Boot](https://spring.io/projects/spring-boot)

---

**Made with ❤️ for preserving history through visual storytelling**
