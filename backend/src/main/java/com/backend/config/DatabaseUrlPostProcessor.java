package com.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Lets DATABASE_URL be a provider-style URL (postgresql://user:pass@host/db?sslmode=require,
 * as given by Neon, Render, Heroku...) as well as a plain JDBC URL. Credentials inside the URL
 * are moved into the username/password properties.
 */
public class DatabaseUrlPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment env, SpringApplication app) {
        String url = env.getProperty("DATABASE_URL");
        Map<String, Object> out = convert(url);
        if (!out.isEmpty()) {
            env.getPropertySources().addFirst(new MapPropertySource("databaseUrl", out));
        }
    }

    static Map<String, Object> convert(String url) {
        Map<String, Object> out = new HashMap<>();
        if (url == null || !(url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            return out;
        }
        URI uri = URI.create(url.replaceFirst("^postgres://", "postgresql://"));
        int port = uri.getPort() == -1 ? 5432 : uri.getPort();
        String query = uri.getRawQuery() == null ? "" : "?" + uri.getRawQuery();
        out.put("spring.datasource.url", "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getRawPath() + query);
        if (uri.getUserInfo() != null) {
            String[] parts = uri.getUserInfo().split(":", 2);
            out.put("spring.datasource.username", java.net.URLDecoder.decode(parts[0], java.nio.charset.StandardCharsets.UTF_8));
            if (parts.length > 1) {
                out.put("spring.datasource.password", java.net.URLDecoder.decode(parts[1], java.nio.charset.StandardCharsets.UTF_8));
            }
        }
        return out;
    }
}
