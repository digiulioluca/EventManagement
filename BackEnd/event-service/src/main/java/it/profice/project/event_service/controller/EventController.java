package it.profice.project.event_service.controller;

import it.profice.project.event_service.dto.EventDTO;
import it.profice.project.event_service.dto.EventRequestDTO;
import it.profice.project.event_service.service.EventService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/events")
public class EventController {
    private final EventService eventService;

    @GetMapping
    public List<EventDTO> findAll() {
        return eventService.findAll();
    }

    @PostMapping("/search")
    public List<EventDTO> searchEvents(@RequestBody EventRequestDTO request) {
        return eventService.searchEvents(request);
    }

    @GetMapping("/{uuid}")
    public EventDTO findByUuid(@PathVariable String uuid) {
        return eventService.findByUuid(uuid);
    }

    @GetMapping("/{userUuid}/events")
    public List<EventDTO> findByUserUuid(@PathVariable String userUuid) {
        return eventService.findByUserUuid(userUuid);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventDTO save(@Valid @RequestBody EventDTO newEvent) {
        return eventService.save(newEvent);
    }

    @PutMapping("/{uuid}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public EventDTO update(@Valid @PathVariable String uuid, @RequestBody EventDTO event) {
        return eventService.update(uuid, event);
    }

    @PatchMapping("/{uuid}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public EventDTO partialUpdate(@Valid @PathVariable String uuid, @RequestBody EventDTO event) {
        return eventService.partialUpdate(uuid, event);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable String uuid) {
        eventService.delete(uuid);
    }
}
