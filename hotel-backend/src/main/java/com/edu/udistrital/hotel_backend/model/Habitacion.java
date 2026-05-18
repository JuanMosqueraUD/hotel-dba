// Habitacion.java
package com.edu.udistrital.hotel_backend.model;

import java.math.BigDecimal;

public class Habitacion {
    private Long numeroHabitacion;
    private String tipo;           // 'Sencilla', 'Doble', 'Suite'
    private BigDecimal precio;
    private Boolean disponibilidad;

    public Habitacion() {}

    public Habitacion(Long numeroHabitacion, String tipo, BigDecimal precio, Boolean disponibilidad) {
        this.numeroHabitacion = numeroHabitacion;
        this.tipo = tipo;
        this.precio = precio;
        this.disponibilidad = disponibilidad;
    }

    public Long getNumeroHabitacion() { return numeroHabitacion; }
    public void setNumeroHabitacion(Long numeroHabitacion) { this.numeroHabitacion = numeroHabitacion; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Boolean getDisponibilidad() { return disponibilidad; }
    public void setDisponibilidad(Boolean disponibilidad) { this.disponibilidad = disponibilidad; }
}