# 📸 Cloudinary Image Upload Backend Integration Guide

A comprehensive guide for integrating Cloudinary image upload functionality in Spring Boot applications. This document provides the exact code and configuration needed for successful image uploads.

## 🎯 Overview

This guide covers the backend implementation for uploading images to Cloudinary cloud storage service using Spring Boot, JPA, and PostgreSQL.

---

## 📋 Prerequisites

- Java 17+
- Spring Boot 3.x
- PostgreSQL database
- Cloudinary account (free tier available)
- Maven build tool

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

### 2. Environment Configuration

**Create `.env` file (for security):**

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Update `application.properties`:**

```properties
# Cloudinary Configuration
cloudinary.cloud_name=${CLOUDINARY_CLOUD_NAME:default_cloud_name}
cloudinary.api_key=${CLOUDINARY_API_KEY:default_api_key}
cloudinary.api_secret=${CLOUDINARY_API_SECRET:default_api_secret}

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 3. Cloudinary Configuration Class

**File: `src/main/java/com/backend/config/CloudinaryConfig.java`**

```java
package com.backend.config;

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

### 4. Image Entity (JPA Model)

**File: `src/main/java/com/backend/model/Image.java`**

```java
package com.backend.model;

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

### 5. Repository Interface

**File: `src/main/java/com/backend/repository/ImageRepository.java`**

```java
package com.backend.repository;

import com.backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
}
```

### 6. Cloudinary Service

**File: `src/main/java/com/backend/service/CloudinaryService.java`**

```java
package com.backend.service;

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

### 7. Image Service (Business Logic)

**File: `src/main/java/com/backend/service/ImageService.java`**

```java
package com.backend.service;

import com.backend.model.Image;
import com.backend.repository.ImageRepository;
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

### 8. REST Controller (API Endpoints)

**File: `src/main/java/com/backend/controller/ImageController.java`**

```java
package com.backend.controller;

import com.backend.model.Image;
import com.backend.service.CloudinaryService;
import com.backend.service.ImageService;
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

- Ensure PostgreSQL is running
- Create database and update connection properties
- Table will be auto-created by JPA

### Cloudinary Setup

1. Create free account at cloudinary.com
2. Get Cloud Name, API Key, and API Secret from dashboard
3. Store credentials in `.env` file (never commit to version control)

### File Upload Settings

- Max file size: 10MB (configurable in application.properties)
- Supported formats: All image types
- Files are uploaded to Cloudinary, URLs stored in database

---

## 🚀 Testing the Implementation

### 1. Start the Application

```bash
./mvnw spring-boot:run
```

### 2. Test Upload Endpoint

```bash
curl -X POST http://localhost:8080/api/images/upload \
  -F "file=@/path/to/image.jpg" \
  -F "title=Test Image" \
  -F "description=Test Description"
```

### 3. Test Get All Images

```bash
curl http://localhost:8080/api/images
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "CloudinaryService not found"

**Solution:** Ensure all files are in correct packages and Maven dependencies are properly loaded.

### Issue 2: "builder() method not found"

**Solution:** Either add `@Builder` to Image entity or use setter methods as shown in the controller.

### Issue 3: Database connection errors

**Solution:** Verify PostgreSQL is running and connection properties are correct.

### Issue 4: File upload size errors

**Solution:** Check `spring.servlet.multipart.max-file-size` setting in application.properties.

---

## 📊 API Response Examples

### Successful Upload Response

```json
{
  "id": 1,
  "title": "Historic Building",
  "description": "A beautiful historic building",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg",
  "location": "New York",
  "uploadedAt": "2025-09-24T10:30:00"
}
```

### Error Response

```json
{
  "error": "Upload failed: File size exceeds maximum limit"
}
```

---

## 🔐 Security Considerations

1. **Environment Variables:** Always use environment variables for sensitive data
2. **File Validation:** Validate file types and sizes on the server side
3. **CORS Configuration:** Configure CORS properly for your frontend domain
4. **Rate Limiting:** Consider implementing rate limiting for upload endpoints

---

This implementation provides a robust, production-ready image upload system with Cloudinary integration for Spring Boot applications.
