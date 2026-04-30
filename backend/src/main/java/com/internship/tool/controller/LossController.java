package com.internship.tool.controller;

import com.internship.tool.entity.Loss;
import com.internship.tool.repository.LossRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/losses")
public class LossController {

    private final LossRepository lossRepository;

    public LossController(LossRepository lossRepository) {
        this.lossRepository = lossRepository;
    }

    // ✅ GET all losses
    @GetMapping
    public List<Loss> getAllLosses() {
        return lossRepository.findAll();
    }

    // ✅ ADD THIS (VERY IMPORTANT)
    @PostMapping
    public Loss createLoss(@RequestBody Loss loss) {
        return lossRepository.save(loss);
    }
}