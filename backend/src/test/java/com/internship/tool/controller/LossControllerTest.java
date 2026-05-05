package com.internship.tool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.tool.entity.Loss;
import com.internship.tool.repository.LossRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class LossControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LossRepository lossRepository;

    // ✅ CREATE
    @Test
    void testCreateLoss() throws Exception {
        Loss loss = new Loss();
        loss.setAmount(500.0); // ✅ FIX
        loss.setDescription("Test Loss");
        loss.setDeleted(false);

        mockMvc.perform(post("/losses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loss)))
                .andExpect(status().isOk());
    }

    // ✅ GET ALL
    @Test
    void testGetAllLosses() throws Exception {
        mockMvc.perform(get("/losses"))
                .andExpect(status().isOk());
    }

    // ✅ GET BY ID
    @Test
    void testGetLossById() throws Exception {
        Loss loss = new Loss();
        loss.setAmount(1000.0);
        loss.setDescription("Sample");
        loss.setDeleted(false);

        loss = lossRepository.save(loss);

        mockMvc.perform(get("/losses/" + loss.getId()))
                .andExpect(status().isOk());
    }

    // ✅ UPDATE
    @Test
    void testUpdateLoss() throws Exception {
        Loss loss = new Loss();
        loss.setAmount(200.0);
        loss.setDescription("Old");
        loss.setDeleted(false);

        loss = lossRepository.save(loss);

        loss.setAmount(999.0); // ✅ FIX
        loss.setDescription("Updated");

        mockMvc.perform(put("/losses/" + loss.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loss)))
                .andExpect(status().isOk());
    }

    // ✅ DELETE
    @Test
    void testDeleteLoss() throws Exception {
        Loss loss = new Loss();
        loss.setAmount(300.0);
        loss.setDescription("Delete Me");
        loss.setDeleted(false);

        loss = lossRepository.save(loss);

        mockMvc.perform(delete("/losses/" + loss.getId()))
                .andExpect(status().isOk());
    }

    // ✅ FILTER
    @Test
    void testFilterLoss() throws Exception {
        mockMvc.perform(get("/losses/filter?q=test"))
                .andExpect(status().isOk());
    }

    // ✅ STATS
    @Test
    void testStats() throws Exception {
        mockMvc.perform(get("/losses/stats"))
                .andExpect(status().isOk());
    }
}