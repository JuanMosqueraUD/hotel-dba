package com.edu.udistrital.hotel_backend.model;

public class TelefonoEmpleado {
    private TelefonoEmpleadoId id;

    public TelefonoEmpleado() {}

    public TelefonoEmpleado(String cedula, Long telefono) {
        this.id = new TelefonoEmpleadoId(cedula, telefono);
    }

    public TelefonoEmpleadoId getId() { return id; }
    public void setId(TelefonoEmpleadoId id) { this.id = id; }

    // Accesores planos para comodidad en los RowMapper
    public String getCedula() { return id.getCedula(); }
    public Long getTelefono() { return id.getTelefono(); }
}