package com.edu.udistrital.hotel_backend.repository;

import com.edu.udistrital.hotel_backend.model.Cliente;
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
}
