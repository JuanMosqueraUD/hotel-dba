package com.edu.udistrital.hotel_backend.repository;

import com.edu.udistrital.hotel_backend.model.Area;
import com.edu.udistrital.hotel_backend.model.Empleado;
import com.edu.udistrital.hotel_backend.model.Servicio;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class EmpleadoRepository {
    private final JdbcTemplate jdbc;
    private final NamedParameterJdbcTemplate namedJdbc;

    public EmpleadoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.namedJdbc = new NamedParameterJdbcTemplate(jdbc);
    }

    public Empleado save(Empleado empleado) {
        String sql = "INSERT INTO Empleado "
                   + "(Cedula, PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido, Calle, Carrera, Numero, Complemento, Cargo, Area, Salario)"
                   + " VALUES (:cedula, :primerNombre, :segundoNombre, :primerApellido, :segundoApellido, :calle, :carrera, :numero, :complemento, :cargo, :area, :salario)";

        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("cedula", empleado.getCedula())
            .addValue("primerNombre", empleado.getPrimerNombre())
            .addValue("segundoNombre", empleado.getSegundoNombre())
            .addValue("primerApellido", empleado.getPrimerApellido())
            .addValue("segundoApellido", empleado.getSegundoApellido())
            .addValue("calle", empleado.getCalle())
            .addValue("carrera", empleado.getCarrera())
            .addValue("numero", empleado.getNumero())
            .addValue("complemento", empleado.getComplemento())
            .addValue("cargo", empleado.getCargo())
            .addValue("area", empleado.getArea())
            .addValue("salario", empleado.getSalario());

        namedJdbc.update(sql, params);
        return empleado;
    }

    public Servicio saveServicio(Servicio servicio) {
    String sql = "INSERT INTO Servicio (NombreServicio, Descripcion, Costo) "
               + "VALUES (:nombreServicio, :descripcion, :costo)";

    MapSqlParameterSource params = new MapSqlParameterSource()
        .addValue("nombreServicio", servicio.getNombreServicio())
        .addValue("descripcion",    servicio.getDescripcion())
        .addValue("costo",          servicio.getCosto());

    KeyHolder keyHolder = new GeneratedKeyHolder();
    namedJdbc.update(sql, params, keyHolder, new String[]{"idservicio"});

    if (keyHolder.getKey() != null) {
        servicio.setIdServicio(keyHolder.getKey().intValue());
    }
    return servicio;
}

    private final RowMapper<Empleado> empleadoMapper = (rs, rowNum) -> {
        Empleado empleado = new Empleado();
        empleado.setCedula(rs.getString("cedula"));
        empleado.setPrimerNombre(rs.getString("primernombre"));
        empleado.setSegundoNombre(rs.getString("segundonombre"));
        empleado.setPrimerApellido(rs.getString("primerapellido"));
        empleado.setSegundoApellido(rs.getString("segundoapellido"));
        empleado.setCalle(rs.getString("calle"));
        empleado.setCarrera(rs.getString("carrera"));
        empleado.setNumero(rs.getString("numero"));
        empleado.setComplemento(rs.getString("complemento"));
        empleado.setCargo(rs.getString("cargo"));
        empleado.setArea(rs.getInt("area"));
        empleado.setSalario(rs.getInt("salario"));
        return empleado;
    };

    public Area saveArea(Area area) {
    String sql = "INSERT INTO Area (NombreArea) VALUES (:nombreArea)";

    MapSqlParameterSource params = new MapSqlParameterSource()
        .addValue("nombreArea", area.getNombreArea());

    KeyHolder keyHolder = new GeneratedKeyHolder();
    namedJdbc.update(sql, params, keyHolder, new String[]{"idarea"});

    if (keyHolder.getKey() != null) {
        area.setIdArea(keyHolder.getKey().intValue());
    }
    return area;
}

    private final RowMapper<Servicio> servicioMapper = (rs, rowNum) -> {
    Servicio servicio = new Servicio();
    servicio.setIdServicio(rs.getInt("idservicio"));
    servicio.setNombreServicio(rs.getString("nombreservicio"));
    servicio.setDescripcion(rs.getString("descripcion"));
    servicio.setCosto(rs.getBigDecimal("costo"));
    return servicio;
    };

    private final RowMapper<Area> areaMapper = (rs, rowNum) -> {
    Area area = new Area();
    area.setIdArea(rs.getInt("idarea"));
    area.setNombreArea(rs.getString("nombrearea"));
    return area;
};
}

