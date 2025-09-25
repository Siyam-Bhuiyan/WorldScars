# Docker Setup

This project includes Docker support for easy deployment and development.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd WorldScars
   ```

2. **Build and run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

## Services

- **frontend**: React application served by Nginx (port 3000)
- **backend**: Spring Boot API server (port 8080)
- **db**: PostgreSQL database (port 5432)

## Development

### Running individual services

```bash
# Run only database
docker-compose up db

# Run backend only
docker-compose up backend

# Run frontend only
docker-compose up frontend
```

### Rebuilding services

```bash
# Rebuild and restart all services
docker-compose up --build --force-recreate

# Rebuild specific service
docker-compose up --build backend
```

### Database management

```bash
# Access PostgreSQL shell
docker-compose exec db psql -U postgres -d worldscars

# View logs
docker-compose logs db
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes (WARNING: deletes database data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
POSTGRES_DB=worldscars
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
SPRING_PROFILES_ACTIVE=docker
```

## Troubleshooting

### Port conflicts

If ports 3000, 8080, or 5432 are already in use, modify the `docker-compose.yml` file to use different ports:

```yaml
ports:
  - "3001:80" # frontend
  - "8081:8080" # backend
  - "5433:5432" # database
```

### Database connection issues

Ensure the database container is fully started before the backend:

```bash
docker-compose up db
# Wait for "database system is ready to accept connections"
docker-compose up backend
```

### Build failures

Clear Docker cache and rebuild:

```bash
docker system prune -f
docker-compose build --no-cache
```
