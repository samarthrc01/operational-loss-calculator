package com.internship.tool.repository;

import com.internship.tool.entity.Loss;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LossRepository extends JpaRepository<Loss, Long> {

    // ✅ Get only non-deleted records
    List<Loss> findByDeletedFalse();

    // ✅ Search by description (case-insensitive)
    List<Loss> findByDescriptionContainingIgnoreCaseAndDeletedFalse(String description);

}