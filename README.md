# Sistema de Gestión Operativa de un Hotel

## Descripción del Sistema

Sistema web para gestionar el ciclo operativo completo del **Hotel Imperial**, integrando
reservas de habitaciones, consumo de servicios adicionales y administración de personal.
Está diseñado para tres tipos de usuarios: **recepción** (gestión de clientes y reservas),
**personal de servicio** (registro de solicitudes adicionales) y **administración**
(gestión de empleados, áreas y catálogo de servicios). La interfaz es una aplicación web
conectada a una API REST desarrollada en **Spring Boot** con base de datos **PostgreSQL**.

---

## Requerimientos Funcionales

- Registro y consulta de clientes con datos de contacto multivalorados (correos en `CorreoCliente` y teléfonos en `TelefonoCliente`).
- Gestión del catálogo de habitaciones: creación, consulta por ID y actualización de disponibilidad.
- Creación y modificación de reservas en `Reservar`, vinculando cliente–habitación–fechas, con columna calculada `fecha_rango`.
- Registro de solicitudes de servicios adicionales en `Solicitar`, asociadas a una reserva activa y al empleado responsable de la atención.
- Gestión de empleados, áreas de trabajo y catálogo de servicios.
- Validación automática de solapamiento de reservas para la misma habitación mediante el trigger `trg_no_solapamiento` (`BEFORE INSERT OR UPDATE` en `Reservar`).
- Auditoría automática de cambios (INSERT, UPDATE, DELETE) en la tabla `Empleado` mediante el trigger `trg_audit_empleado`, almacenando valores anteriores y nuevos en formato JSONB.

---

## Instalación y Configuración

### Requisitos previos

- Java 17+
- Maven 3.8+
- PostgreSQL 15+
- Extensión `btree_gist` habilitada en PostgreSQL (requerida para `daterange` y el operador `&&`)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/usuario/hotel-imperial.git
cd hotel-imperial

# 2. Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE hotel_imperial;"

# 3. Habilitar la extensión requerida
psql -U postgres -d hotel_imperial -c "CREATE EXTENSION IF NOT EXISTS btree_gist;"

# 4. Ejecutar el script de migración (crea tablas, triggers, índices y vista)
psql -U postgres -d hotel_imperial -f src/main/resources/db/migration.sql

# 5. Configurar las credenciales de conexión
# Editar src/main/resources/application.properties:
#   spring.datasource.url=jdbc:postgresql://localhost:5432/hotel_imperial
#   spring.datasource.username=TU_USUARIO
#   spring.datasource.password=TU_CONTRASEÑA

# 6. Compilar y ejecutar el proyecto
mvn clean install
mvn spring-boot:run
```

La API estará disponible en `http://localhost:8080`.

---

## Diagrama ER

![Diagrama ER](https://github.com/JuanMosqueraUD/hotel-dba/blob/265531fb53b577027c54c15ffc9c18f1f4c8dbe7/Entregables/Entidad%20relacion.jpeg)

El modelo relacional se compone de **diez tablas**:
`Cliente`, `TelefonoCliente`, `CorreoCliente`, `Habitacion`, `Reservar`,
`Solicitar`, `Servicio`, `Empleado`, `TelefonoEmpleado` y `Area`.

---

## Endpoints Principales

### Clientes

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/clientes` | Listar todos los clientes |
| POST | `/clientes` | Registrar nuevo cliente |
| PUT | `/clientes/{cedula}` | Actualizar datos del cliente |
| DELETE | `/clientes/{cedula}` | Eliminar cliente |
| GET | `/clientes/correos` | Listar todos los correos |
| POST | `/clientes/correos` | Registrar correo de cliente |
| GET | `/clientes/{cedula}/correos` | Correos de un cliente por cédula |
| GET | `/clientes/telefonos` | Listar todos los teléfonos de clientes |
| POST | `/clientes/telefonos` | Registrar teléfono de cliente |
| GET | `/clientes/{cedula}/telefonos` | Teléfonos de un cliente por cédula |
| GET | `/clientes/sin-reserva-activa` | Clientes sin reserva vigente (subconsulta `NOT EXISTS`) |
| GET | `/clientes/reserva-servicios` | Consumo completo por cliente (vista `Vista_Cliente_Reserva_Servicios`) |

### Habitaciones

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/habitaciones` | Listar todas las habitaciones |
| POST | `/habitaciones` | Agregar nueva habitación |
| GET | `/habitaciones/{id}` | Consultar habitación por número |
| GET | `/habitaciones/disponibles` | Habitaciones con `Disponibilidad = TRUE` |
| PUT | `/habitaciones/{id}` | Actualizar disponibilidad |
| DELETE | `/habitaciones/{id}` | Eliminar habitación |

### Reservas

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/reservas` | Listar todas las reservas |
| POST | `/reservas` | Crear reserva (transacción SERIALIZABLE + `trg_no_solapamiento`) |
| PUT | `/reservas/{id}` | Actualizar reserva (dispara `trg_no_solapamiento`) |
| DELETE | `/reservas/{id}` | Cancelar reserva (transacción: borra `Solicitar` y `Reservar`) |
| POST | `/reservas/solicitar` | Registrar solicitud de servicio adicional |

### Empleados

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/empleados` | Listar todos los empleados |
| POST | `/empleados` | Registrar empleado (dispara `trg_audit_empleado`) |
| PUT | `/empleados/{cedula}` | Actualizar empleado (dispara `trg_audit_empleado`) |
| DELETE | `/empleados/{cedula}` | Eliminar empleado (dispara `trg_audit_empleado`) |
| GET | `/empleados/telefonos` | Listar teléfonos de empleados |
| POST | `/empleados/telefonos` | Registrar teléfono de empleado |
| GET | `/empleados/{cedula}/telefonos` | Teléfonos de un empleado por cédula |
| POST | `/empleados/areas` | Crear nueva área de trabajo |
| POST | `/empleados/servicios` | Crear nuevo servicio en catálogo |

---

## Integrantes del Grupo

| Nombre | Correo | Rol en el proyecto |
|--------|--------|--------------------|
| Juan David Amaya Patiño | jdamayap@udistrital.edu.co | Backend & Base de Datos |
| Juan Pablo Mosquera Marín | jpmosqueram@udistrital.edu.co | Backend & Documentación |

---

> **Universidad Distrital Francisco José de Caldas** · Facultad de Ingeniería · Ingeniería de Sistemas  
> Bases de Datos Avanzadas · Proyecto Final 2026 · Grupo 020-82 · Docente: René Alejandro Lobo Quintero