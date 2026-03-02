package com.receivly.receivly_backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.nio.file.Paths;

@SpringBootApplication
@EnableScheduling
public class ReceivlyBackendApplication {

	public static void main(String[] args) {
		// Load .env into System properties so application.properties ${VAR} resolve.
		// Look in backend/ when run from project root, or current dir when run from backend.
		String cwd = System.getProperty("user.dir");
		String backendDir = cwd.endsWith("backend") ? cwd : Paths.get(cwd).resolve("backend").toString();
		Dotenv.configure()
				.directory(backendDir)
				.ignoreIfMissing()
				.systemProperties()
				.load();
		SpringApplication.run(ReceivlyBackendApplication.class, args);
	}

}
