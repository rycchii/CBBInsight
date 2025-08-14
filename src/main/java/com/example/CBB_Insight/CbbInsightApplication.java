package com.example.CBB_Insight;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CbbInsightApplication {

	public static void main(String[] args) {
		// Load .env file only if it exists (for local development)
		try {
			Dotenv dotenv = Dotenv.configure()
					.ignoreIfMissing() // This is the key fix!
					.load();

			// Set environment variables from .env file
			dotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
			});
		} catch (Exception e) {
			// Ignore if .env file doesn't exist (production environment)
			System.out.println("No .env file found, using system environment variables");
		}

		SpringApplication.run(CbbInsightApplication.class, args);
	}
}