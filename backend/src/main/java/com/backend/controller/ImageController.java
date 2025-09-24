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
@CrossOrigin(origins = "*") 
@RequiredArgsConstructor    
public class ImageController {

    private final ImageService imageService; 
    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<Image> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "location", required = false) String location) {
        
        try {
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);
            
            // Save to database
            Image image = Image.builder()
                    .title(title)
                    .description(description)
                    .imageUrl(imageUrl)
                    .location(location)
                    .build();
            
            Image savedImage = imageService.save(image);
            return ResponseEntity.ok(savedImage);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public Image uploadImageByUrl(@RequestBody Image image) {
        return imageService.save(image);
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
