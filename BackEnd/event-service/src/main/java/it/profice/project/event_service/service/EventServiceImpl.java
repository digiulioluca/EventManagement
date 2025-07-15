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

    private final EventRepository eventRepository;

    @Override
    public List<EventDTO> findAll() {
        return eventRepository.findAll()
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    @Override
    public List<EventDTO> findByUserUuid(String userUuid) {
        return eventRepository.findByUserUuid(userUuid)
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    @Override
    public EventDTO findByUuid(String uuid) {
        return modelToDto(eventRepository.findByUuid(uuid).orElseThrow(EventNotFoundException::new));
    }

    @Override
    public EventDTO save(EventDTO newEvent) {
        newEvent.setUuid(UUID.randomUUID().toString());
        return modelToDto(eventRepository.save(dtoToModel(newEvent)));
    }

    @Override
    public EventDTO update(String uuid, EventDTO event) {
        Event eventToUpdate = eventRepository.findByUuid(uuid).orElseThrow(EventNotFoundException::new);

        eventToUpdate.setEventCategory(event.getEventCategory());
        eventToUpdate.setDate(event.getDate());
        eventToUpdate.setAvailableSeats(event.getAvailableSeats());
        eventToUpdate.setTotalSeats(event.getTotalSeats());
        eventToUpdate.setTitle(event.getTitle());
        eventToUpdate.setState(event.isState());
        eventToUpdate.setDescription(event.getDescription());


        return modelToDto(eventRepository.save(eventToUpdate));
    }

    @Override
    public EventDTO partialUpdate(String uuid, EventDTO event) {
        Event eventToUpdate = eventRepository.findByUuid(uuid).orElseThrow(EventNotFoundException::new);

        if(event.getEventCategory() != null) eventToUpdate.setEventCategory(event.getEventCategory());
        if(event.getDate() != null) eventToUpdate.setDate(event.getDate());
        if(event.getAvailableSeats() != null) eventToUpdate.setAvailableSeats(event.getAvailableSeats());
        if(event.getTotalSeats() != null) eventToUpdate.setTotalSeats(event.getTotalSeats());
        if(event.getTitle() != null) eventToUpdate.setTitle(event.getTitle());
        if(event.getDescription() != null) eventToUpdate.setDescription(event.getDescription());


        return modelToDto(eventRepository.save(eventToUpdate));
    }

    @Override
    public void delete(String uuid) {
        eventRepository.delete(eventRepository.findByUuid(uuid).orElseThrow(EventNotFoundException::new));
    }

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

    @Override
    public List<EventDTO> weeklyEvents() {
        return eventRepository.findEventsNext7Days()
                .stream()
                .map(this::modelToDto)
                .toList();
    }

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
