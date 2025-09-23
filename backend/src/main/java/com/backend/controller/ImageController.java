package com.backend.controller;

import com.backend.model.Image;
import com.backend.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*") // allow React frontend
@RequiredArgsConstructor    // generates constructor for final fields
public class ImageController {

    private final ImageService imageService; // clearer naming

    @PostMapping
    public Image uploadImage(@RequestBody Image image) {
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
