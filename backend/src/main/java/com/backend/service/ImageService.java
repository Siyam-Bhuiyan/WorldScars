package com.backend.service;

import com.backend.exception.NotFoundException;
import com.backend.model.Image;
import com.backend.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository repo;
    private final CloudinaryService cloudinary;

    public Page<Image> list(String query, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "uploadedAt", "id"));
        if (query == null || query.isBlank()) {
            return repo.findAll(pageable);
        }
        return repo.search(query.trim(), pageable);
    }

    public Image getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Exhibit " + id + " not found"));
    }

    public Image create(MultipartFile file, String title, String description, String location, String source)
            throws IOException {
        CloudinaryService.UploadResult uploaded = cloudinary.upload(file);

        Image image = new Image();
        image.setTitle(title.trim());
        image.setDescription(clean(description));
        image.setLocation(clean(location));
        image.setSource(clean(source));
        image.setImageUrl(uploaded.url());
        image.setPublicId(uploaded.publicId());
        return repo.save(image);
    }

    @Transactional
    public void delete(Long id) {
        Image image = getById(id);
        String publicId = image.getPublicId() != null
                ? image.getPublicId()
                : CloudinaryService.publicIdFromUrl(image.getImageUrl());
        repo.delete(image);
        cloudinary.delete(publicId);
    }

    private static String clean(String s) {
        return s == null ? "" : s.trim();
    }
}
