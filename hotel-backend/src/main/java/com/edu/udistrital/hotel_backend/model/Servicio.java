// Servicio.java
package main.java.com.edu.udistrital.hotel_backend.model;

import java.math.BigDecimal;

public class Servicio {
    private Integer idServicio;
    private String nombreServicio;
    private String descripcion;
    private BigDecimal costo;

    public Servicio() {}

    public Servicio(Integer idServicio, String nombreServicio, String descripcion, BigDecimal costo) {
        this.idServicio = idServicio;
        this.nombreServicio = nombreServicio;
        this.descripcion = descripcion;
        this.costo = costo;
    }

    public Integer getIdServicio() { return idServicio; }
    public void setIdServicio(Integer idServicio) { this.idServicio = idServicio; }

    public String getNombreServicio() { return nombreServicio; }
    public void setNombreServicio(String nombreServicio) { this.nombreServicio = nombreServicio; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getCosto() { return costo; }
    public void setCosto(BigDecimal costo) { this.costo = costo; }
}