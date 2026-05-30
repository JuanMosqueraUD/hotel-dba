package com.edu.udistrital.hotel_backend.controller;

import com.edu.udistrital.hotel_backend.model.Area;
import com.edu.udistrital.hotel_backend.model.Empleado;
import com.edu.udistrital.hotel_backend.model.Servicio;
import com.edu.udistrital.hotel_backend.model.TelefonoEmpleado;
import com.edu.udistrital.hotel_backend.repository.EmpleadoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

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

    // --- TELEFONOS EMPLEADO ENDPOINTS ---
    @PostMapping("/telefonos")
    public ResponseEntity<TelefonoEmpleado> crearTelefono(@RequestBody TelefonoEmpleado telefono) {
        TelefonoEmpleado guardado = empleadoRepository.saveTelefono(telefono);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @GetMapping("/telefonos")
    public List<TelefonoEmpleado> obtenerTodosLosTelefonos() {
        return empleadoRepository.findAllTelefonos();
    }

    @GetMapping("/{cedula}/telefonos")
    public List<TelefonoEmpleado> obtenerTelefonosPorCedula(@PathVariable("cedula") String cedula) {
        return empleadoRepository.findTelefonosByCedula(cedula);
    }

    
}
