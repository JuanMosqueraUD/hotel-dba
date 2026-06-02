package com.edu.udistrital.hotel_backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ClienteReservaServicioView {
    private String cedulaCliente;
    private String nombreCliente;
    private String segundoNombreCliente;
    private String apellidoCliente;
    private String segundoApellidoCliente;
    private Long idReserva;
    private LocalDate fechaLlegada;
    private LocalDate fechaSalida;
    private Long tiempoCancelacion;
    private Long numeroHabitacion;
    private String nombreSolicitud;
    private LocalDate fechaSolicitud;
    private LocalTime horaSolicitud;
    private Integer idServicio;
    private String nombreServicio;
    private String descripcionServicio;
    private BigDecimal costoServicio;

    public ClienteReservaServicioView() {
    }

    public String getCedulaCliente() {
        return cedulaCliente;
    }

    public void setCedulaCliente(String cedulaCliente) {
        this.cedulaCliente = cedulaCliente;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getSegundoNombreCliente() {
        return segundoNombreCliente;
    }

    public void setSegundoNombreCliente(String segundoNombreCliente) {
        this.segundoNombreCliente = segundoNombreCliente;
    }

    public String getApellidoCliente() {
        return apellidoCliente;
    }

    public void setApellidoCliente(String apellidoCliente) {
        this.apellidoCliente = apellidoCliente;
    }

    public String getSegundoApellidoCliente() {
        return segundoApellidoCliente;
    }

    public void setSegundoApellidoCliente(String segundoApellidoCliente) {
        this.segundoApellidoCliente = segundoApellidoCliente;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public LocalDate getFechaLlegada() {
        return fechaLlegada;
    }

    public void setFechaLlegada(LocalDate fechaLlegada) {
        this.fechaLlegada = fechaLlegada;
    }

    public LocalDate getFechaSalida() {
        return fechaSalida;
    }

    public void setFechaSalida(LocalDate fechaSalida) {
        this.fechaSalida = fechaSalida;
    }

    public Long getTiempoCancelacion() {
        return tiempoCancelacion;
    }

    public void setTiempoCancelacion(Long tiempoCancelacion) {
        this.tiempoCancelacion = tiempoCancelacion;
    }

    public Long getNumeroHabitacion() {
        return numeroHabitacion;
    }

    public void setNumeroHabitacion(Long numeroHabitacion) {
        this.numeroHabitacion = numeroHabitacion;
    }

    public String getNombreSolicitud() {
        return nombreSolicitud;
    }

    public void setNombreSolicitud(String nombreSolicitud) {
        this.nombreSolicitud = nombreSolicitud;
    }

    public LocalDate getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDate fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public LocalTime getHoraSolicitud() {
        return horaSolicitud;
    }

    public void setHoraSolicitud(LocalTime horaSolicitud) {
        this.horaSolicitud = horaSolicitud;
    }

    public Integer getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(Integer idServicio) {
        this.idServicio = idServicio;
    }

    public String getNombreServicio() {
        return nombreServicio;
    }

    public void setNombreServicio(String nombreServicio) {
        this.nombreServicio = nombreServicio;
    }

    public String getDescripcionServicio() {
        return descripcionServicio;
    }

    public void setDescripcionServicio(String descripcionServicio) {
        this.descripcionServicio = descripcionServicio;
    }

    public BigDecimal getCostoServicio() {
        return costoServicio;
    }

    public void setCostoServicio(BigDecimal costoServicio) {
        this.costoServicio = costoServicio;
    }
}