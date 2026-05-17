// TelefonoCliente.java
package main.java.com.edu.udistrital.hotel_backend.model;

public class TelefonoCliente {
    private TelefonoClienteId id;

    public TelefonoCliente() {}
    public TelefonoCliente(String cedula, Long telefono) { this.id = new TelefonoClienteId(cedula, telefono); }

    public TelefonoClienteId getId() { return id; }
    public void setId(TelefonoClienteId id) { this.id = id; }
    public String getCedula() { return id.getCedula(); }
    public Long getTelefono() { return id.getTelefono(); }
}