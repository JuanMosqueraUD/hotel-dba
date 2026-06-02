package com.edu.udistrital.hotel_backend.repository;

import com.edu.udistrital.hotel_backend.model.Reservar;
import com.edu.udistrital.hotel_backend.model.Solicitar;
import com.edu.udistrital.hotel_backend.model.SolicitarId;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Connection;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import java.util.List;

@Repository
public class ReservarRepository {
    private final JdbcTemplate jdbc;
    private final NamedParameterJdbcTemplate namedJdbc;

    public ReservarRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.namedJdbc = new NamedParameterJdbcTemplate(jdbc);
    }

    public Reservar save(Reservar reserva) {
        Connection conn = null;
        try {
            conn = jdbc.getDataSource().getConnection();
            conn.setAutoCommit(false);
            conn.createStatement().execute("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;");

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

            conn.createStatement().execute("COMMIT;");
            return reserva;
        } catch (Exception ex) {
            if (conn != null) {
                try { conn.createStatement().execute("ROLLBACK;"); } catch (SQLException e) {}
            }
            throw new RuntimeException("Error creating reserva", ex);
        } finally {
            if (conn != null) {
                try { conn.close(); } catch (SQLException e) {}
            }
        }
    }

    public List<Reservar> findAll() {
        String sql = "SELECT * FROM Reservar";
        return jdbc.query(sql, reservarMapper);
    }

    public Optional<Reservar> update(Long idReserva, Reservar reserva) {
    String sql = "UPDATE Reservar SET "
               + "TiempoCancelacion = :tiempoCancelacion, "
               + "FechaLlegada      = :fechaLlegada, "
               + "FechaSalida       = :fechaSalida, "
               + "Cedula            = :cedula, "
               + "NumeroHabitacion  = :numeroHabitacion "
               + "WHERE IdReserva   = :idReserva";

    MapSqlParameterSource params = new MapSqlParameterSource()
        .addValue("tiempoCancelacion", reserva.getTiempoCancelacion())
        .addValue("fechaLlegada",      reserva.getFechaLlegada())
        .addValue("fechaSalida",       reserva.getFechaSalida())
        .addValue("cedula",            reserva.getCedula())
        .addValue("numeroHabitacion",  reserva.getNumeroHabitacion())
        .addValue("idReserva",         idReserva);

    int filas = namedJdbc.update(sql, params);
    if (filas == 0) return Optional.empty(); // No existía ese IdReserva

    reserva.setIdReserva(idReserva);
    return Optional.of(reserva);
}

    public Solicitar saveSolicitar(Solicitar solicitar) {
    String sql = "INSERT INTO Solicitar "
               + "(Nombre, Fecha, Hora, IdServicio, IdReserva, Cedula) "
               + "VALUES (:nombre, :fecha, :hora, :idServicio, :idReserva, :cedula)";

    MapSqlParameterSource params = new MapSqlParameterSource()
        .addValue("nombre",     solicitar.getNombre())
        .addValue("fecha",      solicitar.getFecha())
        .addValue("hora",       solicitar.getHora())
        .addValue("idServicio", solicitar.getIdServicio())
        .addValue("idReserva",  solicitar.getIdReserva())
        .addValue("cedula",     solicitar.getCedula());

    namedJdbc.update(sql, params);
    return solicitar;
}

    public boolean deleteById(Long idReserva) {
        Connection conn = null;
        try {
            conn = jdbc.getDataSource().getConnection();
            conn.setAutoCommit(false);
            conn.createStatement().execute("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;");

            MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("idReserva", idReserva);

            // Remove dependent service requests first to avoid FK violations
            namedJdbc.update("DELETE FROM Solicitar WHERE IdReserva = :idReserva", params);
            int rows = namedJdbc.update("DELETE FROM Reservar WHERE IdReserva = :idReserva", params);

            conn.createStatement().execute("COMMIT;");
            return rows > 0;
        } catch (Exception ex) {
            if (conn != null) {
                try { conn.createStatement().execute("ROLLBACK;"); } catch (SQLException e) {}
            }
            throw new RuntimeException("Error deleting reserva", ex);
        } finally {
            if (conn != null) {
                try { conn.close(); } catch (SQLException e) {}
            }
        }
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

    private final RowMapper<Solicitar> solicitarMapper = (rs, rowNum) -> {
    SolicitarId solicitarId = new SolicitarId();
    solicitarId.setNombre(rs.getString("nombre"));
    solicitarId.setFecha(rs.getObject("fecha", LocalDate.class));
    solicitarId.setHora(rs.getObject("hora", LocalTime.class));

    Solicitar solicitar = new Solicitar();
    solicitar.setId(solicitarId);
    solicitar.setIdServicio(rs.getInt("idservicio"));
    solicitar.setIdReserva(rs.getLong("idreserva"));
    solicitar.setCedula(rs.getString("cedula"));
    return solicitar;
};

}
