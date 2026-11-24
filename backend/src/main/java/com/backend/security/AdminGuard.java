package com.backend.security;

import com.backend.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * Minimal write protection: uploads and deletes require the X-Admin-Token header
 * to match the ADMIN_TOKEN environment variable. If ADMIN_TOKEN is not set,
 * all writes are refused.
 */
@Component
public class AdminGuard {

    public static final String HEADER = "X-Admin-Token";

    private final byte[] expected;

    public AdminGuard(@Value("${app.admin-token:}") String adminToken) {
        this.expected = adminToken == null || adminToken.isBlank()
                ? null
                : adminToken.getBytes(StandardCharsets.UTF_8);
    }

    public void check(String provided) {
        if (expected == null) {
            throw new UnauthorizedException("Writes are disabled: ADMIN_TOKEN is not configured on the server");
        }
        if (provided == null
                || !MessageDigest.isEqual(expected, provided.getBytes(StandardCharsets.UTF_8))) {
            throw new UnauthorizedException("Invalid clearance key");
        }
    }
}
