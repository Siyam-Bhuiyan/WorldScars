package com.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private static final String FOLDER = "worldscars";
    // .../image/upload/[transformations/]v12345/<public_id>.<ext>
    private static final Pattern PUBLIC_ID_FROM_URL =
            Pattern.compile("/upload/(?:.*/)?v\\d+/(.+?)(?:\\.[a-zA-Z0-9]+)?$");

    private final Cloudinary cloudinary;

    public record UploadResult(String url, String publicId) {}

    /** Uploads with a server-generated unique name, so files never overwrite each other. */
    public UploadResult upload(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", FOLDER,
                        "use_filename", false,
                        "unique_filename", true,
                        "overwrite", false,
                        "resource_type", "image"
                ));
        return new UploadResult(
                String.valueOf(result.get("secure_url")),
                String.valueOf(result.get("public_id")));
    }

    /** Best-effort removal; a failure here must not block deleting the record. */
    public void delete(String publicId) {
        if (publicId == null || publicId.isBlank()) return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            log.warn("Could not delete Cloudinary asset {}: {}", publicId, e.getMessage());
        }
    }

    /** For records created before public ids were stored. */
    public static String publicIdFromUrl(String url) {
        if (url == null) return null;
        Matcher m = PUBLIC_ID_FROM_URL.matcher(url);
        return m.find() ? m.group(1) : null;
    }
}
