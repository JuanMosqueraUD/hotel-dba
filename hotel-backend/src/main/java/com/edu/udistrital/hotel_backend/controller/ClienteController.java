package com.edu.udistrital.hotel_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import com.edu.udistrital.hotel_backend.model.Cliente;
import com.edu.udistrital.hotel_backend.model.ClienteReservaServicioView;
import com.edu.udistrital.hotel_backend.model.CorreoCliente;
import com.edu.udistrital.hotel_backend.model.TelefonoCliente;
import com.edu.udistrital.hotel_backend.repository.ClienteRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // Obtener todos los clientes
    @GetMapping
    public List<Cliente> obtenerClientes() {
        return clienteRepository.findAll();
    }

    // Crear un cliente
    @PostMapping
    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente) {
        Cliente nuevoCliente = clienteRepository.save(cliente);
        return ResponseEntity.status(201).body(nuevoCliente);
    }

    // Actualizar cliente (PUT /clientes/{cedula})
    @PutMapping("/{cedula}")
    public ResponseEntity<Cliente> actualizarCliente(@PathVariable("cedula") String cedula, @RequestBody Cliente cliente) {
        Cliente actualizado = clienteRepository.update(cedula, cliente);
        if (actualizado == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar cliente
    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable("cedula") String cedula) {
        boolean eliminado = clienteRepository.deleteByCedula(cedula);
        return eliminado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // --- CORREOS ENDPOINTS ---
    @PostMapping("/correos")
    public ResponseEntity<CorreoCliente> crearCorreo(@RequestBody CorreoCliente correo) {
        CorreoCliente nuevo = clienteRepository.saveCorreo(correo);
        return ResponseEntity.status(201).body(nuevo);
    }

    @GetMapping("/correos")
    public List<CorreoCliente> obtenerTodosLosCorreos() {
        return clienteRepository.findAllCorreos();
    }

    @GetMapping("/{cedula}/correos")
    public List<CorreoCliente> obtenerCorreosPorCedula(@PathVariable("cedula") String cedula) {
        return clienteRepository.findCorreosByCedula(cedula);
    }

    // --- TELEFONOS ENDPOINTS ---
    @PostMapping("/telefonos")
    public ResponseEntity<TelefonoCliente> crearTelefono(@RequestBody TelefonoCliente telefono) {
        TelefonoCliente nuevo = clienteRepository.saveTelefono(telefono);
        return ResponseEntity.status(201).body(nuevo);
    }

    @GetMapping("/telefonos")
    public List<TelefonoCliente> obtenerTodosLosTelefonos() {
        return clienteRepository.findAllTelefonos();
    }

    @GetMapping("/{cedula}/telefonos")
    public List<TelefonoCliente> obtenerTelefonosPorCedula(@PathVariable("cedula") String cedula) {
        return clienteRepository.findTelefonosByCedula(cedula);
    }

    @GetMapping("/reserva-servicios")
    public List<ClienteReservaServicioView> obtenerClientesReservaServicios() {
        return clienteRepository.findAllClienteReservaServicios();
    }
}