// Reservar.java
package main.java.com.edu.udistrital.hotel_backend.model;

import java.time.LocalDate;

public class Reservar {
    private Long idReserva;
    private Long tiempoCancelacion;
    private LocalDate fechaLlegada;
    private LocalDate fechaSalida;
    private String cedula;
    private Long numeroHabitacion;
    // fecha_rango es columna generada, no se mapea para escritura

    public Reservar() {}

    public Reservar(Long idReserva, Long tiempoCancelacion, LocalDate fechaLlegada,
                    LocalDate fechaSalida, String cedula, Long numeroHabitacion) {
        this.idReserva = idReserva;
        this.tiempoCancelacion = tiempoCancelacion;
        this.fechaLlegada = fechaLlegada;
        this.fechaSalida = fechaSalida;
        this.cedula = cedula;
        this.numeroHabitacion = numeroHabitacion;
    }

    public Long getIdReserva() { return idReserva; }
    public void setIdReserva(Long idReserva) { this.idReserva = idReserva; }

    public Long getTiempoCancelacion() { return tiempoCancelacion; }
    public void setTiempoCancelacion(Long tiempoCancelacion) { this.tiempoCancelacion = tiempoCancelacion; }

    public LocalDate getFechaLlegada() { return fechaLlegada; }
    public void setFechaLlegada(LocalDate fechaLlegada) { this.fechaLlegada = fechaLlegada; }

    public LocalDate getFechaSalida() { return fechaSalida; }
    public void setFechaSalida(LocalDate fechaSalida) { this.fechaSalida = fechaSalida; }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }

    public Long getNumeroHabitacion() { return numeroHabitacion; }
    public void setNumeroHabitacion(Long numeroHabitacion) { this.numeroHabitacion = numeroHabitacion; }
}