package com.edu.udistrital.hotel_backend.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonCreator;

public class SolicitarId {
    private String nombre;
    private LocalDate fecha;
    private LocalTime hora;

    public SolicitarId() {}
    public SolicitarId(String nombre, LocalDate fecha, LocalTime hora) {
        this.nombre = nombre; 
        this.fecha = fecha; 
        this.hora = hora;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }

    @Override public boolean equals(Object o) {
        if (!(o instanceof SolicitarId)) return false;
        SolicitarId that = (SolicitarId) o;
        return Objects.equals(nombre, that.nombre) && Objects.equals(fecha, that.fecha)
                && Objects.equals(hora, that.hora);
    }
    @Override public int hashCode() { return Objects.hash(nombre, fecha, hora); }
}