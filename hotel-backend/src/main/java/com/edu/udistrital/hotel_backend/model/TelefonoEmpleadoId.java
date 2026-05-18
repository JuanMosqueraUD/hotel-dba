package com.edu.udistrital.hotel_backend.model;

import java.util.Objects;

public class TelefonoEmpleadoId {
    private String cedula;
    private Long telefono;

    public TelefonoEmpleadoId() {}

    public TelefonoEmpleadoId(String cedula, Long telefono) {
        this.cedula = cedula;
        this.telefono = telefono;
    }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }

    public Long getTelefono() { return telefono; }
    public void setTelefono(Long telefono) { this.telefono = telefono; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TelefonoEmpleadoId)) return false;
        TelefonoEmpleadoId that = (TelefonoEmpleadoId) o;
        return Objects.equals(cedula, that.cedula) && Objects.equals(telefono, that.telefono);
    }

    @Override
    public int hashCode() { return Objects.hash(cedula, telefono); }
}