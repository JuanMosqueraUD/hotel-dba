package com.edu.udistrital.hotel_backend.controller;

import com.edu.udistrital.hotel_backend.model.Area;
import com.edu.udistrital.hotel_backend.model.Empleado;
import com.edu.udistrital.hotel_backend.model.Servicio;
import com.edu.udistrital.hotel_backend.repository.EmpleadoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/empleados")
public class EmpleadoController {
    private final EmpleadoRepository empleadoRepository;

    public EmpleadoController(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @PostMapping
    public ResponseEntity<Empleado> crearEmpleado(@RequestBody Empleado empleado) {
        return ResponseEntity.status(201).body(empleadoRepository.save(empleado));
    }

    @PostMapping("/servicios")
    public ResponseEntity<Servicio> crearServicio(@RequestBody Servicio servicio) {
        Servicio guardado = empleadoRepository.saveServicio(servicio);
    return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
}
    @PostMapping("/areas")
public ResponseEntity<Area> crearArea(@RequestBody Area area) {
    Area guardada = empleadoRepository.saveArea(area);
    return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
}

    
}
