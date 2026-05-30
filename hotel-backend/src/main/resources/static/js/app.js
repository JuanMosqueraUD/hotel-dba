/**
 * Hotel Imperial Management SPA Engine
 */

class HotelApp {
    constructor() {
        this.activeView = 'dashboard';

        // Cache arrays for client-side search/filtering
        this.clientes = [];
        this.habitaciones = [];
        this.reservas = [];
        this.empleados = [];

        // Init SPA when document loads
        document.addEventListener('DOMContentLoaded', () => this.init());
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
            const response = await fetch('/clientes');
            if (!response.ok) throw new Error("Server error");
            this.clientes = await response.json();
            this.renderClientes();
            this.renderDashboardClientes();
        } catch (error) {
            if (!silent) this.showToast("No se pudo cargar clientes desde el backend", "error");
            console.error(error);
        }
    }

    renderClientes() {
        const tbody = document.getElementById('clientes-tbody');
        if (!tbody) return;

        if (this.clientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-secondary);">No hay clientes registrados.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.clientes.map(c => `
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
            </tr>
        `).join('');
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
            tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-secondary);">No se encontraron clientes coincidentes.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(c => `
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
            </tr>
        `).join('');
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

        try {
            const response = await fetch('/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });

            if (!response.ok) throw new Error("Could not create client");

            this.showToast("¡Cliente registrado exitosamente!", "success");
            this.closeModal('modal-cliente');
            this.fetchClientes();
        } catch (error) {
            this.showToast("Error al registrar cliente. Verifique la cédula.", "error");
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
                // If endpoint doesn't exist, we fallback safely to show an empty array
                this.habitaciones = [];
            }
            this.renderHabitaciones();
        } catch (error) {
            // Safe fallback if endpoint is not built yet
            console.warn("Using local display. Endpoints can be verified.");
            this.renderHabitaciones();
        }
    }

    renderHabitaciones() {
        const tbody = document.querySelector('#habitaciones-view #habitaciones-tbody');
        if (!tbody) return;

        if (this.habitaciones.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No hay habitaciones registradas en el sistema. Use el botón superior para agregar.</td></tr>`;
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

            // Populate search result container
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

            // Append or refresh
            if (!this.habitaciones.some(h => h.numeroHabitacion === data.numeroHabitacion)) {
                this.habitaciones.push(data);
            }
            this.renderHabitaciones();
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
                    <button class="btn btn-secondary btn-icon" style="color: var(--primary);" onclick="app.openEditReserva(${JSON.stringify(r).replace(/"/g, '&quot;')})">
                        <i data-lucide="edit-3"></i>
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

            // Add to cache & update
            this.reservas.push(savedReserva);
            this.renderReservas();

            // Mark room occupied in UI cache if match
            const room = this.habitaciones.find(h => h.numeroHabitacion === data.numeroHabitacion);
            if (room) room.disponibilidad = false;

            this.renderHabitaciones();
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

            // Update in cache
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

    // 4. REQUEST SERVICES ENDPOINT
    async handleCreateSolicitar(event) {
        event.preventDefault();
        const today = new Date();
        const data = {
            nombre: `Solicitud_${today.getTime()}`,
            fecha: document.getElementById('sol-fecha').value,
            hora: today.toTimeString().split(' ')[0], // Dynamic current time format HH:MM:SS
            idServicio: parseInt(document.getElementById('sol-idServicio').value),
            idReserva: parseInt(document.getElementById('sol-idReserva').value),
            cedula: document.getElementById('clientes-tbody').rows[0]?.cells[0]?.innerText || '102030' // Fallback helper
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
            const response = await fetch('/empleados');
            if (response.ok) {
                this.empleados = await response.json();
            } else {
                this.empleados = [];
            }
            this.renderEmpleados();
        } catch (error) {
            console.warn("Backend load employees deferred.");
            this.renderEmpleados();
        }
    }

    renderEmpleados() {
        const tbody = document.getElementById('empleados-tbody');
        if (!tbody) return;

        if (this.empleados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary);">No hay empleados registrados en el sistema.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.empleados.map(e => `
            <tr>
                <td><strong>${e.cedula}</strong></td>
                <td>${e.primerNombre} ${e.primerApellido}</td>
                <td><span class="badge badge-info">${e.cargo}</span></td>
                <td>Área ${e.area}</td>
                <td style="color: var(--success); font-weight: 500;">$${parseFloat(e.salario).toLocaleString()}</td>
                <td>${e.calle || '-'} / ${e.carrera || '-'}</td>
                <td>${e.numero || '-'}</td>
                <td>${e.complemento || '-'}</td>
            </tr>
        `).join('');
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
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary);">No se encontraron empleados coincidentes.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(e => `
            <tr>
                <td><strong>${e.cedula}</strong></td>
                <td>${e.primerNombre} ${e.primerApellido}</td>
                <td><span class="badge badge-info">${e.cargo}</span></td>
                <td>Área ${e.area}</td>
                <td style="color: var(--success); font-weight: 500;">$${parseFloat(e.salario).toLocaleString()}</td>
                <td>${e.calle || '-'} / ${e.carrera || '-'}</td>
                <td>${e.numero || '-'}</td>
                <td>${e.complemento || '-'}</td>
            </tr>
        `).join('');
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

        try {
            const response = await fetch('/empleados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Could not create employee");

            this.showToast("¡Empleado registrado exitosamente!", "success");
            this.closeModal('modal-empleado');

            this.empleados.push(data);
            this.renderEmpleados();
        } catch (error) {
            this.showToast("Error al registrar empleado. Verifique área o cédula.", "error");
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
            costo: 0.00 // Default or can be dynamic
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
