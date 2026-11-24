# Root Dockerfile used by Railway for the backend service (build context = repo root).
# Mirrors backend/Dockerfile.

# ---- build ----
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline
COPY backend/src ./src
RUN ./mvnw -B -q clean package -DskipTests && cp target/backend-*.jar app.jar

# ---- run ----
FROM eclipse-temurin:17-jre
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/app.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
