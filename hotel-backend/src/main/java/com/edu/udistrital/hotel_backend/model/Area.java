// Area.java
package main.java.com.edu.udistrital.hotel_backend.model;

public class Area {
    private Integer idArea;
    private String nombreArea;

    public Area() {}

    public Area(Integer idArea, String nombreArea) {
        this.idArea = idArea;
        this.nombreArea = nombreArea;
    }

    public Integer getIdArea() { return idArea; }
    public void setIdArea(Integer idArea) { this.idArea = idArea; }

    public String getNombreArea() { return nombreArea; }
    public void setNombreArea(String nombreArea) { this.nombreArea = nombreArea; }
}