package com.edu.udistrital.hotel_backend.repository;

import com.edu.udistrital.hotel_backend.model.Reservar;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

@Repository
public class ReservarRepository {
    private final JdbcTemplate jdbc;
    private final NamedParameterJdbcTemplate namedJdbc;

    public ReservarRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.namedJdbc = new NamedParameterJdbcTemplate(jdbc);
    }

    public Reservar save(Reservar reserva) {
        String sql = "INSERT INTO Reservar "
                   + "(TiempoCancelacion, FechaLlegada, FechaSalida, Cedula, NumeroHabitacion)"
                   + " VALUES (:tiempoCancelacion, :fechaLlegada, :fechaSalida, :cedula, :numeroHabitacion)";

        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("tiempoCancelacion", reserva.getTiempoCancelacion())
            .addValue("fechaLlegada", reserva.getFechaLlegada())
            .addValue("fechaSalida", reserva.getFechaSalida())
            .addValue("cedula", reserva.getCedula())
            .addValue("numeroHabitacion", reserva.getNumeroHabitacion());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        namedJdbc.update(sql, params, keyHolder, new String[]{"idreserva"});

        if (keyHolder.getKey() != null) {
            reserva.setIdReserva(keyHolder.getKey().longValue());
        }
        return reserva;
    }

    private final RowMapper<Reservar> reservarMapper = (rs, rowNum) -> {
        Reservar reserva = new Reservar();
        reserva.setIdReserva(rs.getLong("idreserva"));
        reserva.setTiempoCancelacion(rs.getLong("tiempocancelacion"));
        reserva.setFechaLlegada(rs.getObject("fechallegada", LocalDate.class));
        reserva.setFechaSalida(rs.getObject("fechasalida", LocalDate.class));
        reserva.setCedula(rs.getString("cedula"));
        reserva.setNumeroHabitacion(rs.getLong("numerohabitacion"));
        return reserva;
    };
}
