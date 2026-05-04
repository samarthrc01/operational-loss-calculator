package com.internship.tool.controller;

import com.internship.tool.entity.Loss;
import com.internship.tool.repository.LossRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

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

    // ✅ GET by ID (NEW - for detail page)
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

    // ✅ DASHBOARD STATS (DAY 6 MAIN FEATURE)
    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        List<Loss> losses = lossRepository.findAll()
                .stream()
                .filter(loss -> !loss.isDeleted())
                .toList();

        double total = losses.stream()
                .mapToDouble(Loss::getAmount)
                .sum();

        double average = losses.isEmpty() ? 0 : total / losses.size();

        double max = losses.stream()
                .mapToDouble(Loss::getAmount)
                .max()
                .orElse(0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLoss", total);
        stats.put("averageLoss", average);
        stats.put("maxLoss", max);
        stats.put("count", losses.size());

        return stats;
    }

    // ✅ LOGIN API
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> body) {

        System.out.println("BODY: " + body);

        String username = body.get("username");
        String password = body.get("password");

        if (username != null && password != null &&
                username.trim().equals("admin") &&
                password.trim().equals("admin123")) {
            return "success";
        }

        throw new RuntimeException("Invalid credentials");
    }
}