package it.profice.project.event_service.service;

import it.profice.project.event_service.dto.EventDTO;

import java.util.List;

public interface EventService {
    List<EventDTO> findAll();
    EventDTO findByUuid(String uuid);
    EventDTO save (EventDTO newEvent);
    EventDTO update(String uuid, EventDTO event);
    EventDTO partialUpdate(String uuid, EventDTO event);
    void delete (String uuid);
    List<EventDTO> searchEvents(EventDTO event);
}
