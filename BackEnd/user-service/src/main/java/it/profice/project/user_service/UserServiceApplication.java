package it.profice.project.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {

	/**
	 * Annotation EnableDiscoveryClient
	 * Abilita la registrazione automatica di questo micro-servizio presso il service registry
	 * (es. Eureka) per consentire la discovery e la comunicazione tra servizi
	 */

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

}
