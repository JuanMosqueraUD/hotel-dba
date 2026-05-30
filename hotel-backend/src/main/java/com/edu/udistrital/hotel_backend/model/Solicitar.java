package com.edu.udistrital.hotel_backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalTime;

public class Solicitar {
    private SolicitarId id;
    private Integer idServicio;
    private Long idReserva;
    private String cedula;

    public Solicitar() {
        this.id = new SolicitarId(); // ← único cambio aquí
    }

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

    // ← estos tres setters son los únicos agregados nuevos
    @JsonProperty("nombre")
    public void setNombre(String nombre) { this.id.setNombre(nombre); }

    @JsonProperty("fecha")
    public void setFecha(LocalDate fecha) { this.id.setFecha(fecha); }

    @JsonProperty("hora")
    public void setHora(LocalTime hora) { this.id.setHora(hora); }

    public Integer getIdServicio() { return idServicio; }
    public void setIdServicio(Integer idServicio) { this.idServicio = idServicio; }

    public Long getIdReserva() { return idReserva; }
    public void setIdReserva(Long idReserva) { this.idReserva = idReserva; }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }
}