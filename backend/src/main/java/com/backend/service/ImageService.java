package com.backend.service;

import com.backend.model.Image;
import com.backend.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository repo;

    public Image save(Image image) {
        return repo.save(image);
    }

    public List<Image> getAll() {
        return repo.findAll();
    }

    public Image getById(Long id) {
        return repo.findById(id).orElse(null);
    }
}
