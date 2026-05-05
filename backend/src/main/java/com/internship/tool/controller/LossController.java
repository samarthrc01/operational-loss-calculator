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

    // ✅ GET all (exclude deleted)
    @GetMapping
    public List<Loss> getAllLosses() {
        return lossRepository.findAll()
                .stream()
                .filter(loss -> !loss.isDeleted())
                .toList();
    }

    // ✅ GET by ID
    @GetMapping("/{id}")
    public Loss getLossById(@PathVariable Long id) {
        return lossRepository.findById(id)
                .filter(loss -> !loss.isDeleted())
                .orElseThrow(() -> new RuntimeException("Loss not found"));
    }

    // ✅ CREATE
    @PostMapping
    public Loss createLoss(@RequestBody Loss loss) {
        return lossRepository.save(loss);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Loss updateLoss(@PathVariable Long id, @RequestBody Loss updatedLoss) {

        Loss loss = lossRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loss not found"));

        loss.setAmount(updatedLoss.getAmount());
        loss.setDescription(updatedLoss.getDescription());

        return lossRepository.save(loss);
    }

    // ✅ DELETE (SOFT DELETE)
    @DeleteMapping("/{id}")
    public String deleteLoss(@PathVariable Long id) {

        Loss loss = lossRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loss not found"));

        loss.setDeleted(true);
        lossRepository.save(loss);

        return "Deleted successfully";
    }

    // ✅ SEARCH
    @GetMapping("/search")
    public List<Loss> searchLoss(@RequestParam String q) {
        return lossRepository.findAll()
                .stream()
                .filter(loss ->
                        !loss.isDeleted() &&
                        loss.getDescription().toLowerCase().contains(q.toLowerCase())
                )
                .toList();
    }

    // ✅ PAGINATION
    @GetMapping("/all")
    public Page<Loss> getAllLossesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return lossRepository.findAll(PageRequest.of(page, size));
    }

    // ✅ 🔥 DAY 7 FILTER (FIXED PROPERLY)
    @GetMapping("/filter")
    public List<Loss> filterLoss(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean deleted
    ) {
        return lossRepository.findAll().stream()
                .filter(l -> (q == null || l.getDescription().toLowerCase().contains(q.toLowerCase())))
                .filter(l -> (deleted == null || l.isDeleted() == deleted))
                .toList();
    }

    // ✅ DASHBOARD STATS
    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        List<Loss> losses = lossRepository.findAll()
                .stream()
                .filter(loss -> !loss.isDeleted())
                .toList();

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

    // ✅ 🔥 DAY 9: EXPORT CSV
    @GetMapping("/export")
    public void exportCSV(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=losses.csv");

        List<Loss> losses = lossRepository.findAll()
                .stream()
                .filter(l -> !l.isDeleted())
                .toList();

        PrintWriter writer = response.getWriter();

        writer.println("ID,Amount,Description");

        for (Loss l : losses) {
            writer.println(l.getId() + "," + l.getAmount() + "," + l.getDescription());
        }

        writer.flush();
        writer.close();
    }

    // ✅ 🔥 DAY 9: FILE UPLOAD
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
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

    // ✅ LOGIN
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String password = body.get("password");

        if ("admin".equals(username) && "admin123".equals(password)) {
            return "success";
        }

        throw new RuntimeException("Invalid credentials");
    }
}