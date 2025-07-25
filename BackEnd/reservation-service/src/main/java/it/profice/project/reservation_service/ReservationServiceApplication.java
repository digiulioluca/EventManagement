package it.profice.project.reservation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ReservationServiceApplication{

	public static void main(String[] args) {
		SpringApplication.run(ReservationServiceApplication.class, args);
	}

}