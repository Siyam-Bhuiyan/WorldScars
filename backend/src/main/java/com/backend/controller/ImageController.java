package com.backend.controller;

import com.backend.model.Image;
import com.backend.service.CloudinaryService;
import com.backend.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;
    private final CloudinaryService cloudinaryService;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "location", required = false) String location) {
        
        try {
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);
            
            // Create and save image
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
    public List<Image> getAllImages() {
        return imageService.getAll();
    }

    @GetMapping("/{id}")
    public Image getImageById(@PathVariable Long id) {
        return imageService.getById(id);
    }
}