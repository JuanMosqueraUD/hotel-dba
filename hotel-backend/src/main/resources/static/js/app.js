/**
 * Hotel Imperial Management SPA Engine
 */

class HotelApp {
    constructor() {
        this.activeView = 'dashboard';

        // Cache arrays for client-side search/filtering
        this.clientes = [];
        this.habitaciones = [];
        this.habitacionesDisponibles = [];
        this.clienteReservaServicios = [];
        this.reservas = [];
        this.empleados = [];
        this.correosClientes = [];
        this.telefonosClientes = [];
        this.telefonosEmpleados = [];

        // Init SPA when document loads
        document.addEventListener('DOMContentLoaded', () => this.init());
    }

    async handleDeleteCliente(cedula) {
        if (!confirm(`Eliminar cliente ${cedula}?`)) return;
        try {
            const resp = await fetch(`/clientes/${cedula}`, { method: 'DELETE' });
            if (!resp.ok) throw new Error('No se pudo eliminar cliente');
            this.showToast('Cliente eliminado', 'success');
            this.fetchClientes();
        } catch (err) {
            this.showToast('Error al eliminar cliente', 'error');
            console.error(err);
        }
    }

    async handleDeleteEmpleado(cedula) {
        if (!confirm(`Eliminar empleado ${cedula}?`)) return;
        try {
            const resp = await fetch(`/empleados/${cedula}`, { method: 'DELETE' });
            if (!resp.ok) throw new Error('No se pudo eliminar empleado');
            this.showToast('Empleado eliminado', 'success');
            this.fetchEmpleados();
        } catch (err) {
            this.showToast('Error al eliminar empleado', 'error');
            console.error(err);
        }
    }

    async handleDeleteHabitacion(id) {
        if (!confirm(`Eliminar habitación ${id}?`)) return;
        try {
            const resp = await fetch(`/habitaciones/${id}`, { method: 'DELETE' });
            if (!resp.ok) throw new Error('No se pudo eliminar habitación');
            this.showToast('Habitación eliminada', 'success');
            this.fetchHabitaciones();
            this.fetchHabitacionesDisponibles();
        } catch (err) {
            this.showToast('Error al eliminar habitación', 'error');
            console.error(err);
        }
    }

    init() {
        this.initRouting();
        this.loadAllData();

        // Auto-refresh stats and data every 30 seconds
        setInterval(() => this.loadAllData(true), 30000);
    }

    // --- Client Side SPA Router ---
    initRouting() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.getAttribute('data-view');
                this.switchView(view);
            });
        });
    }

    switchView(viewId) {
        // Update active class on Sidebar Links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Hide all views, display the selected one
        document.querySelectorAll('.view-section').forEach(section => {
            if (section.id === `${viewId}-view`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update Page Titles dynamically
        const titleEl = document.getElementById('view-title');
        const subtitleEl = document.getElementById('view-subtitle');
        this.activeView = viewId;

        switch (viewId) {
            case 'dashboard':
                titleEl.textContent = 'Dashboard';
                subtitleEl.textContent = 'Resumen general y estado de ocupación';
                break;
            case 'clientes':
                titleEl.textContent = 'Gestión de Clientes';
                subtitleEl.textContent = 'Registro y consulta de huéspedes';
                this.fetchClientes();
                break;
            case 'habitaciones':
                titleEl.textContent = 'Habitaciones';
                subtitleEl.textContent = 'Control y catálogo de habitaciones';
                this.fetchHabitaciones();
                this.fetchHabitacionesDisponibles();
                this.fetchClienteReservaServicios();
                break;
            case 'reservas':
                titleEl.textContent = 'Reservas y Solicitudes';
                subtitleEl.textContent = 'Agenda y requerimientos adicionales';
                this.fetchReservas();
                break;
            case 'empleados':
                titleEl.textContent = 'Personal y Estructura';
                subtitleEl.textContent = 'Colaboradores, áreas y servicios';
                this.fetchEmpleados();
                break;
        }

        // Initialize icons dynamically
        lucide.createIcons();
    }

    // --- Modal overlays controllers ---
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');

            // Set current date to form-inputs where applicable
            const dateInputs = modal.querySelectorAll('input[type="date"]');
            const todayStr = new Date().toISOString().split('T')[0];
            dateInputs.forEach(input => {
                if (!input.value) input.value = todayStr;
            });
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
            // Clean forms
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    }

    // --- Toast Alert Notifications System ---
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconName = 'check-circle';
        if (type === 'warning') iconName = 'alert-triangle';
        if (type === 'error') iconName = 'alert-octagon';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        lucide.createIcons();

        // Remove toast automatically after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // --- Dynamic API integration Layer ---

    async loadAllData(silent = false) {
        if (!silent) console.log("Initializing sync with backend...");
        await Promise.all([
            this.fetchClientes(silent),
            this.fetchHabitaciones(silent),
            this.fetchHabitacionesDisponibles(silent),
            this.fetchClienteReservaServicios(silent),
            this.fetchReservas(silent),
            this.fetchEmpleados(silent)
        ]);
        this.updateDashboardStats();
    }

    updateDashboardStats() {
        // Update available rooms count
        const availableCount = this.habitaciones.filter(h => h.disponibilidad === true).length;
        document.getElementById('stat-rooms-avail').textContent = this.habitaciones.length > 0 ? availableCount : '0';

        // Update total clients
        document.getElementById('stat-clients-count').textContent = this.clientes.length;

        // Update total reservations
        document.getElementById('stat-bookings-count').textContent = this.reservas.length;
    }

    // 1. CLIENTS ENDPOINTS
    async fetchClientes(silent = false) {
        try {
            const [clientRes, correoRes, telRes] = await Promise.all([
                fetch('/clientes'),
                fetch('/clientes/correos'),
                fetch('/clientes/telefonos')
            ]);

            if (clientRes.ok) {
                this.clientes = await clientRes.json();
            } else {
                throw new Error("Server error fetching clients");
            }

            if (correoRes.ok) this.correosClientes = await correoRes.json();
            if (telRes.ok) this.telefonosClientes = await telRes.json();

            this.renderClientes();
            this.renderDashboardClientes();
        } catch (error) {
            if (!silent) this.showToast("No se pudo cargar clientes desde el backend", "error");
            console.error(error);
        }
    }

    renderClienteRow(c) {
        const clientCorreos = this.correosClientes
            .filter(cor => cor.cedula === c.cedula)
            .map(cor => `<span class="badge badge-info" style="display:block; margin-bottom:2px;">${cor.correo}</span>`)
            .join('') || '-';
        const clientTelefonos = this.telefonosClientes
            .filter(tel => tel.cedula === c.cedula)
            .map(tel => `<span class="badge badge-success" style="display:block; margin-bottom:2px;">${tel.telefono}</span>`)
            .join('') || '-';

        return `
            <tr>
                <td><strong>${c.cedula}</strong></td>
                <td>${c.primerNombre}</td>
                <td>${c.segundoNombre || '-'}</td>
                <td>${c.primerApellido}</td>
                <td>${c.segundoApellido || '-'}</td>
                <td>${c.calle || '-'}</td>
                <td>${c.carrera || '-'}</td>
                <td>${c.numero || '-'}</td>
                <td><span class="badge badge-info">${c.complemento || '-'}</span></td>
                <td>${clientCorreos}</td>
                <td>${clientTelefonos}</td>
                <td>
                    <button class="btn btn-secondary btn-icon" onclick="app.openEditCliente('${c.cedula}')">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" style="margin-left:0.5rem;" onclick="app.handleDeleteCliente('${c.cedula}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    renderClientes() {
        const tbody = document.getElementById('clientes-tbody');
        if (!tbody) return;

        if (this.clientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-secondary);">No hay clientes registrados.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.clientes.map(c => this.renderClienteRow(c)).join('');
        lucide.createIcons();
    }

    renderDashboardClientes() {
        const tbody = document.getElementById('dashboard-clientes-tbody');
        if (!tbody) return;

        if (this.clientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No hay clientes registrados.</td></tr>`;
            return;
        }

        // Show top 5 recent clients
        const recent = this.clientes.slice(-5).reverse();
        tbody.innerHTML = recent.map(c => `
            <tr>
                <td><strong>${c.cedula}</strong></td>
                <td>${c.primerNombre} ${c.primerApellido}</td>
                <td>${c.calle ? `${c.calle} ${c.carrera || ''} ${c.numero || ''}` : '-'}</td>
                <td><span class="badge badge-info">${c.complemento || '-'}</span></td>
            </tr>
        `).join('');
    }

    filterClientes() {
        const q = document.getElementById('search-clientes').value.toLowerCase();
        const tbody = document.getElementById('clientes-tbody');
        if (!tbody) return;

        const filtered = this.clientes.filter(c =>
            c.cedula.toLowerCase().includes(q) ||
            c.primerNombre.toLowerCase().includes(q) ||
            c.primerApellido.toLowerCase().includes(q)
        );

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-secondary);">No se encontraron clientes coincidentes.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(c => this.renderClienteRow(c)).join('');
        lucide.createIcons();
    }

    async fetchClientesSinReservaActiva() {
        try {
            const response = await fetch('/clientes/sin-reserva-activa');
            if (!response.ok) throw new Error('Error al obtener clientes sin reserva activa');
            
            const clientesSinReserva = await response.json();
            
            // Render clients without active reservations
            const tbody = document.getElementById('clientes-tbody');
            if (!tbody) return;

            if (clientesSinReserva.length === 0) {
                tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-secondary);">Todos los clientes tienen reservas activas.</td></tr>`;
                this.showToast('Todos los clientes tienen reservas activas', 'info');
                return;
            }

            tbody.innerHTML = clientesSinReserva.map(c => this.renderClienteRow(c)).join('');
            lucide.createIcons();
            this.showToast(`${clientesSinReserva.length} cliente(s) sin reserva activa`, 'success');
        } catch (error) {
            this.showToast('Error al obtener clientes sin reserva activa', 'error');
            console.error(error);
        }
    }

    async handleCreateCliente(event) {
        event.preventDefault();
        const clientData = {
            cedula: document.getElementById('c-cedula').value,
            primerNombre: document.getElementById('c-primerNombre').value,
            segundoNombre: document.getElementById('c-segundoNombre').value || null,
            primerApellido: document.getElementById('c-primerApellido').value,
            segundoApellido: document.getElementById('c-segundoApellido').value || null,
            calle: document.getElementById('c-calle').value || null,
            carrera: document.getElementById('c-carrera').value || null,
            numero: document.getElementById('c-numero').value || null,
            complemento: document.getElementById('c-complemento').value || null
        };

        const correoVal = document.getElementById('c-correo').value.trim();
        const telefonoVal = document.getElementById('c-telefono').value.trim();

        try {
            const response = await fetch('/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });

            if (!response.ok) throw new Error("Could not create client");

            // sequential POST requests for contacts
            let contactErrors = [];
            if (correoVal) {
                try {
                    const mailResponse = await fetch('/clientes/correos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: {
                                cedula: clientData.cedula,
                                correo: correoVal
                            }
                        })
                    });
                    if (!mailResponse.ok) contactErrors.push("correo");
                } catch (err) {
                    contactErrors.push("correo");
                }
            }

            if (telefonoVal) {
                try {
                    const telResponse = await fetch('/clientes/telefonos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: {
                                cedula: clientData.cedula,
                                telefono: parseInt(telefonoVal, 10)
                            }
                        })
                    });
                    if (!telResponse.ok) contactErrors.push("teléfono");
                } catch (err) {
                    contactErrors.push("teléfono");
                }
            }

            if (contactErrors.length > 0) {
                this.showToast(`¡Cliente registrado, pero falló el registro de: ${contactErrors.join(', ')}!`, "warning");
            } else {
                this.showToast("¡Cliente registrado exitosamente!", "success");
            }

            this.closeModal('modal-cliente');
            this.fetchClientes();
        } catch (error) {
            this.showToast("Error al registrar cliente. Verifique la cédula.", "error");
            console.error(error);
        }
    }

    openEditCliente(cedula) {
        const cliente = this.clientes.find(c => c.cedula === cedula);
        if (!cliente) {
            this.showToast('Cliente no encontrado', 'error');
            return;
        }
        document.getElementById('edit-c-cedula').value = cliente.cedula;
        document.getElementById('edit-c-primerNombre').value = cliente.primerNombre;
        document.getElementById('edit-c-segundoNombre').value = cliente.segundoNombre || '';
        document.getElementById('edit-c-primerApellido').value = cliente.primerApellido;
        document.getElementById('edit-c-segundoApellido').value = cliente.segundoApellido || '';
        document.getElementById('edit-c-calle').value = cliente.calle || '';
        document.getElementById('edit-c-carrera').value = cliente.carrera || '';
        document.getElementById('edit-c-numero').value = cliente.numero || '';
        document.getElementById('edit-c-complemento').value = cliente.complemento || '';
        this.openModal('modal-edit-cliente');
    }

    async handleUpdateCliente(event) {
        event.preventDefault();
        const cedula = document.getElementById('edit-c-cedula').value;
        const data = {
            cedula: cedula,
            primerNombre: document.getElementById('edit-c-primerNombre').value,
            segundoNombre: document.getElementById('edit-c-segundoNombre').value || null,
            primerApellido: document.getElementById('edit-c-primerApellido').value,
            segundoApellido: document.getElementById('edit-c-segundoApellido').value || null,
            calle: document.getElementById('edit-c-calle').value || null,
            carrera: document.getElementById('edit-c-carrera').value || null,
            numero: document.getElementById('edit-c-numero').value || null,
            complemento: document.getElementById('edit-c-complemento').value || null
        };

        try {
            const response = await fetch(`/clientes/${cedula}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('No se pudo actualizar el cliente');

            this.showToast('Cliente actualizado correctamente', 'success');
            this.closeModal('modal-edit-cliente');
            this.fetchClientes();
        } catch (error) {
            this.showToast('Error al actualizar el cliente', 'error');
            console.error(error);
        }
    }

    // 2. ROOMS ENDPOINTS
    async fetchHabitaciones(silent = false) {
        try {
            const response = await fetch('/habitaciones');
            if (response.ok) {
                this.habitaciones = await response.json();
            } else {
                this.habitaciones = [];
            }
            this.renderHabitaciones();
            this.updateDashboardStats();
        } catch (error) {
            console.warn("Using local display. Endpoints can be verified.");
            this.renderHabitaciones();
        }
    }

    async fetchHabitacionesDisponibles(silent = false) {
        try {
            const response = await fetch('/habitaciones/disponibles');
            if (response.ok) {
                this.habitacionesDisponibles = await response.json();
            } else {
                this.habitacionesDisponibles = [];
            }
            this.renderHabitacionesDisponibles();
        } catch (error) {
            console.warn("No se pudo cargar habitaciones disponibles.");
            this.habitacionesDisponibles = [];
            this.renderHabitacionesDisponibles();
        }
    }

    async fetchClienteReservaServicios(silent = false) {
        try {
            const response = await fetch('/clientes/reserva-servicios');
            if (response.ok) {
                this.clienteReservaServicios = await response.json();
            } else {
                this.clienteReservaServicios = [];
            }
            this.renderClienteReservaServicios();
        } catch (error) {
            console.warn("No se pudo cargar la vista cliente-reserva-servicios.");
            this.clienteReservaServicios = [];
            this.renderClienteReservaServicios();
        }
    }

    renderHabitaciones() {
        const tbody = document.querySelector('#habitaciones-view #habitaciones-tbody');
        if (!tbody) return;

        if (this.habitaciones.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No hay habitaciones registradas en el sistema. Use el botón superior para agregar.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.habitaciones.map(h => `
            <tr>
                <td><strong>N° ${h.numeroHabitacion}</strong></td>
                <td>${h.tipo}</td>
                <td style="color: var(--accent-cyan); font-weight: 600;">$${parseFloat(h.precio).toLocaleString()} COP</td>
                <td>
                    <span class="badge ${h.disponibilidad ? 'badge-success' : 'badge-danger'}">
                        <i data-lucide="${h.disponibilidad ? 'check' : 'x'}"></i>
                        ${h.disponibilidad ? 'Disponible' : 'Ocupada'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-secondary btn-icon" style="margin-right:0.5rem;" onclick="app.openEditHabitacion(${h.numeroHabitacion})">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="app.handleDeleteHabitacion(${h.numeroHabitacion})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    renderHabitacionesDisponibles() {
        const tbody = document.querySelector('#habitaciones-view #habitaciones-disponibles-tbody');
        if (!tbody) return;

        if (this.habitacionesDisponibles.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No hay habitaciones disponibles en este momento.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.habitacionesDisponibles.map(h => `
            <tr>
                <td><strong>N° ${h.numeroHabitacion}</strong></td>
                <td>${h.tipo}</td>
                <td style="color: var(--accent-cyan); font-weight: 600;">$${parseFloat(h.precio).toLocaleString()} COP</td>
                <td>
                    <span class="badge badge-success">
                        <i data-lucide="check"></i> Disponible
                    </span>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    renderClienteReservaServicios() {
        const tbody = document.querySelector('#habitaciones-view #vista-clientes-reservas-tbody');
        if (!tbody) return;

        if (this.clienteReservaServicios.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No hay registros de clientes con reservas y servicios para mostrar.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.clienteReservaServicios.slice(0, 8).map(item => `
            <tr>
                <td><strong>${item.cedulaCliente}</strong></td>
                <td>${item.nombreCliente} ${item.segundoNombreCliente || ''} ${item.apellidoCliente} ${item.segundoApellidoCliente || ''}</td>
                <td>Hab. ${item.numeroHabitacion}</td>
                <td>${item.nombreServicio}</td>
                <td>${item.fechaSolicitud || '-'} ${item.horaSolicitud || ''}</td>
                <td style="color: var(--accent-cyan);">$${parseFloat(item.costoServicio || 0).toLocaleString()} COP</td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    async buscarHabitacionPorId() {
        const id = document.getElementById('search-habitacion-id').value;
        if (!id) {
            this.showToast("Ingrese un número de habitación", "warning");
            return;
        }

        try {
            const response = await fetch(`/habitaciones/${id}`);
            const resultBox = document.getElementById('habitacion-search-result');

            if (!response.ok) {
                this.showToast(`Habitación N° ${id} no encontrada`, "error");
                resultBox.style.display = 'none';
                return;
            }

            const h = await response.json();

            document.getElementById('res-hab-numero').textContent = `N° ${h.numeroHabitacion}`;
            document.getElementById('res-hab-tipo').textContent = h.tipo;
            document.getElementById('res-hab-precio').textContent = `$${parseFloat(h.precio).toLocaleString()} COP`;

            const badgeClass = h.disponibilidad ? 'badge-success' : 'badge-danger';
            const badgeIcon = h.disponibilidad ? 'check' : 'x';
            const badgeText = h.disponibilidad ? 'Disponible' : 'Ocupada';

            document.getElementById('res-hab-disponible').innerHTML = `
                <span class="badge ${badgeClass}">
                    <i data-lucide="${badgeIcon}"></i> ${badgeText}
                </span>
            `;

            resultBox.style.display = 'block';
            lucide.createIcons();
            this.showToast("Habitación localizada con éxito", "success");
        } catch (error) {
            this.showToast("Error al buscar habitación", "error");
            console.error(error);
        }
    }

    openEditHabitacion(numeroHabitacion) {
        const habitacion = this.habitaciones.find(h => h.numeroHabitacion == numeroHabitacion);
        if (!habitacion) {
            this.showToast('Habitación no encontrada', 'error');
            return;
        }
        document.getElementById('edit-h-numero').value = habitacion.numeroHabitacion;
        document.getElementById('edit-h-disponible').value = habitacion.disponibilidad ? 'true' : 'false';
        this.openModal('modal-edit-habitacion');
    }

    async handleUpdateHabitacion(event) {
        event.preventDefault();
        const id = document.getElementById('edit-h-numero').value;
        const data = {
            disponibilidad: document.getElementById('edit-h-disponible').value === 'true'
        };

        try {
            const response = await fetch(`/habitaciones/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('No se pudo actualizar la habitación');

            const updated = await response.json();
            const index = this.habitaciones.findIndex(h => h.numeroHabitacion == updated.numeroHabitacion);
            if (index !== -1) {
                this.habitaciones[index] = updated;
            }

            this.renderHabitaciones();
            this.fetchHabitacionesDisponibles();
            this.updateDashboardStats();
            this.showToast('Disponibilidad actualizada correctamente', 'success');
            this.closeModal('modal-edit-habitacion');
        } catch (error) {
            this.showToast('Error al actualizar la habitación', 'error');
            console.error(error);
        }
    }

    async handleCreateHabitacion(event) {
        event.preventDefault();
        const data = {
            numeroHabitacion: parseInt(document.getElementById('h-numero').value),
            tipo: document.getElementById('h-tipo').value,
            precio: parseFloat(document.getElementById('h-precio').value),
            disponibilidad: document.getElementById('h-disponible').value === 'true'
        };

        try {
            const response = await fetch('/habitaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Could not create room");

            this.showToast("¡Habitación guardada correctamente!", "success");
            this.closeModal('modal-habitacion');

            if (!this.habitaciones.some(h => h.numeroHabitacion === data.numeroHabitacion)) {
                this.habitaciones.push(data);
            }
            this.renderHabitaciones();
            this.fetchHabitacionesDisponibles();
            this.updateDashboardStats();
        } catch (error) {
            this.showToast("Error al guardar habitación. Puede que ya exista.", "error");
            console.error(error);
        }
    }

    // 3. BOOKINGS ENDPOINTS
    async fetchReservas(silent = false) {
        try {
            const response = await fetch('/reservas');
            if (response.ok) {
                this.reservas = await response.json();
            } else {
                this.reservas = [];
            }
            this.renderReservas();
        } catch (error) {
            console.warn("Backend load reservations deferred.");
            this.renderReservas();
        }
    }

    renderReservas() {
        const tbody = document.getElementById('reservas-tbody');
        if (!tbody) return;

        if (this.reservas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No hay reservas registradas en el sistema.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.reservas.map(r => `
            <tr>
                <td><strong># ${r.idReserva}</strong></td>
                <td>${r.cedula}</td>
                <td>Hab. ${r.numeroHabitacion}</td>
                <td>${r.fechaLlegada}</td>
                <td>${r.fechaSalida}</td>
                <td>${r.tiempoCancelacion} H</td>
                <td>
                    <button class="btn btn-secondary btn-icon" style="color: var(--primary);" onclick="app.openEditReserva(${JSON.stringify(r).replace(/\"/g, '&quot;')})">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" style="margin-left:6px;" onclick="app.handleDeleteReserva(${r.idReserva})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    filterReservas() {
        const q = document.getElementById('search-reservas').value.toLowerCase();
        const tbody = document.getElementById('reservas-tbody');
        if (!tbody) return;

        const filtered = this.reservas.filter(r => r.cedula.toLowerCase().includes(q));

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No se encontraron reservas.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(r => `
            <tr>
                <td><strong># ${r.idReserva}</strong></td>
                <td>${r.cedula}</td>
                <td>Hab. ${r.numeroHabitacion}</td>
                <td>${r.fechaLlegada}</td>
                <td>${r.fechaSalida}</td>
                <td>${r.tiempoCancelacion} H</td>
                <td>
                    <button class="btn btn-secondary btn-icon" style="color: var(--primary);" onclick="app.openEditReserva(${JSON.stringify(r).replace(/"/g, '&quot;')})">
                        <i data-lucide="edit-3"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    async handleCreateReserva(event) {
        event.preventDefault();
        const data = {
            cedula: document.getElementById('r-cedula').value,
            numeroHabitacion: parseInt(document.getElementById('r-habitacion').value),
            fechaLlegada: document.getElementById('r-llegada').value,
            fechaSalida: document.getElementById('r-salida').value,
            tiempoCancelacion: parseInt(document.getElementById('r-cancelacion').value)
        };

        try {
            const response = await fetch('/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error creating reservation");

            const savedReserva = await response.json();

            this.showToast("¡Reserva creada exitosamente!", "success");
            this.closeModal('modal-reserva');

            this.reservas.push(savedReserva);
            this.renderReservas();

            const room = this.habitaciones.find(h => h.numeroHabitacion === data.numeroHabitacion);
            if (room) room.disponibilidad = false;

            this.renderHabitaciones();
            this.fetchHabitacionesDisponibles();
            this.updateDashboardStats();
        } catch (error) {
            this.showToast("Error al crear reserva. Verifique que la cédula y habitación existan.", "error");
            console.error(error);
        }
    }

    openEditReserva(reserva) {
        document.getElementById('edit-r-id').value = reserva.idReserva;
        document.getElementById('edit-r-cedula').value = reserva.cedula;
        document.getElementById('edit-r-habitacion').value = reserva.numeroHabitacion;
        document.getElementById('edit-r-llegada').value = reserva.fechaLlegada;
        document.getElementById('edit-r-salida').value = reserva.fechaSalida;
        document.getElementById('edit-r-cancelacion').value = reserva.tiempoCancelacion;

        this.openModal('modal-edit-reserva');
    }

    async handleUpdateReserva(event) {
        event.preventDefault();
        const id = document.getElementById('edit-r-id').value;
        const data = {
            cedula: document.getElementById('edit-r-cedula').value,
            numeroHabitacion: parseInt(document.getElementById('edit-r-habitacion').value),
            fechaLlegada: document.getElementById('edit-r-llegada').value,
            fechaSalida: document.getElementById('edit-r-salida').value,
            tiempoCancelacion: parseInt(document.getElementById('edit-r-cancelacion').value)
        };

        try {
            const response = await fetch(`/reservas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error updating reservation");

            this.showToast("¡Reserva actualizada correctamente!", "success");
            this.closeModal('modal-edit-reserva');

            const index = this.reservas.findIndex(r => r.idReserva == id);
            if (index !== -1) {
                this.reservas[index] = { ...this.reservas[index], ...data };
            }

            this.renderReservas();
        } catch (error) {
            this.showToast("Error al actualizar la reserva.", "error");
            console.error(error);
        }
    }

    async handleDeleteReserva(id) {
        if (!confirm(`Eliminar reserva #${id}?`)) return;
        try {
            const resp = await fetch(`/reservas/${id}`, { method: 'DELETE' });
            if (!resp.ok) {
                if (resp.status === 404) this.showToast('Reserva no encontrada', 'error');
                else throw new Error('No se pudo eliminar reserva');
                return;
            }
            this.showToast('Reserva eliminada', 'success');
            // Remove from local list and re-render
            this.reservas = this.reservas.filter(r => r.idReserva != id);
            this.renderReservas();
            this.fetchHabitaciones();
            this.fetchHabitacionesDisponibles();
            this.updateDashboardStats();
        } catch (err) {
            this.showToast('Error al eliminar reserva', 'error');
            console.error(err);
        }
    }

    // 4. REQUEST SERVICES ENDPOINT
    async handleCreateSolicitar(event) {
        event.preventDefault();
        const data = {
            nombre: document.getElementById('sol-nombre').value,
            fecha: document.getElementById('sol-fecha').value,
            hora: document.getElementById('sol-hora').value,
            idServicio: parseInt(document.getElementById('sol-idServicio').value),
            idReserva: parseInt(document.getElementById('sol-idReserva').value),
            cedula: document.getElementById('sol-cedula').value
        };

        try {
            const response = await fetch('/reservas/solicitar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error requesting service");

            this.showToast("¡Solicitud de servicio registrada con éxito!", "success");
            this.closeModal('modal-solicitar');
        } catch (error) {
            this.showToast("Error al solicitar servicio. Valide IDs.", "error");
            console.error(error);
        }
    }

    // 5. EMPLOYEES ENDPOINTS
    async fetchEmpleados(silent = false) {
        try {
            const [empRes, telRes] = await Promise.all([
                fetch('/empleados'),
                fetch('/empleados/telefonos')
            ]);

            if (empRes.ok) {
                this.empleados = await empRes.json();
            } else {
                this.empleados = [];
            }

            if (telRes.ok) {
                this.telefonosEmpleados = await telRes.json();
            } else {
                this.telefonosEmpleados = [];
            }

            this.renderEmpleados();
        } catch (error) {
            console.warn("Backend load employees deferred.");
            this.renderEmpleados();
        }
    }

    renderEmpleadoRow(e) {
        const empTelefonos = this.telefonosEmpleados
            .filter(tel => tel.cedula === e.cedula)
            .map(tel => `<span class="badge badge-success" style="display:block; margin-bottom:2px;">${tel.telefono}</span>`)
            .join('') || '-';

        return `
            <tr>
                <td><strong>${e.cedula}</strong></td>
                <td>${e.primerNombre} ${e.primerApellido}</td>
                <td><span class="badge badge-info">${e.cargo}</span></td>
                <td>Área ${e.area}</td>
                <td style="color: var(--success); font-weight: 500;">$${parseFloat(e.salario).toLocaleString()}</td>
                <td>${e.calle || '-'} / ${e.carrera || '-'}</td>
                <td>${e.numero || '-'}</td>
                <td>${e.complemento || '-'}</td>
                <td>${empTelefonos}</td>
                <td>
                    <button class="btn btn-secondary btn-icon" onclick="app.openEditEmpleado('${e.cedula}')">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" style="margin-left:0.5rem;" onclick="app.handleDeleteEmpleado('${e.cedula}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    renderEmpleados() {
        const tbody = document.getElementById('empleados-tbody');
        if (!tbody) return;

        if (this.empleados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-secondary);">No hay empleados registrados en el sistema.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.empleados.map(e => this.renderEmpleadoRow(e)).join('');
        lucide.createIcons();
    }

    filterEmpleados() {
        const q = document.getElementById('search-empleados').value.toLowerCase();
        const tbody = document.getElementById('empleados-tbody');
        if (!tbody) return;

        const filtered = this.empleados.filter(e =>
            e.cedula.toLowerCase().includes(q) ||
            e.primerNombre.toLowerCase().includes(q) ||
            e.primerApellido.toLowerCase().includes(q) ||
            e.cargo.toLowerCase().includes(q)
        );

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-secondary);">No se encontraron empleados coincidentes.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(e => this.renderEmpleadoRow(e)).join('');
        lucide.createIcons();
    }

    async handleCreateEmpleado(event) {
        event.preventDefault();
        const data = {
            cedula: document.getElementById('e-cedula').value,
            primerNombre: document.getElementById('e-primerNombre').value,
            segundoNombre: document.getElementById('e-segundoNombre').value || null,
            primerApellido: document.getElementById('e-primerApellido').value,
            segundoApellido: document.getElementById('e-segundoApellido').value || null,
            cargo: document.getElementById('e-cargo').value,
            area: parseInt(document.getElementById('e-area').value),
            salario: parseInt(document.getElementById('e-salario').value),
            calle: document.getElementById('e-calle').value || null,
            carrera: document.getElementById('e-carrera').value || null,
            numero: document.getElementById('e-numero').value || null,
            complemento: document.getElementById('e-complemento').value || null
        };

        const telefonoVal = document.getElementById('e-telefono').value.trim();

        try {
            const response = await fetch('/empleados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Could not create employee");

            let contactError = false;
            if (telefonoVal) {
                try {
                    const telResponse = await fetch('/empleados/telefonos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: {
                                cedula: data.cedula,
                                telefono: parseInt(telefonoVal, 10)
                            }
                        })
                    });
                    if (!telResponse.ok) contactError = true;
                } catch (err) {
                    contactError = true;
                }
            }

            if (contactError) {
                this.showToast("¡Empleado registrado, pero falló el registro del teléfono!", "warning");
            } else {
                this.showToast("¡Empleado registrado exitosamente!", "success");
            }

            this.closeModal('modal-empleado');
            this.fetchEmpleados();
        } catch (error) {
            this.showToast("Error al registrar empleado. Verifique área o cédula.", "error");
            console.error(error);
        }
    }

    openEditEmpleado(cedula) {
        const empleado = this.empleados.find(e => e.cedula === cedula);
        if (!empleado) {
            this.showToast('Empleado no encontrado', 'error');
            return;
        }
        document.getElementById('edit-e-cedula').value = empleado.cedula;
        document.getElementById('edit-e-primerNombre').value = empleado.primerNombre;
        document.getElementById('edit-e-segundoNombre').value = empleado.segundoNombre || '';
        document.getElementById('edit-e-primerApellido').value = empleado.primerApellido;
        document.getElementById('edit-e-segundoApellido').value = empleado.segundoApellido || '';
        document.getElementById('edit-e-cargo').value = empleado.cargo;
        document.getElementById('edit-e-area').value = empleado.area;
        document.getElementById('edit-e-salario').value = empleado.salario;
        document.getElementById('edit-e-calle').value = empleado.calle || '';
        document.getElementById('edit-e-carrera').value = empleado.carrera || '';
        document.getElementById('edit-e-numero').value = empleado.numero || '';
        document.getElementById('edit-e-complemento').value = empleado.complemento || '';
        this.openModal('modal-edit-empleado');
    }

    async handleUpdateEmpleado(event) {
        event.preventDefault();
        const cedula = document.getElementById('edit-e-cedula').value;
        const data = {
            cedula: cedula,
            primerNombre: document.getElementById('edit-e-primerNombre').value,
            segundoNombre: document.getElementById('edit-e-segundoNombre').value || null,
            primerApellido: document.getElementById('edit-e-primerApellido').value,
            segundoApellido: document.getElementById('edit-e-segundoApellido').value || null,
            cargo: document.getElementById('edit-e-cargo').value,
            area: parseInt(document.getElementById('edit-e-area').value),
            salario: parseInt(document.getElementById('edit-e-salario').value),
            calle: document.getElementById('edit-e-calle').value || null,
            carrera: document.getElementById('edit-e-carrera').value || null,
            numero: document.getElementById('edit-e-numero').value || null,
            complemento: document.getElementById('edit-e-complemento').value || null
        };

        try {
            const response = await fetch(`/empleados/${cedula}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('No se pudo actualizar el empleado');

            this.showToast('Empleado actualizado correctamente', 'success');
            this.closeModal('modal-edit-empleado');
            this.fetchEmpleados();
        } catch (error) {
            this.showToast('Error al actualizar el empleado', 'error');
            console.error(error);
        }
    }

    // 6. AREAS ENDPOINTS
    async handleCreateArea(event) {
        event.preventDefault();
        const data = {
            idArea: parseInt(document.getElementById('a-id').value),
            nombreArea: document.getElementById('a-nombre').value
        };

        try {
            const response = await fetch('/empleados/areas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error creating area");

            this.showToast("¡Área de trabajo creada con éxito!", "success");
            this.closeModal('modal-area');
        } catch (error) {
            this.showToast("Error al crear el área. Valide que el ID sea único.", "error");
            console.error(error);
        }
    }

    // 7. SERVICES ENDPOINTS
    async handleCreateServicio(event) {
        event.preventDefault();
        const data = {
            idServicio: parseInt(document.getElementById('s-id').value),
            nombreServicio: document.getElementById('s-nombre').value,
            descripcion: document.getElementById('s-descripcion').value || null,
            costo: 0.00
        };

        try {
            const response = await fetch('/empleados/servicios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error creating service");

            this.showToast("¡Servicio guardado exitosamente!", "success");
            this.closeModal('modal-servicio');
        } catch (error) {
            this.showToast("Error al guardar el servicio. Valide el ID.", "error");
            console.error(error);
        }
    }
}

// Instantiate App globally for easy button handler binding
const app = new HotelApp();
window.app = app;