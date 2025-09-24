package com.backend.service;

import com.backend.model.Image;
import com.backend.repository.ImageRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository repo;
    private final Cloudinary cloudinary;

    public Image save(Image image) {
        return repo.save(image);
    }

    public List<Image> getAll() {
        return repo.findAll();
    }

    public Image getById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Image not found with id: " + id));
    }

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
