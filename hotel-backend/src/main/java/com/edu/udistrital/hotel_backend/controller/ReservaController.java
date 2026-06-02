package com.edu.udistrital.hotel_backend.controller;

import com.edu.udistrital.hotel_backend.model.Reservar;
import com.edu.udistrital.hotel_backend.model.Solicitar;
import com.edu.udistrital.hotel_backend.repository.ReservarRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {
	private final ReservarRepository reservarRepository;

	public ReservaController(ReservarRepository reservarRepository) {
		this.reservarRepository = reservarRepository;
	}

	@PostMapping
	public ResponseEntity<Reservar> crearReserva(@RequestBody Reservar reserva) {
		return ResponseEntity.status(201).body(reservarRepository.save(reserva));
	}

	@GetMapping
	public List<Reservar> obtenerReservas() {
		return reservarRepository.findAll();
	}

	// PUT /api/reservas/5
	@PutMapping("/{id}")
	public ResponseEntity<Reservar> update(@PathVariable Long id,
	                                       @RequestBody Reservar reserva) {
	    return reservarRepository.update(id, reserva)
	               .map(ResponseEntity::ok)
	               .orElse(ResponseEntity.notFound().build());
	}

	// POST /api/reservas/solicitar
	@PostMapping("/solicitar")
public ResponseEntity<Solicitar> crearSolicitar(@RequestBody Solicitar solicitar) {
    Solicitar guardado = reservarRepository.saveSolicitar(solicitar);
    return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
	}

	// DELETE /api/reservas/5
	@org.springframework.web.bind.annotation.DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		boolean deleted = reservarRepository.deleteById(id);
		if (deleted) return ResponseEntity.noContent().build();
		return ResponseEntity.notFound().build();
	}
	
}
