package com.receivly.receivly_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ReceivlyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReceivlyBackendApplication.class, args);
	}

}
