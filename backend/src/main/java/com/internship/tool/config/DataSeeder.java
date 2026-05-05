package com.internship.tool.config;

import com.internship.tool.entity.Loss;
import com.internship.tool.repository.LossRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initData(LossRepository repository) {
        return args -> {

            // Avoid duplicate data
            if (repository.count() > 0) {
                return;
            }

            String[] descriptions = {
                    "System failure", "Network outage", "Data breach",
                    "Hardware damage", "Power failure", "Server crash",
                    "Human error", "Software bug", "Security issue",
                    "Database corruption"
            };

            Random random = new Random();

            for (int i = 0; i < 15; i++) {
                Loss loss = new Loss();
                loss.setAmount(1000 + random.nextDouble(9000)); // 1000–10000
                loss.setDescription(descriptions[random.nextInt(descriptions.length)]);
                loss.setDeleted(false);

                repository.save(loss);
            }

            System.out.println("✅ 15 Demo Loss Records Inserted");
        };
    }
}