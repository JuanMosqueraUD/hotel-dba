package com.edu.udistrital.hotel_backend.repository;

import com.edu.udistrital.hotel_backend.model.Cliente;
import com.edu.udistrital.hotel_backend.model.ClienteReservaServicioView;
import com.edu.udistrital.hotel_backend.model.CorreoCliente;
import com.edu.udistrital.hotel_backend.model.CorreoClienteId;
import com.edu.udistrital.hotel_backend.model.TelefonoCliente;
import com.edu.udistrital.hotel_backend.model.TelefonoClienteId;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ClienteRepository {
    private final JdbcTemplate jdbc;
    private final NamedParameterJdbcTemplate namedJdbc;

    public ClienteRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.namedJdbc = new NamedParameterJdbcTemplate(jdbc);
    }

    public Cliente save(Cliente cliente) {
        String sql = "INSERT INTO Cliente "
                + "(Cedula, PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido, Calle, Carrera, Numero, Complemento)"
                + " VALUES (:cedula, :primerNombre, :segundoNombre, :primerApellido, :segundoApellido, :calle, :carrera, :numero, :complemento)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("cedula", cliente.getCedula())
                .addValue("primerNombre", cliente.getPrimerNombre())
                .addValue("segundoNombre", cliente.getSegundoNombre())
                .addValue("primerApellido", cliente.getPrimerApellido())
                .addValue("segundoApellido", cliente.getSegundoApellido())
                .addValue("calle", cliente.getCalle())
                .addValue("carrera", cliente.getCarrera())
                .addValue("numero", cliente.getNumero())
                .addValue("complemento", cliente.getComplemento());

        namedJdbc.update(sql, params);
        return cliente;
    }

    public List<Cliente> findAll() {
        String sql = "SELECT * FROM Cliente";
        return jdbc.query(sql, clienteMapper);
    }

    public List<ClienteReservaServicioView> findAllClienteReservaServicios() {
        String sql = "SELECT cedulacliente, nombrecliente, segundonombrecliente, "
                   + "apellidocliente, segundoapellidocliente, idreserva, fechallegada, fechasalida, "
                   + "tiempocancelacion, numerohabitacion, nombresolicitud, fechasolicitud, horasolicitud, "
                   + "idservicio, nombreservicio, descripcionservicio, costoservicio "
                   + "FROM vista_cliente_reserva_servicios";
        return jdbc.query(sql, clienteReservaServicioViewMapper);
    }

    private final RowMapper<ClienteReservaServicioView> clienteReservaServicioViewMapper = (rs, rowNum) -> {
        ClienteReservaServicioView view = new ClienteReservaServicioView();
        view.setCedulaCliente(rs.getString("cedulacliente"));
        view.setNombreCliente(rs.getString("nombrecliente"));
        view.setSegundoNombreCliente(rs.getString("segundonombrecliente"));
        view.setApellidoCliente(rs.getString("apellidocliente"));
        view.setSegundoApellidoCliente(rs.getString("segundoapellidocliente"));
        view.setIdReserva(rs.getLong("idreserva"));
        view.setFechaLlegada(rs.getObject("fechallegada", java.time.LocalDate.class));
        view.setFechaSalida(rs.getObject("fechasalida", java.time.LocalDate.class));
        view.setTiempoCancelacion(rs.getLong("tiempocancelacion"));
        view.setNumeroHabitacion(rs.getLong("numerohabitacion"));
        view.setNombreSolicitud(rs.getString("nombresolicitud"));
        view.setFechaSolicitud(rs.getObject("fechasolicitud", java.time.LocalDate.class));
        view.setHoraSolicitud(rs.getObject("horasolicitud", java.time.LocalTime.class));
        view.setIdServicio(rs.getInt("idservicio"));
        view.setNombreServicio(rs.getString("nombreservicio"));
        view.setDescripcionServicio(rs.getString("descripcionservicio"));
        view.setCostoServicio(rs.getBigDecimal("costoservicio"));
        return view;
    };

    private final RowMapper<Cliente> clienteMapper = (rs, rowNum) -> {
        Cliente cliente = new Cliente();
        cliente.setCedula(rs.getString("cedula"));
        cliente.setPrimerNombre(rs.getString("primernombre"));
        cliente.setSegundoNombre(rs.getString("segundonombre"));
        cliente.setPrimerApellido(rs.getString("primerapellido"));
        cliente.setSegundoApellido(rs.getString("segundoapellido"));
        cliente.setCalle(rs.getString("calle"));
        cliente.setCarrera(rs.getString("carrera"));
        cliente.setNumero(rs.getString("numero"));
        cliente.setComplemento(rs.getString("complemento"));
        return cliente;
    };

    public Cliente update(String cedula, Cliente cliente) {
        String sql = "UPDATE Cliente SET PrimerNombre = :primerNombre, SegundoNombre = :segundoNombre, "
                   + "PrimerApellido = :primerApellido, SegundoApellido = :segundoApellido, "
                   + "Calle = :calle, Carrera = :carrera, Numero = :numero, Complemento = :complemento "
                   + "WHERE Cedula = :cedula";

        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("primerNombre", cliente.getPrimerNombre())
            .addValue("segundoNombre", cliente.getSegundoNombre())
            .addValue("primerApellido", cliente.getPrimerApellido())
            .addValue("segundoApellido", cliente.getSegundoApellido())
            .addValue("calle", cliente.getCalle())
            .addValue("carrera", cliente.getCarrera())
            .addValue("numero", cliente.getNumero())
            .addValue("complemento", cliente.getComplemento())
            .addValue("cedula", cedula);

        int rows = namedJdbc.update(sql, params);
        return rows > 0 ? findByCedula(cedula) : null;
    }

    public boolean deleteByCedula(String cedula) {
        String sql = "DELETE FROM Cliente WHERE Cedula = :cedula";
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("cedula", cedula);
        int rows = namedJdbc.update(sql, params);
        return rows > 0;
    }

    public Cliente findByCedula(String cedula) {
        String sql = "SELECT * FROM Cliente WHERE Cedula = :cedula";
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("cedula", cedula);
        List<Cliente> result = namedJdbc.query(sql, params, clienteMapper);
        return result.isEmpty() ? null : result.get(0);
    }

    // --- CORREOS CLIENTE ---
    public CorreoCliente saveCorreo(CorreoCliente correo) {
        String sql = "INSERT INTO CorreoCliente (Cedula, Correo) VALUES (:cedula, :correo)";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("cedula", correo.getCedula())
                .addValue("correo", correo.getCorreo());
        namedJdbc.update(sql, params);
        return correo;
    }

    public List<CorreoCliente> findAllCorreos() {
        String sql = "SELECT * FROM CorreoCliente";
        return jdbc.query(sql, correoMapper);
    }

    public List<CorreoCliente> findCorreosByCedula(String cedula) {
        String sql = "SELECT * FROM CorreoCliente WHERE Cedula = :cedula";
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("cedula", cedula);
        return namedJdbc.query(sql, params, correoMapper);
    }

    private final RowMapper<CorreoCliente> correoMapper = (rs, rowNum) -> {
        return new CorreoCliente(rs.getString("cedula"), rs.getString("correo"));
    };

    // --- TELEFONOS CLIENTE ---
    public TelefonoCliente saveTelefono(TelefonoCliente telefono) {
        String sql = "INSERT INTO TelefonoCliente (Cedula, Telefono) VALUES (:cedula, :telefono)";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("cedula", telefono.getCedula())
                .addValue("telefono", telefono.getTelefono());
        namedJdbc.update(sql, params);
        return telefono;
    }

    public List<TelefonoCliente> findAllTelefonos() {
        String sql = "SELECT * FROM TelefonoCliente";
        return jdbc.query(sql, telefonoMapper);
    }

    public List<TelefonoCliente> findTelefonosByCedula(String cedula) {
        String sql = "SELECT * FROM TelefonoCliente WHERE Cedula = :cedula";
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("cedula", cedula);
        return namedJdbc.query(sql, params, telefonoMapper);
    }

    private final RowMapper<TelefonoCliente> telefonoMapper = (rs, rowNum) -> {
        return new TelefonoCliente(rs.getString("cedula"), rs.getLong("telefono"));
    };
}
