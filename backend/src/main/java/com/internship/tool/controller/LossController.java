package com.internship.tool.controller;

import com.internship.tool.entity.Loss;
import com.internship.tool.repository.LossRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletResponse;

import java.io.PrintWriter;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/losses")
public class LossController {

    private final LossRepository lossRepository;

    public LossController(LossRepository lossRepository) {
        this.lossRepository = lossRepository;
    }

    // ✅ 1. GET ALL
    @GetMapping
    public List<Loss> getAllLosses() {
        return lossRepository.findByDeletedFalse();
    }

    // ✅ 2. GET BY ID (FIXED ERROR MESSAGE)
    @GetMapping("/{id}")
    public Loss getLossById(@PathVariable Long id) {
        return lossRepository.findById(id)
                .filter(loss -> !loss.isDeleted())
                .orElseThrow(() ->
                        new RuntimeException("Loss not found with ID: " + id)
                );
    }

    // ✅ 3. CREATE
    @PostMapping
    public Loss createLoss(@RequestBody Loss loss) {
        return lossRepository.save(loss);
    }

    // ✅ 4. UPDATE (FIXED ERROR MESSAGE)
    @PutMapping("/{id}")
    public Loss updateLoss(@PathVariable Long id, @RequestBody Loss updatedLoss) {

        Loss loss = lossRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Loss not found with ID: " + id)
                );

        loss.setAmount(updatedLoss.getAmount());
        loss.setDescription(updatedLoss.getDescription());

        return lossRepository.save(loss);
    }

    // ✅ 5. DELETE (FIXED ERROR MESSAGE)
    @DeleteMapping("/{id}")
    public String deleteLoss(@PathVariable Long id) {

        Loss loss = lossRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Loss not found with ID: " + id)
                );

        loss.setDeleted(true);
        lossRepository.save(loss);

        return "Deleted successfully";
    }

    // ✅ 6. SEARCH
    @GetMapping("/search")
    public Page<Loss> searchLoss(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return lossRepository.findByDescriptionContainingIgnoreCaseAndDeletedFalse(
                q,
                PageRequest.of(page, size)
        );
    }

    // ✅ 7. PAGINATION
    @GetMapping("/all")
    public Page<Loss> getAllLossesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return lossRepository.findByDeletedFalse(PageRequest.of(page, size));
    }

    // ✅ 8. FILTER (REMOVED DEBUG LOG ✔)
   @GetMapping("/filter")
public Page<Loss> filterLoss(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) Boolean deleted,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
) {

    // If no search query
    if (q == null || q.trim().isEmpty()) {

        // Show only non-deleted
        return lossRepository.findByDeletedFalse(
                PageRequest.of(page, size)
        );
    }

    // Search by description
    return lossRepository.findByDescriptionContainingIgnoreCaseAndDeletedFalse(
            q,
            PageRequest.of(page, size)
    );
}
    // ✅ 9. STATS
    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        List<Loss> losses = lossRepository.findByDeletedFalse();

        double total = losses.stream().mapToDouble(Loss::getAmount).sum();
        double average = losses.isEmpty() ? 0 : total / losses.size();
        double max = losses.stream().mapToDouble(Loss::getAmount).max().orElse(0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLoss", total);
        stats.put("averageLoss", average);
        stats.put("maxLoss", max);
        stats.put("count", losses.size());

        return stats;
    }

    // ✅ 10. EXPORT CSV
    @GetMapping("/export")
    public void exportCSV(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=losses.csv");

        List<Loss> losses = lossRepository.findByDeletedFalse();

        PrintWriter writer = response.getWriter();

        writer.println("ID,Amount,Description");

        for (Loss l : losses) {
            writer.println(l.getId() + "," + l.getAmount() + "," + l.getDescription());
        }

        writer.flush();
        writer.close();
    }

    // ✅ 11. FILE UPLOAD (IMPROVED ERROR MESSAGES)
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("Uploaded file is empty");
        }

        if (file.getSize() > 1024 * 1024) {
            throw new RuntimeException("File size must be less than 1MB");
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null || !fileName.toLowerCase().endsWith(".csv")) {
            throw new RuntimeException("Only CSV files are allowed");
        }

        return "File uploaded successfully: " + fileName;
    }

    // ✅ 12. LOGIN (IMPROVED MESSAGE)
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String password = body.get("password");

        if ("admin".equals(username) && "admin123".equals(password)) {
            return "success";
        }

        throw new RuntimeException("Invalid username or password");
    }
}