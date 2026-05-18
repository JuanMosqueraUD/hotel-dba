# Sistema de Gestión Operativa de un Hotel

## Descripción del Sistema
Sistema web para gestionar el ciclo operativo completo de un hotel, integrando reservas de habitaciones, consumo de servicios adicionales y administración de personal. Está diseñado para ser usado por tres tipos de usuarios: recepción, personal de servicio y administración, cada uno con acceso diferenciado según su rol.

---

## Requerimientos Funcionales

- Crear, modificar y cancelar reservas vinculando un cliente con una habitación y definiendo fechas de llegada y salida.
- Registrar cargos adicionales asociados a una reserva activa, indicando fecha, hora y costo.
- Actualizar automáticamente el estado de una habitación al confirmar una reserva o realizar el check-out.
- Capturar y almacenar datos multivalorados de contacto (teléfonos, correos) por cada cliente.
- Validar que no existan solapamientos de reservas para una misma habitación en un mismo rango de fechas.
- Control de acceso basado en roles (recepción, servicio, administración).
- Registrar en auditoría los cambios realizados sobre los empleados.

---

## Instalación y Configuración

### Requisitos previos
- Python 3.10+
- PostgreSQL XX
- (otros que apliquen)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/usuario/repositorio.git
cd repositorio

# 2. Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de la base de datos

# 5. Ejecutar migraciones / inicializar la base de datos
# (completar con el comando correspondiente)

# 6. Iniciar el servidor
uvicorn main:app --reload
```

La API estará disponible en `http://localhost:8000`.  
Documentación interactiva en `http://localhost:8000/docs`.

---

## Diagrama ER

<!-- Insertar imagen o enlace al diagrama -->
![Diagrama ER](./docs/diagrama_er.png)

> También disponible en: [enlace al diagrama](#)

---

## Endpoints Principales

| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/reservas` | Crear una nueva reserva |
| GET | `/reservas/{id}` | Consultar una reserva por ID |
| PUT | `/reservas/{id}` | Modificar una reserva existente |
| DELETE | `/reservas/{id}` | Cancelar una reserva |
| GET | `/habitaciones/disponibles` | Consultar habitaciones disponibles |
| POST | `/servicios/cargo` | Registrar un cargo adicional a una reserva |
| GET | `/clientes/{id}` | Consultar datos de un cliente |
| ... | ... | ... |

---

## Integrantes del Grupo

| Nombre | Correo | Rol en el proyecto |
|--------|--------|--------------------|
| Juan Pablo Mosquera Marín | jpmosqueram@udistrital.edu.co | <!-- completar --> |
| Juan David Amaya Patiño | jdamayap@udistrital.edu.co | <!-- completar --> |