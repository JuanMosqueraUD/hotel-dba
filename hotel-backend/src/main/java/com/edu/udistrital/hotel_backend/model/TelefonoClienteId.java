package com.edu.udistrital.hotel_backend.model;

import java.util.Objects;

public class TelefonoClienteId {
    private String cedula;
    private Long telefono;

    public TelefonoClienteId() {}
    public TelefonoClienteId(String cedula, Long telefono) { this.cedula = cedula; this.telefono = telefono; }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }
    public Long getTelefono() { return telefono; }
    public void setTelefono(Long telefono) { this.telefono = telefono; }

    @Override public boolean equals(Object o) {
        if (!(o instanceof TelefonoClienteId)) return false;
        TelefonoClienteId that = (TelefonoClienteId) o;
        return Objects.equals(cedula, that.cedula) && Objects.equals(telefono, that.telefono);
    }
    @Override public int hashCode() { return Objects.hash(cedula, telefono); }
}