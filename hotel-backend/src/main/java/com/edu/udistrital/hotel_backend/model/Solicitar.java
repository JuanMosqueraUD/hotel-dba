package com.edu.udistrital.hotel_backend.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Solicitar {
    private SolicitarId id;
    private Integer idServicio;
    private Long idReserva;
    private String cedula;

    public Solicitar() {}

    public Solicitar(String nombre, LocalDate fecha, LocalTime hora,
                     Integer idServicio, Long idReserva, String cedula) {
        this.id = new SolicitarId(nombre, fecha, hora);
        this.idServicio = idServicio;
        this.idReserva = idReserva;
        this.cedula = cedula;
    }

    public SolicitarId getId() { return id; }
    public void setId(SolicitarId id) { this.id = id; }

    public String getNombre() { return id.getNombre(); }
    public LocalDate getFecha() { return id.getFecha(); }
    public LocalTime getHora() { return id.getHora(); }

    public Integer getIdServicio() { return idServicio; }
    public void setIdServicio(Integer idServicio) { this.idServicio = idServicio; }

    public Long getIdReserva() { return idReserva; }
    public void setIdReserva(Long idReserva) { this.idReserva = idReserva; }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }
}