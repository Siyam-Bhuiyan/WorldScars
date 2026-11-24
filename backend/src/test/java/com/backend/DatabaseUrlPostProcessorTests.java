package com.backend.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DatabaseUrlPostProcessorTests {

    @Test
    void convertsNeonStyleUrl() {
        var m = DatabaseUrlPostProcessor.convert("postgresql://bob:p%40ss@ep-x.neon.tech/neondb?sslmode=require");
        assertThat(m.get("spring.datasource.url")).isEqualTo("jdbc:postgresql://ep-x.neon.tech:5432/neondb?sslmode=require");
        assertThat(m.get("spring.datasource.username")).isEqualTo("bob");
        assertThat(m.get("spring.datasource.password")).isEqualTo("p@ss");
    }

    @Test
    void leavesJdbcUrlsAlone() {
        assertThat(DatabaseUrlPostProcessor.convert("jdbc:postgresql://h:5432/d")).isEmpty();
        assertThat(DatabaseUrlPostProcessor.convert(null)).isEmpty();
    }
}
