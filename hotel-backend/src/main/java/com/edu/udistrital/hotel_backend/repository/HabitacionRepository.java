package com.edu.udistrital.hotel_backend.repository;

import com.edu.udistrital.hotel_backend.model.Habitacion;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HabitacionRepository {
    private final JdbcTemplate jdbc;
    private final NamedParameterJdbcTemplate namedJdbc;

    public HabitacionRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.namedJdbc = new NamedParameterJdbcTemplate(jdbc);
    }

    public Habitacion save(Habitacion habitacion) {
        String sql = "INSERT INTO Habitacion "
                   + "(NumeroHabitacion, Tipo, Precio, Disponibilidad)"
                   + " VALUES (:numeroHabitacion, :tipo, :precio, :disponibilidad)";

        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("numeroHabitacion", habitacion.getNumeroHabitacion())
            .addValue("tipo", habitacion.getTipo())
            .addValue("precio", habitacion.getPrecio())
            .addValue("disponibilidad", habitacion.getDisponibilidad());

        namedJdbc.update(sql, params);
        return habitacion;
    }

    public Habitacion findById(Long id) {
        String sql = "SELECT NumeroHabitacion, Tipo, Precio, Disponibilidad "
                   + "FROM Habitacion WHERE NumeroHabitacion = :id";

        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("id", id);

        List<Habitacion> result = namedJdbc.query(sql, params, habitacionMapper);
        return result.isEmpty() ? null : result.get(0);
    }

    public List<Habitacion> findAll() {
        String sql = "SELECT NumeroHabitacion, Tipo, Precio, Disponibilidad FROM Habitacion";
        return namedJdbc.query(sql, habitacionMapper);
    }

    public List<Habitacion> findDisponibles() {
        String sql = "SELECT NumeroHabitacion, Tipo, Precio, Disponibilidad "
                   + "FROM Habitacion WHERE Disponibilidad = true";
        return namedJdbc.query(sql, habitacionMapper);
    }

    public Habitacion update(Long id, Habitacion habitacion) {
        String sql = "UPDATE Habitacion SET Disponibilidad = :disponibilidad "
                   + "WHERE NumeroHabitacion = :id";

        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("disponibilidad", habitacion.getDisponibilidad())
            .addValue("id", id);

        int rows = namedJdbc.update(sql, params);
        return rows > 0 ? findById(id) : null;
    }

    public boolean deleteById(Long id) {
        String sql = "DELETE FROM Habitacion WHERE NumeroHabitacion = :id";
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
        int rows = namedJdbc.update(sql, params);
        return rows > 0;
    }

    private final RowMapper<Habitacion> habitacionMapper = (rs, rowNum) -> {
        Habitacion habitacion = new Habitacion();
        habitacion.setNumeroHabitacion(rs.getLong("numerohabitacion"));
        habitacion.setTipo(rs.getString("tipo"));
        habitacion.setPrecio(rs.getBigDecimal("precio"));
        habitacion.setDisponibilidad(rs.getBoolean("disponibilidad"));
        return habitacion;
    };
}
