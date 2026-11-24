package com.backend;

import com.backend.service.CloudinaryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ImageApiTests {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    CloudinaryService cloudinary;

    private static final MockMultipartFile JPEG =
            new MockMultipartFile("file", "a.jpg", "image/jpeg", new byte[]{1, 2, 3});

    @Test
    void healthIsOk() throws Exception {
        mvc.perform(get("/api/health")).andExpect(status().isOk());
    }

    @Test
    void missingImageIs404() throws Exception {
        mvc.perform(get("/api/images/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void uploadWithoutTokenIsRejected() throws Exception {
        mvc.perform(multipart("/api/images/upload").file(JPEG).param("title", "x"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadRejectsJavascriptSource() throws Exception {
        mvc.perform(multipart("/api/images/upload").file(JPEG)
                        .param("title", "x").param("source", "javascript:alert(1)")
                        .header("X-Admin-Token", "test-token"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void uploadRejectsNonImage() throws Exception {
        MockMultipartFile txt = new MockMultipartFile("file", "a.txt", "text/plain", new byte[]{1});
        mvc.perform(multipart("/api/images/upload").file(txt).param("title", "x")
                        .header("X-Admin-Token", "test-token"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void uploadListAndDeleteRoundTrip() throws Exception {
        when(cloudinary.upload(any())).thenReturn(
                new CloudinaryService.UploadResult("https://res.cloudinary.com/x/image/upload/v1/worldscars/abc.jpg", "worldscars/abc"));

        String body = mvc.perform(multipart("/api/images/upload").file(JPEG)
                        .param("title", "  Aftermath  ").param("location", "Marrakesh")
                        .param("source", "https://example.org/a")
                        .header("X-Admin-Token", "test-token"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Aftermath"))
                .andExpect(jsonPath("$.publicId").value("worldscars/abc"))
                .andReturn().getResponse().getContentAsString();
        String id = body.replaceAll(".*\"id\":(\\d+).*", "$1");

        mvc.perform(get("/api/images").param("q", "marra"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].title").value("Aftermath"))
                .andExpect(jsonPath("$.totalItems").value(1));

        mvc.perform(delete("/api/images/" + id).header("X-Admin-Token", "test-token"))
                .andExpect(status().isOk());
        verify(cloudinary).delete("worldscars/abc");

        mvc.perform(get("/api/images/" + id)).andExpect(status().isNotFound());
    }

    @Test
    void publicIdIsDerivedFromLegacyUrls() {
        assertThat(CloudinaryService.publicIdFromUrl(
                "https://res.cloudinary.com/demo/image/upload/v1712345/photo_name.jpg")).isEqualTo("photo_name");
        assertThat(CloudinaryService.publicIdFromUrl(
                "https://res.cloudinary.com/demo/image/upload/v1712345/worldscars/a1b2.png")).isEqualTo("worldscars/a1b2");
    }
}
