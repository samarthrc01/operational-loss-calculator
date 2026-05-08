package com.internship.tool.repository;

import com.internship.tool.entity.Loss;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LossRepository extends JpaRepository<Loss, Long> {

    // ✅ 1. Get only non-deleted records
    List<Loss> findByDeletedFalse();

    // ✅ 2. Pagination + Non-deleted
    Page<Loss> findByDeletedFalse(Pageable pageable);

    // ✅ 3. Search (Optimized + Pagination)
    Page<Loss> findByDescriptionContainingIgnoreCaseAndDeletedFalse(
            String description,
            Pageable pageable
    );


    // ✅ 4. 🔥 FIXED FILTER (Native Query - PostgreSQL Safe)
@Query(value = """
    SELECT * FROM loss l
    WHERE (:q IS NULL OR LOWER(l.description) LIKE LOWER(CONCAT('%', :q, '%')))
    AND (:deleted IS NULL OR l.deleted = :deleted)
    """,
    countQuery = """
    SELECT COUNT(*) FROM loss l
    WHERE (:q IS NULL OR LOWER(l.description) LIKE LOWER(CONCAT('%', :q, '%')))
    AND (:deleted IS NULL OR l.deleted = :deleted)
    """,
    nativeQuery = true)
Page<Loss> filterLossesWithPagination(
        @Param("q") String q,
        @Param("deleted") Boolean deleted,
        Pageable pageable
);
}