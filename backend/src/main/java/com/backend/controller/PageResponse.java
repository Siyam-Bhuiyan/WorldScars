package com.backend.controller;

import org.springframework.data.domain.Page;

import java.util.List;

/** Stable JSON shape for paginated lists (Spring's PageImpl is not a stable API). */
public record PageResponse<T>(List<T> items, int page, int size, long totalItems, int totalPages, boolean last) {

    public static <T> PageResponse<T> of(Page<T> p) {
        return new PageResponse<>(p.getContent(), p.getNumber(), p.getSize(),
                p.getTotalElements(), p.getTotalPages(), p.isLast());
    }
}
