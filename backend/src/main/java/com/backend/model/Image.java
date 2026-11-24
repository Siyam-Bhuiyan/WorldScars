package com.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "images")
@Getter
@Setter
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500, nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(name = "image_url", length = 1000, nullable = false)
    private String imageUrl;

    /** Cloudinary public id, used to remove the file when the record is deleted. */
    @Column(name = "public_id", length = 300)
    private String publicId;

    @Column(length = 300)
    private String location;

    @Column(length = 1000)
    private String source;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
