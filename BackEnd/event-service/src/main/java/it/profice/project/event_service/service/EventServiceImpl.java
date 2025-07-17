package it.profice.project.event_service.service;

import it.profice.project.event_service.dto.EventDTO;
import it.profice.project.event_service.dto.EventRequestDTO;
import it.profice.project.event_service.exception.EventNotFoundException;
import it.profice.project.event_service.model.Event;
import it.profice.project.event_service.repository.EventRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

    /**
     * Injection di EventRepository per gestire l'accesso al databse
     */
    private final EventRepository eventRepository;

    /**
     * Questo metodo restituisce la lista di tutti gli eventi presenti sul database
     *
     * @return lista di EventDTO
     */
    @Override
    public List<EventDTO> findAll() {
        return eventRepository.findAll()
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    /**
     * Questo metodo restituisce la lista degli eventi in base al uuid dell'user
     * che li ha creati
     *
     * @param userUuid uuid dell'user
     * @return lista di EventDTO
     */
    @Override
    public List<EventDTO> findByUserUuid(String userUuid) {
        return eventRepository.findByUserUuid(userUuid)
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    /**
     * Questo metodo restituisce un evento tramite il suo uuid
     *
     * @param uuid uuid dell'evento
     * @return EventDTO
     * @throws EventNotFoundException quando l'evento non viene trovato
     */
    @Override
    public EventDTO findByUuid(String uuid) {
        return modelToDto(eventRepository.findByUuid(uuid).orElseThrow(EventNotFoundException::new));
    }

    /**
     * Questo metodo prima di salvare un nuovo evento nel database genera un uuid casuale
     * @param newEvent DTO nuovo evento
     * @return EventDTO
     */
    @Override
    public EventDTO save(EventDTO newEvent) {
        newEvent.setUuid(UUID.randomUUID().toString());
        return modelToDto(eventRepository.save(dtoToModel(newEvent)));
    }

    /**
     * Questo metodo esegue una modifica totale di un evento esistente
     * @param uuid uuid dell'evento
     * @param event DTO con i nuovi dati
     * @return EventDTO
     * @throws EventNotFoundException quando l'evento non viene trovato
     */
    @Override
    public EventDTO update(String uuid, EventDTO event) {
        Event eventToUpdate = eventRepository.findByUuid(uuid).orElseThrow(EventNotFoundException::new);

        eventToUpdate.setEventCategory(event.getEventCategory());
        eventToUpdate.setDate(event.getDate());
        eventToUpdate.setLocation(event.getLocation());
        eventToUpdate.setAvailableSeats(event.getAvailableSeats());
        eventToUpdate.setTotalSeats(event.getTotalSeats());
        eventToUpdate.setTitle(event.getTitle());
        eventToUpdate.setState(event.isState());
        eventToUpdate.setDescription(event.getDescription());


        return modelToDto(eventRepository.save(eventToUpdate));
    }

    /**
     * Questo metodo esegue una modifica parziale di un evento già esistente.
     * I campi nulli non verranno aggiornati
     * @param uuid  uuid dell'evento
     * @param event DTO con i dati da aggiornare
     * @return EventDTO
     * @throws EventNotFoundException quando l'evento non viene trovato
     */
    @Override
    public EventDTO partialUpdate(String uuid, EventDTO event) {
        Event eventToUpdate = eventRepository.findByUuid(uuid).orElseThrow(EventNotFoundException::new);

        if(event.getEventCategory() != null) eventToUpdate.setEventCategory(event.getEventCategory());
        if(event.getDate() != null) eventToUpdate.setDate(event.getDate());
        if(event.getLocation() != null) eventToUpdate.setLocation(event.getLocation());
        if(event.getAvailableSeats() != null) eventToUpdate.setAvailableSeats(event.getAvailableSeats());
        if(event.getTotalSeats() != null) eventToUpdate.setTotalSeats(event.getTotalSeats());
        if(event.getTitle() != null) eventToUpdate.setTitle(event.getTitle());
        if(event.getDescription() != null) eventToUpdate.setDescription(event.getDescription());


        return modelToDto(eventRepository.save(eventToUpdate));
    }

    /**
     * Questo metodo elimina un evento dal database
     * @param uuid uuid dell'evento
     * @throws EventNotFoundException quando l'evento non viene trovato
     */
    @Override
    public void delete(String uuid) {
        eventRepository.delete(eventRepository.findByUuid(uuid).orElseThrow(EventNotFoundException::new));
    }

    /**
     * Questo metodo esegue una ricerca personalizzata
     * @param request DTO con i filtri di ricerca
     * @return lista di EventDTO
     */
    @Override
    public List<EventDTO> searchEvents(EventRequestDTO request) {
        return eventRepository.searchEvents(
                request.getTitle(),
                request.getDateFrom(),
                request.getDateTo(),
                request.getLocation(),
                request.getCategory()
        ).stream().map(this::modelToDto).toList();
    }

    /**
     * Questo metodo restituisce una lista di massimo cinque eventi dei prossimi sette giorni
     * @return lista di EventDTO
     */
    @Override
    public List<EventDTO> weeklyEvents() {
        return eventRepository.findEventsNext7Days()
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    /**
     * Conversione da Envent in EventDTO
     * @param event entity
     * @return EventDTO
     */
    private EventDTO modelToDto(Event event) {
        return EventDTO.builder()
                .uuid(event.getUuid())
                .title(event.getTitle())
                .description(event.getDescription())
                .date(event.getDate())
                .location(event.getLocation())
                .totalSeats(event.getTotalSeats())
                .availableSeats(event.getAvailableSeats())
                .state(event.isState())
                .eventCategory(event.getEventCategory())
                .userUuid(event.getUserUuid())
                .build();
    }

    /**
     * Conversione da EventDTO in Event
     * @param event DTO
     * @return Event
     */
    private Event dtoToModel(EventDTO event) {
        return Event.builder()
                .uuid(event.getUuid())
                .title(event.getTitle())
                .description(event.getDescription())
                .date(event.getDate())
                .location(event.getLocation())
                .totalSeats(event.getTotalSeats())
                .availableSeats(event.getAvailableSeats())
                .state(event.isState())
                .eventCategory(event.getEventCategory())
                .userUuid(event.getUserUuid())
                .build();
    }
}
