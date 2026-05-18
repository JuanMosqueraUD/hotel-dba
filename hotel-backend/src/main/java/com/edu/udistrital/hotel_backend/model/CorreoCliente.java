package com.edu.udistrital.hotel_backend.model;

public class CorreoCliente {
    private CorreoClienteId id;

    public CorreoCliente() {}
    public CorreoCliente(String cedula, String correo) { this.id = new CorreoClienteId(cedula, correo); }

    public CorreoClienteId getId() { return id; }
    public void setId(CorreoClienteId id) { this.id = id; }
    public String getCedula() { return id.getCedula(); }
    public String getCorreo() { return id.getCorreo(); }
}
