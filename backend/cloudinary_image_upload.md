# 📸 Cloudinary Image Upload Integration Guide for Spring Boot

A universal, step-by-step guide for implementing Cloudinary image upload functionality in any Spring Boot application. Copy-paste ready code and configuration for quick integration.

## 🎯 Overview

This guide provides a complete backend implementation for uploading images to Cloudinary cloud storage service using Spring Boot. Works with any database (PostgreSQL, MySQL, H2, etc.) and can be adapted to any project structure.

---

## 📋 Prerequisites

- Java 11+ (recommended Java 17+)
- Spring Boot 2.7+ or 3.x
- Any database (PostgreSQL, MySQL, H2, etc.)
- Cloudinary account (free tier available at cloudinary.com)
- Maven or Gradle build tool

---

## 🔧 Backend Implementation

### 1. Maven Dependencies (pom.xml)

Add these essential dependencies to your `pom.xml`:

```xml
<!-- Cloudinary Dependencies -->
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http5</artifactId>
    <version>2.0.0</version>
</dependency>
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-taglib</artifactId>
    <version>2.0.0</version>
</dependency>

<!-- Spring Boot Starters -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Database Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>

<!-- Lombok for boilerplate reduction -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

### 2. Get Cloudinary Credentials

1. **Sign up at [cloudinary.com](https://cloudinary.com/users/register_free)**
2. **Go to Dashboard** and copy:
   - Cloud Name
   - API Key
   - API Secret

### 3. Environment Configuration

**Create `.env` file in project root (for security):**

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**Update `application.properties`:**

```properties
# Cloudinary Configuration
cloudinary.cloud_name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api_key=${CLOUDINARY_API_KEY}
cloudinary.api_secret=${CLOUDINARY_API_SECRET}

# File Upload Configuration (Optional - adjust as needed)
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 4. Cloudinary Configuration Class

**File: `src/main/java/com/yourpackage/config/CloudinaryConfig.java`**

```java
package com.yourpackage.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }
}
```

### 5. Image Entity (JPA Model)

**File: `src/main/java/com/yourpackage/model/Image.java`**
_(Replace `Image` with your preferred entity name like `Photo`, `Media`, etc.)_

```java
package com.yourpackage.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String imageUrl;

    private String cloudinaryPublicId;
    private String location;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
```

### 6. Repository Interface

**File: `src/main/java/com/yourpackage/repository/ImageRepository.java`**

```java
package com.yourpackage.repository;

import com.yourpackage.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
}
```

### 7. Cloudinary Service

**File: `src/main/java/com/yourpackage/service/CloudinaryService.java`**

```java
package com.yourpackage.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap(
                "use_filename", true,
                "unique_filename", false,
                "overwrite", true,
                "resource_type", "image"
            )
        );
        return uploadResult.get("secure_url").toString();
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
```

### 8. Image Service (Business Logic)

**File: `src/main/java/com/yourpackage/service/ImageService.java`**

```java
package com.yourpackage.service;

import com.yourpackage.model.Image;
import com.yourpackage.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository repository;

    public Image save(Image image) {
        return repository.save(image);
    }

    public List<Image> getAll() {
        return repository.findAll();
    }

    public Image getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Image not found with id: " + id));
    }
}
```

### 9. REST Controller (API Endpoints)

**File: `src/main/java/com/yourpackage/controller/ImageController.java`**

```java
package com.yourpackage.controller;

import com.yourpackage.model.Image;
import com.yourpackage.service.CloudinaryService;
import com.yourpackage.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;
    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "location", required = false) String location) {

        try {
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);

            // Create and save image entity
            Image image = new Image();
            image.setTitle(title);
            image.setDescription(description != null ? description : "");
            image.setImageUrl(imageUrl);
            image.setLocation(location != null ? location : "");

            Image savedImage = imageService.save(image);
            return ResponseEntity.ok(savedImage);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Image>> getAllImages() {
        try {
            List<Image> images = imageService.getAll();
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
```

---

## 🔑 Key Configuration Points

### Database Setup

- Ensure your database is running (PostgreSQL, MySQL, H2, etc.)
- Update `application.properties` with your database connection details
- Image table will be auto-created by JPA

### Cloudinary Setup

1. ✅ **Free account** at cloudinary.com (no credit card required)
2. ✅ **Copy credentials** from dashboard
3. ✅ **Store in `.env` file** (never commit secrets to git)
4. ✅ **Add `.env` to `.gitignore`**

### File Upload Settings

- **Max file size**: 10MB (configurable in application.properties)
- **Supported formats**: All image types (JPG, PNG, GIF, WebP, etc.)
- **Storage**: Files uploaded to Cloudinary, URLs stored in your database

---

## 🚀 Testing the Implementation

### 1. Start Your Application

```bash
# For Maven
./mvnw spring-boot:run

# For Gradle
./gradlew bootRun
```

### 2. Test Upload Endpoint

```bash
curl -X POST http://localhost:8080/api/images/upload \
  -F "file=@/path/to/your-image.jpg" \
  -F "title=Test Image" \
  -F "description=Test Description" \
  -F "location=Optional Location"
```

### 3. Test Get All Images

```bash
curl http://localhost:8080/api/images
```

### 4. Test in Browser (Optional)

- Visit: `http://localhost:8080/api/images` to see uploaded images JSON
- Use Postman for easier file upload testing

---

## ⚠️ Common Issues & Solutions

### Issue 1: "CloudinaryService not found"

**Solution:**

- Check package names match your project structure
- Ensure Maven/Gradle dependencies are loaded
- Run `./mvnw clean compile` or `./gradlew clean build`

### Issue 2: "Cannot autowire Cloudinary bean"

**Solution:**

- Verify CloudinaryConfig class has `@Configuration` annotation
- Check `.env` file exists and has correct variable names
- Restart your application

### Issue 3: "builder() method not found"

**Solution:**

- Add `@Builder` to Image entity, OR
- Use setter methods as shown in the controller example

### Issue 4: Database connection errors

**Solution:**

- Verify your database is running
- Check connection properties in `application.properties`
- Ensure database exists (create it manually if needed)

### Issue 5: File upload size errors

**Solution:**

- Check `spring.servlet.multipart.max-file-size` in application.properties
- Increase the limit if needed: `spring.servlet.multipart.max-file-size=50MB`

### Issue 6: CORS errors from frontend

**Solution:**

- Update `@CrossOrigin(origins = "http://localhost:3000")` with your frontend URL
- Or use `@CrossOrigin(origins = "*")` for development (not production)

---

## 📊 API Response Examples

### Successful Upload Response

```json
{
  "id": 1,
  "title": "My Test Image",
  "description": "A test image uploaded to Cloudinary",
  "imageUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sample.jpg",
  "location": "New York",
  "uploadedAt": "2025-09-24T10:30:00"
}
```

### Successful Get All Images Response

```json
[
  {
    "id": 1,
    "title": "Image 1",
    "imageUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/image1.jpg",
    "uploadedAt": "2025-09-24T10:30:00"
  },
  {
    "id": 2,
    "title": "Image 2",
    "imageUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567891/image2.jpg",
    "uploadedAt": "2025-09-24T10:31:00"
  }
]
```

### Error Response

```json
{
  "error": "Upload failed: File size exceeds maximum limit"
}
```

---

## 🔐 Security Considerations

1. **Environment Variables:** ✅ Always use `.env` file for API keys
2. **File Validation:** ✅ Validate file types and sizes on server side
3. **CORS Configuration:** ✅ Configure CORS for your specific frontend domain
4. **Rate Limiting:** Consider implementing rate limiting for upload endpoints
5. **Authentication:** Add authentication/authorization as needed for your app
6. **Input Sanitization:** Sanitize user inputs (title, description, etc.)

## 📝 Customization Options

### Change File Upload Parameters

```java
// In CloudinaryService.java - modify uploadImage() method
Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
    ObjectUtils.asMap(
        "use_filename", true,           // Use original filename
        "unique_filename", false,       // Don't make filename unique
        "overwrite", true,              // Overwrite if exists
        "resource_type", "image",       // Only images
        "folder", "my-app-images",      // Organize in folder
        "transformation", "c_limit,w_1000,h_1000"  // Auto-resize
    )
);
```

### Add More Image Fields

```java
// Add to Image.java entity
private String originalFilename;
private Long fileSize;
private String contentType;
private String tags;
```

### Different Database

```properties
# For MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/your_db
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# For H2 (in-memory - good for testing)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
```

---

## ✅ Quick Checklist

Before asking for help, ensure you have:

- [ ] ✅ Added Cloudinary dependencies to `pom.xml` or `build.gradle`
- [ ] ✅ Created `.env` file with correct Cloudinary credentials
- [ ] ✅ Created CloudinaryConfig class with `@Configuration` annotation
- [ ] ✅ Created Image entity with JPA annotations
- [ ] ✅ Created ImageRepository interface extending JpaRepository
- [ ] ✅ Created CloudinaryService with upload method
- [ ] ✅ Created ImageService for database operations
- [ ] ✅ Created ImageController with upload endpoint
- [ ] ✅ Your database is running and accessible
- [ ] ✅ Application starts without errors

---

This implementation provides a **robust, production-ready image upload system** with Cloudinary integration that can be used in **any Spring Boot application**. Simply replace package names with your own and customize as needed!
