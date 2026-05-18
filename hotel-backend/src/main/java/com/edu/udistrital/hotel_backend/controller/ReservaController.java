package com.edu.udistrital.hotel_backend.controller;

import com.edu.udistrital.hotel_backend.model.Reservar;
import com.edu.udistrital.hotel_backend.repository.ReservarRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
