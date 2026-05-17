package main.java.com.edu.udistrital.hotel_backend.model;

import java.util.Objects;

public class CorreoClienteId {
    private String cedula;
    private String correo;

    public CorreoClienteId() {}
    public CorreoClienteId(String cedula, String correo) { this.cedula = cedula; this.correo = correo; }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    @Override public boolean equals(Object o) {
        if (!(o instanceof CorreoClienteId)) return false;
        CorreoClienteId that = (CorreoClienteId) o;
        return Objects.equals(cedula, that.cedula) && Objects.equals(correo, that.correo);
    }
    @Override public int hashCode() { return Objects.hash(cedula, correo); }
}