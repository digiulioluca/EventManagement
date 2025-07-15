import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { RootComponent } from './app/root-component/root-component';
import { provideHttpClient } from '@angular/common/http';
import { BookingService } from './app/service/booking.service';

// Avvia l'app Angular specificando il componente principale (RootComponent)
// e i provider globali necessari: HTTP client, router e BookingService
bootstrapApplication(RootComponent, {
  providers: [
    provideHttpClient(),     // Abilita il modulo HTTP client per fare richieste REST
    provideRouter(routes),   // Configura le rotte dell'app
    BookingService           // Rende disponibile il servizio BookingService in tutta l'app
  ]
});
