package com.edu.udistrital.hotel_backend.controller;

import com.edu.udistrital.hotel_backend.model.Habitacion;
import com.edu.udistrital.hotel_backend.repository.HabitacionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/habitaciones")
public class HabitacionController {
    private final HabitacionRepository habitacionRepository;

    public HabitacionController(HabitacionRepository habitacionRepository) {
        this.habitacionRepository = habitacionRepository;
    }

    @PostMapping
    public ResponseEntity<Habitacion> crearHabitacion(@RequestBody Habitacion habitacion) {
        return ResponseEntity.status(201).body(habitacionRepository.save(habitacion));
    }

    @GetMapping
    public ResponseEntity<List<Habitacion>> obtenerTodasHabitaciones() {
        return ResponseEntity.ok(habitacionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Habitacion> obtenerHabitacionPorId(@PathVariable("id") Long id) {
        Habitacion habitacion = habitacionRepository.findById(id);
        if (habitacion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(habitacion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habitacion> actualizarHabitacion(@PathVariable("id") Long id,
                                                           @RequestBody Habitacion habitacion) {
        Habitacion updated = habitacionRepository.update(id, habitacion);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
