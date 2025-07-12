package it.profice.project.event_service.controller;

import it.profice.project.event_service.dto.EventDTO;
import it.profice.project.event_service.service.EventService;
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

    @GetMapping("/{uuid}")
    public EventDTO findByUuid(@PathVariable String uuid) {
        return eventService.findByUuid(uuid);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventDTO save(@RequestBody EventDTO newEvent) {
        return eventService.save(newEvent);
    }

    @PutMapping("/{uuid}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public EventDTO update(@PathVariable String uuid, @RequestBody EventDTO event) {
        return eventService.update(uuid, event);
    }

    @PatchMapping("/{uuid}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public EventDTO partialUpdate(@PathVariable String uuid, @RequestBody EventDTO event) {
        return eventService.partialUpdate(uuid, event);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable String uuid) {
        eventService.delete(uuid);
    }
}
