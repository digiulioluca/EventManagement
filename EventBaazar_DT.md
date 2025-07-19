# EventBaazar

Progetto EY - Gestionale eventi

Realizzato da:

Luca Di Giulio, Marco Falconetti e Martina La Serra

Ruoli:

- Luca: Backend (Event Service); Frontend: Event, Event-details e Home Component
- Marco: Backend (User Service, API Gateway e Discovery Server); Frontend: formattazione e definizione stile dei singoli componenti, Booking, Footer, Login, Navbar e Register Component
- Martina: Backend (Reservation Service); Frontend: Admin e User component

# Indice

1. Introduzione
2. Tecnologie utilizzate
3. Architettura del sistema
4. Casi d’uso

# 1. Introduzione

## 1.1 Scopo del documento

Il seguente documento nasce con lo scopo di spiegare il funzionamento di EventBaazar, un gestionale per eventi di qualsiasi tipo, dallo sport ai concerti. Attraverso quattro punti chiave, accompagneremo il potenziale utente/admin a una completa comprensione dell’architettura dietro il software e all’utilizzo di quest’ultimo, esplorando ogni singolo caso d’uso di rilievo per il suo ruolo.

## 1.2 Scopo del software

Il software si propone di fornire agli organizzatori un'unica piattaforma integrata che copra l'intero ciclo di vita di un evento, dalla fase di creazione e configurazione fino alla gestione delle prenotazioni e al monitoraggio post-evento.
L'applicazione nasce per rispondere alle esigenze di due tipologie principali di utenti: gli amministratori, che necessitano di strumenti avanzati per la creazione, modifica e pubblicazione degli eventi, e gli utenti finali, che cercano un'interfaccia intuitiva per visualizzare e prenotare i posti disponibili. Attraverso un'architettura web moderna basata su Java Spring Boot per il backend e Angular per il frontend, EventBaazar garantisce un'esperienza utente fluida e reattiva.

## 1.3 Audience

EventBaazar è stato progettato per rispondere alle esigenze di un pubblico eterogeneo e diversificato, accomunato dalla necessità di gestire eventi in modo professionale ed efficiente. Il sistema si rivolge principalmente a organizzatori di eventi di ogni tipologia e dimensione, dalle piccole manifestazioni locali ai grandi concerti e competizioni sportive internazionali.

# 2. Tecnologie utilizzate

## 2.1 Backend

Tecnologie: Java 21+, Spring Boot, Spring Security, Spring Cloud (Eureka, Gateway)

Il Backend di EventBaazar è stato sviluppato con Spring Boot, seguendo il pattern dell’architettura a micro-servizi per soddisfare i principi di scalabilità e performabilità. All’interno di questi ultimi sono state importate varie dipendenze, ad esempio:

- Lombok, che permette di utilizzare delle annotation per evitare il boilerplate code
- Validation, per gestire la validazione dei singoli campi di ogni servizio
- JPA, per gestire la persistenza dei dati e la scrittura di query personalizzate per i micro-servizi
- MySQL, per gestire il collegamento con il DBMS. Ogni micro servizio dispone di un database autonomo.

Il sistema viene completato da due componenti: Discovery Server, implementato attraverso le dipendenze Eureka (Server e Client), per il registro e la localizzazione dei microservizi; API Gateway, il punto d’ingresso unificato per tutte le richieste, “orchestratore” del traffico verso i servizi appropriati tramite interfaccia API REST per garantire una comunicazione standardizzata.

## 2.2 Frontend

Tecnologia:  Angular 17+ (standalone components, provideRouter), Bootstrap 5.3

L'interfaccia utente di EventBaazar è stata realizzata con Angular, framework che garantisce un'esperienza utente fluida e reattiva, e Bootstrap 5.3. L'applicazione frontend adotta l'approccio degli standalone components. La navigazione all'interno dell'applicazione, invece, è gestita attraverso provideRouter, permettendo una gestione ottimale delle rotte e una migliore organizzazione del codice. 

# 3. Architettura del sistema

## 3.1 Diagramma UML

Di seguito possiamo osservare il diagramma UML con i tre micro-servizi e i collegamenti tra di essi

![UML_Events_Diagram(2).png](UML_Events_Diagram(2).png)

## 3.2 Dettaglio microservizi

### 3.2.1 User

Gestisce l'intero ciclo di vita degli utenti e delle loro credenziali di accesso.

**Endpoints Login Controller** (`api/v1/auth`):

- `/login` : accesso alla piattaforma (POST)
    
    Parametri: `@RequestBody` RequestDTO (email e password dell’utente)
    
    Valore restituito: ResponseDTO (uuid e messaggio di conferma dell’avvenuto login)
    
- `/register`: registrazione.
    
    Parametri: `@RequestBody`  UserDTO (email, nome e password del nuovo utente)
    
    Valore restituito: UserDTO appena generato (oltre ai campi sopra indicati, viene aggiunto il ruolo e l’identificativo che andremo a esporre - uuid -, la password viene nascosta e criptata attraverso l’oggetto `BCryptPasswordEncoder`)
    
    Codice di ritorno personalizzato (in caso di successo): CREATED 201
    

**Endpoints User Controller** (`api/v1/users`):

- `/{uuid}`: recupero dati di un singolo utente (GET)
    
    Parametri: `@PathVariable` uuid (identificativo dell’utente)
    
    Valore restituito: UserDTO con le specifiche dell’utente loggato
    
- `/{uuid}`: modifica completa dell’utente (PUT)
    
    Parametri: `@RequestBody` UserDTO con tutti i campi compilati
    
    Valore restituito: UserDTO aggiornato
    
    Codice di ritorno personalizzato: ACCEPTED 202
    
- `/{uuid}`: modifica parziale dell’utente (PATCH)
    
    Parametri: `@RequestBody` UserDTO con i soli campi che l’utente vuole aggiornare
    
    Valore restituito: UserDTO aggiornato
    
    Codice di ritorno personalizzato: ACCEPTED 202
    
- `/{uuid}`: cancellazione del profilo (DELETE)
    
    Parametri: `@PathVariable` uuid dell’utente
    
    Codice di ritorno personalizzato: NO CONTENT 204
    

**Errori Gestiti**

Attraverso la classe UserGlobalException (package handler), vengono gestiti 3 errori specifici: 

- `MethodArgumentNotValidException` codice 400, per gestire richieste mandate con metodo POST in maniera errata
- `LoginUnauthorizedException` codice 401, email o password errati
- `UserNotFoundException` codice 404, User non trovato sulla base dati

### 3.2.2 Event

Si occupa della creazione, modifica e cancellazione degli eventi.

**Endpoints Event Controller** (`api/v1/events`):

- lista completa degli eventi (GET)
    
    Valore restituito: List di EventDTO
    
- aggiunta di un nuovo evento (POST)
    
    Parametri: `@RequestBody` EventDTO
    
    Valore restituito: EventDTO di riepilogo sull’evento appena aggiunto
    
    Codice di ritorno personalizzato: CREATED 201
    
- `/weekly`: lista degli eventi della settimana (GET)
    
    Valore restituito: List di EventDTO con range di 7 giorni a partire dalla data attuale
    
- `/{uuid}`: recupero dati di un singolo evento (GET)
    
    Parametri: `@PathVariable` uuid (identificativo dell’evento)
    
    Valore restituito: EventDTO con le specifiche dell’evento ricercato o selezionato
    
- `/{search}`: ricerca eventi (POST)
    
    Parametri: `@RequestBody` EventRequestDTO con i filtri da applicare alla ricerca
    
    Valore restituito: List di EventDTO
    
- `/{uuid}/event`: lista degli eventi pubblicati da uno specifico admin (GET)
    
    Parametri: `@PathVariable` uuid dell’admin loggato
    
    Valore restituito: List di EventDTO aggiunti dall’admin
    
- `/{uuid}`: modifica totale evento (PUT)
    
    Parametri: `@RequestBody` EventDTO con tutti i campi compilati
    
    Valore restituito: EventDTO aggiornato
    
    Codice di ritorno personalizzato: ACCEPTED 202
    
- `/{uuid}`: modifica parziale dell’evento (PATCH)
    
    Parametri: `@RequestBody` EventDTO con i soli campi che l’admin vuole aggiornare
    
    Valore restituito: EventDTO aggiornato
    
    Codice di ritorno personalizzato: ACCEPTED 202
    
- `/{uuid}`: cancellazione dell’evento (DELETE)
    
    Parametri: `@PathVariable` uuid dell’evento
    
    Codice di ritorno personalizzato: NO CONTENT 204
    

**Errori Gestiti**

Attraverso la classe EventGlobalException (package handler), vengono gestiti 3 errori specifici: 

- `MethodArgumentNotValidException` codice 400, per gestire richieste mandate con metodo POST in maniera errata
- `EventNotFoundException` codice 404, Event non trovato sulla base dati

### 3.2.3 Reservation

Amministra tutte le operazioni relative alle prenotazioni.

**Endpoints Reservation Controller** (`api/v1/reservations`):

- aggiunta di un nuovo evento (POST)
    
    Parametri: `@RequestBody` ReservationDTO
    
    Valore restituito: ReservationDTO con i dati sull’evento prenotato (titolo, data e location)
    
    Codice di ritorno personalizzato: CREATED 201
    
- `/{uuid}/user`: lista delle prenotazioni effettuate da un singolo utente (GET)
    
    Parametri: `@PathVariable` uuid dello user loggato
    
    Valore restituito: List di ReservationDTO
    
- `/{uuid}/user`: lista delle prenotazioni effettuate per un singolo (GET)
    
    Parametri: `@PathVariable` uuid dell’evento
    
    Valore restituito: List di ReservationDTO
    
- `/{uuid}`: cancellazione della prenotazione (DELETE)
    
    Parametri: `@PathVariable` uuid della prenotazion
    
    Codice di ritorno personalizzato: NO CONTENT 204
    

**Errori Gestiti**

Attraverso la classe ReservationGlobalException (package handler), vengono gestiti 3 errori specifici:

- `MethodArgumentNotValidException` codice 400, per gestire richieste mandate con metodo POST in maniera errata
- `ReservationNotFoundException` codice 404, Reservation non trovato sulla base dati

## 3.3 Angular

Lo sviluppo di Angular parte dall’utilizzo, nel file di configurazione (app.config.ts), del provider `provideHttpClient()` , utile per la registrazione del servizio `HttpClient`, iniettabile nei singoli service. I singoli service contengono una proprietà con l’indirizzo verso il service rappresentato. Questo url viene poi manipolato in base all’endpoint da richiamare. La gestione delle risposte è stata affidata all’utilizzo di alcuni della libreria RxJS (Observable, subscribe, …).

ESEMPIO user-service.ts

```tsx
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users'; 

  constructor(private http: HttpClient) {}

  getUserByUuid(uuid: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${uuid}`);
  }

  updateUser(uuid: string, data: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.baseUrl}/${uuid}`, data);
  }

  partialUpdateUser(uuid: string, data: Partial<UserDTO>): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.baseUrl}/${uuid}`, data);
  }

  deleteUser(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
```

I singoli DTO sono stati dichiarati come interfacce nel percorso `/model`

```tsx
export interface UserDTO {
  uuid: string;
  name: string;
  password?: string | null;
  email: string;
  role: string;
  reservations?: any[] | null;
  events?: any[] | null;
}
```

Per collegare le pagine dell’applicazione, invece, sono state configurate tutte le rotte all’interno del file preposto per questa operazione, app.routes.ts

```tsx
import { Routes } from '@angular/router';
import { RegisterComponent } from './register-component/register-component';
import { LoginComponent } from './login-component/login-component';
import { BookingComponent } from './booking-component/booking-component';
import { EventComponent } from './event-component/event-component';
import { AdminComponent } from './admin-component/admin-component';
import { HomeComponent } from './home-component/home-component';
import { UserComponent } from './user-component/user-component';
import { EventDetailsComponent } from './event-details-component/event-details-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservations', component: BookingComponent },
  { path: 'events', component: EventComponent},
  { path: 'events/:uuid', component: EventDetailsComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'user', component: UserComponent },
];
```

Infine, all’interno dei singoli componenti, i metodi del service sono stati richiamati attraverso l’iniezione di quest’ultimo e l’utilizzo di `subscribe()` per gestire i risultati della richiesta (`next()` in caso di risposta positiva; `error()` in caso di risposta negativa)

Esempio del getUserByUuid in user-component.ts

```tsx
this.userService.getUserByUuid(uuid).subscribe({
      next: (res) => {
        this.user = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore utente', err);
        this.user = null;
        this.isLoading = false;
      }
    });
```

## 3.4 Database e persistenza

Come anticipato nel punto [2.1](https://www.notion.so/EventBaazar-2329567aabac8046b9d0fb30126232e8?pvs=21), la persistenza di EventBaazar viene gestita attraverso il DBMS MySQL. All’interno di Spring Boot, MySQL viene integrato attraverso la dipendenza MySQL JDBC Driver, che utilizza l’interfaccia JDBC API per far interagire Java con i database.

Tabella `user`

```sql
create table user (
id bigint not null auto_increment, 
email varchar(255), 
name varchar(255), 
password varchar(255), 
role tinyint, 
uuid varchar(255), 
primary key (id)
)
```

Tabella `event`

```sql
create table event (
id bigint not null auto_increment, 
available_seats integer, date datetime(6), 
description varchar(255), 
event_category tinyint, location varchar(255), 
state bit not null, 
title varchar(255), 
total_seats integer, 
user_uuid varchar(255), 
uuid varchar(255), 
primary key (id)
)
```

Tabella `reservation`

```sql
create table reservation (
id bigint not null auto_increment, 
date date, event_uuid varchar(255), 
user_uuid varchar(255), 
uuid varchar(255), 
primary key (id)
)
```

Relazioni:

- User → Event: un admin può creare eventi e, da questo servizio, possiamo consultare la lista degli eventi creati da quest’ultimo (caso d’uso [4.11](https://www.notion.so/EventBaazar-2329567aabac8046b9d0fb30126232e8?pvs=21))
- Event → Reservation: un evento può avere più prenotazioni
- User → Reservation: uno user può prenotare o uno più eventi

Per eseguire query personalizzate, come la ricerca per restituire gli eventi della settimana (contenuta in EventRepository), è stata utilizzata la sintassi JPQL con l’ausilio delle etichette (`@Param`).

```java
@Query(value = """
SELECT * FROM Event
WHERE date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)
LIMIT 5
""", nativeQuery = true)
List<Event> findEventsNext7Days();
```

## 3.5 Sicurezza e autenticazione

 

### 3.5.1 Data Transfer Object (DTO)

Per trasferire i dati in maniera sicura e proteggere i dati sensibili delle entità è stato utilizzato il pattern DTO (Data Transfer Object). Nei tre micro-servizi è stata aggiunta una proprietà  - uuid - che assume il comportamento di identificativo fittizio (generato randomicamente attraverso il metodo `randomUUID()`)

### 3.5.2 BPasswordEncoder

Per codificare le password sulla base dati (User Service). Una volta richiamato con il metodo `encode()` (endpoint `api/v1/auth/register`), la password criptata  verrà registrata sul DB. 
Durante il login (endpoint `api/v1/auth/login`), la password fornita viene verificata attraverso il metodo `matches()` che confronta la password in chiaro con quella hashata.

```java
@Override
public UserDTO register(UserDTO newUser) {
    String encodedPassword = passwordEncoder.encode(newUser.getPassword());
    newUser.setPassword(encodedPassword);
    return modelToUserDTO(userRepository.save(userDtoToModel(newUser)));
}

@Override
public ResponseDTO login(RequestDTO requestDTO) {
    User userToFind = userRepository.findByEmail(requestDTO.getEmail())
            .orElseThrow(UserNotFoundException::new);

    if(passwordEncoder.matches(requestDTO.getPassword(), userToFind.getPassword()))
        return modelToResponseDto(userToFind);

    throw new LoginUnauthorizedException();
}
```

### 3.5.3 Gestione CORS

La gestione del Cross-Origin Resource Sharing (CORS) è stata implementata centralmente nell'API Gateway per consentire al frontend Angular di comunicare con i microservizi backend.

```java
public CorsWebFilter corsWebFilter() {
    CorsConfiguration corsConfig = new CorsConfiguration();
    corsConfig.setAllowedOriginPatterns(List.of("http://localhost:4200"));
    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    corsConfig.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
    corsConfig.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfig);

    return new CorsWebFilter(source);
}
```

### 3.5.4 Validazione input

La validazione degli input è implementata a più livelli utilizzando le annotation di Spring Boot Validation.

```java
public class UserDTO {

    private String uuid;
    @NotBlank
    private String name;
    @NotBlank
    @Size(min = 6)
    private String password;
    @Email
    @NotEmpty
    private String email;
    private Role role;
}
```

# 4. Casi d’uso

## 4.1 Creazione nuovo utente

- Attore: visitatore
- Precondizioni: l’utente non è ancora registrato.
- Descrizione: il visitatore, attraverso la pagina “Registrati”, si registra su EventBaazar fornendo email, nome e password.
- Postcondizioni: l’utente è registrato e può autenticarsi. Reindirizzamento verso la pagina home

## 4.2 Modifica profilo

- Attore: utente
- Precondizioni: utente o admin già autenticato.
- Descrizione: un utente, recatosi sulla propria pagina profilo, accede attraverso l’apposito tasto “Modifica profilo” al form di modifica. Quest’ultima può essere parziale o completa.
- Postcondizioni: la pagina viene ricaricata e l’utente può visualizzare le modifiche effettuate.

## 4.3 Cancellazione profilo

- Attore: utente
- Precondizioni: utente già autenticato.
- Descrizione: attraverso l’apposito tasto, presente sulla pagina “Profilo utente”, l’utente cancella il proprio profilo dalla pagina personale.
- Postcondizioni: il visitatore, non più utente autenticato, viene reindirizzato alla pagina di login.

## 4.4 Aggiunta evento

- Attore: Utente
- Precondizioni: autenticazione con profilo admin.
- Descrizione: L’admin, attraverso la pagina “Portale Admin”, registra il nuovo evento soddisfando tutte le richieste del form (dalla data alla definizione della location e del numero di posti disponibili).
- Postcondizioni: La pagina “Portale Admin” viene ricaricata con la lista degli eventi aggiunti dall’admin aggiornata.

## 4.5 Modifica dettagli evento

- Attore: utente
- Precondizioni: autenticazione con profilo admin, evento non terminato.
- Descrizione: l’admin, attraverso la pagina “Portale Admin”, seleziona un evento e modifica attraverso il form i dettagli dell’evento.
- Postcondizioni: la pagina viene ricaricata e sia l’admin che gli utenti possono consultare le nuove informazioni sull’evento.

## 4.6 Rimozione evento

- Attore: utente
- Precondizioni: autenticazione con profilo admin.
- Descrizione: L’admin, dalla pagina “Portale Admin”, seleziona e cancella l’evento attraverso l’apposito tasto.
- Postcondizioni: La pagina viene ricaricata con la lista aggiornata.

## 4.7 Ricerca evento

- Attore: utente/visitatore
- Precondizioni: nessuna
- Descrizione: l’utente/visitatore, attraverso la pagina “Cerca eventi”, utilizza i filtri forniti dal form di ricerca per visualizzare uno o più eventi (o tutta la lista, lasciando il form vuoto).
- Postcondizioni: in caso di successo, al di sotto del form verranno mostrati tutti gli eventi presenti nella banca dati del sito che soddisfano i criteri inseriti dall’utente.

## 4.8 Prenotazione evento

- Attore: utente
- Precondizioni: autenticazione utente, posti ancora disponibili per l’evento selezionato.
- Descrizione: l’utente, scelto l’evento dalla pagina home o dalla sezione ricerca, effettua una prenotazione con l’apposito tasto.
- Postcondizioni: in caso di successo, l’utente viene reindirizzato sulla pagina “Prenotazioni”, dove può consultare tutte le prenotazioni effettuate (passate e future, caso [4.10](https://www.notion.so/EventBaazar-2329567aabac8046b9d0fb30126232e8?pvs=21))

## 4.9 Rimozione prenotazione

- Attore: utente
- Precondizioni: autenticazione utente, evento non terminato.
- Descrizione: l’utente, dopo aver raggiunto la  pagina “Prenotazioni”, rimuove, tramite l’apposito tasto, la prenotazione da un evento.
- Postcondizioni: aggiornamento pagina.

## 4.10 Consultazione storico prenotazioni

- Attore: utente
- Precondizioni: autenticazione utente, almeno una prenotazione effettuata.
- Descrizione: tramite la pagina “Prenotazioni”, l’utente può consultare lo storico delle prenotazioni effettuate. Informazioni visibili: nome, data e location dell’evento (passate e future) e tasto per rimuovere (evento [4.9](https://www.notion.so/EventBaazar-2329567aabac8046b9d0fb30126232e8?pvs=21)) prenotazioni per eventi ancora da svolgersi
- Postcondizioni: Aggiornamento pagina personale.

## 4.11 Consultazione storico eventi inseriti dall’admin

- Attore: utente
- Precondizioni: autenticazione profilo utente admin.
- Descrizione: tramite la pagina “Portale Admin”, l’admin consultare lo storico degli eventi che ha inserito. Informazioni visibili: nome, location e data dell’evento (passate e future). Cliccando su una delle card, l’admin può accedere ai dettagli dell’evento per modificarlo (caso [4.5](https://www.notion.so/EventBaazar-2329567aabac8046b9d0fb30126232e8?pvs=21)) o eliminarlo (caso [4.6](https://www.notion.so/EventBaazar-2329567aabac8046b9d0fb30126232e8?pvs=21)).
- Postcondizioni: Aggiornamento pagina personale.