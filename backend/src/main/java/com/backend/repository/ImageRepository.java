package com.backend.repository;

import com.backend.model.Image;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query("""
            select i from Image i
            where lower(i.title) like lower(concat('%', :q, '%'))
               or lower(i.location) like lower(concat('%', :q, '%'))
               or lower(i.description) like lower(concat('%', :q, '%'))
            """)
    Page<Image> search(@Param("q") String q, Pageable pageable);
}
