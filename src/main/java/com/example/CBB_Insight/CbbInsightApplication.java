package com.example.CBB_Insight;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CbbInsightApplication {

	public static void main(String[] args) {
		// Load variables from .env
		Dotenv dotenv = Dotenv.load();

		// Set system properties so Spring can use them in application.properties
		System.setProperty("spring.datasource.url", dotenv.get("DB_URL"));
		System.setProperty("spring.datasource.username", dotenv.get("DB_USERNAME"));
		System.setProperty("spring.datasource.password", dotenv.get("DB_PASSWORD"));

		SpringApplication.run(CbbInsightApplication.class, args);
	}
}
