package com.receivly.receivly_backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ReceivlyBackendApplication {

	public static void main(String[] args) {
		// Load .env from current directory into System properties (so application.properties ${VAR} resolve)
		Dotenv.configure()
				.ignoreIfMissing()
				.systemProperties()
				.load();
		SpringApplication.run(ReceivlyBackendApplication.class, args);
	}

}
