package com.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Hibernate's ddl-auto=update never widens an existing column, so databases created when
 * descriptions were limited to 2000 characters are widened once here (PostgreSQL only).
 */
@Component
public class SchemaWidener implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(SchemaWidener.class);
    private final JdbcTemplate jdbc;

    public SchemaWidener(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            String product = jdbc.execute((java.sql.Connection c) -> c.getMetaData().getDatabaseProductName());
            if ("PostgreSQL".equalsIgnoreCase(product)) {
                jdbc.execute("ALTER TABLE images ALTER COLUMN description TYPE varchar(10000)");
            }
        } catch (Exception e) {
            log.warn("Could not widen images.description: {}", e.getMessage());
        }
    }
}
