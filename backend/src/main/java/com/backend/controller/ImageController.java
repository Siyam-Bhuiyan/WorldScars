package com.backend.controller;

import com.backend.exception.BadRequestException;
import com.backend.model.Image;
import com.backend.security.AdminGuard;
import com.backend.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp", "image/gif", "image/avif");

    private final ImageService imageService;
    private final AdminGuard adminGuard;

    @GetMapping
    public PageResponse<Image> list(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "24") int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 60);
        return PageResponse.of(imageService.list(q, safePage, safeSize));
    }

    @GetMapping("/{id}")
    public Image get(@PathVariable Long id) {
        return imageService.getById(id);
    }

    @PostMapping("/upload")
    public ResponseEntity<Image> upload(
            @RequestHeader(value = AdminGuard.HEADER, required = false) String token,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "source", required = false) String source) throws IOException {

        adminGuard.check(token);
        validate(file, title, description, location, source);

        Image saved = imageService.create(file, title, description, location, source);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(
            @RequestHeader(value = AdminGuard.HEADER, required = false) String token,
            @PathVariable Long id) {
        adminGuard.check(token);
        imageService.delete(id);
        return Map.of("status", "deleted");
    }

    private static void validate(MultipartFile file, String title, String description, String location, String source) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("An image file is required");
        }
        if (file.getContentType() == null || !ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Only JPEG, PNG, WebP, GIF or AVIF images are accepted");
        }
        if (title == null || title.isBlank()) {
            throw new BadRequestException("Title is required");
        }
        maxLength("Title", title, 500);
        maxLength("Description", description, 10000);
        maxLength("Location", location, 300);
        maxLength("Source", source, 1000);

        // Only http(s) links: blocks javascript: and data: URLs being rendered as links.
        if (source != null && !source.isBlank()) {
            try {
                URI uri = URI.create(source.trim());
                String scheme = uri.getScheme();
                if (scheme == null || !(scheme.equalsIgnoreCase("http") || scheme.equalsIgnoreCase("https"))
                        || uri.getHost() == null) {
                    throw new BadRequestException("Source must be an http(s) link");
                }
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Source must be a valid link");
            }
        }
    }

    private static void maxLength(String field, String value, int max) {
        if (value != null && value.trim().length() > max) {
            throw new BadRequestException(field + " must be at most " + max + " characters");
        }
    }
}
