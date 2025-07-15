package it.profice.project.user_service.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientBuilderConfig {

    /**
     * Metodo per la creazione di un webClient.builder. L'utilità di un builder
    * all'interno della nostra app, che andremo a iniettare nell'implementazione del service,
    * sarà quella di poter gestire manualmente la configurazione dell'istanza per ricevere i
    * valori desiderati.
    *
    * @return WebClient.Builder */
    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder(){
        return WebClient.builder();
    }
}

