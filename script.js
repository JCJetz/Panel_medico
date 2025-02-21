document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos
    const listaPacientesLink = document.getElementById('lista-pacientes');
    const patientsListContainer = document.querySelector('.patients-list-container');
    
    console.log('Link:', listaPacientesLink); 
    console.log('Container:', patientsListContainer); 
    
    // Ocultar la lista de pacientes inicialmente
    if (patientsListContainer) {
        patientsListContainer.style.display = 'none';
    }
    
    // Agregar evento de clic
    listaPacientesLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllContainers();
        
        // Mostrar la lista de pacientes
        if (patientsListContainer) {
            patientsListContainer.style.display = 'block';
            setTimeout(() => {
                patientsListContainer.classList.add('visible');
            }, 10);
        }
    });

    // Agregar funcionalidad de búsqueda
    const searchInput = document.querySelector('.search-bar input');//obtengo el input de la barra de busqueda
    const searchButton = document.querySelector('.search-bar button');
    const tableRows = document.querySelectorAll('.patients-table tbody tr');

    const noResults = document.createElement('div');//creo un div para mostrar el mensaje de no resultados
    noResults.className = 'no-results';//agrego la clase no-results al div
    noResults.style.display = 'none';//oculto el div
    noResults.innerHTML = '<p>No se encontraron pacientes que coincidan con la búsqueda</p>';//agrego el mensaje de no resultados al div
    
    
    document.querySelector('.patients-table').after(noResults);//agrego el div de no resultados despues de la tabla de pacientes

    //filtrar pacientes
    function filterPatients(searchTerm) { 
        searchTerm = searchTerm.toLowerCase(); 
        let hasResults = false; //inicializa el resultado en false
        
        tableRows.forEach(row => { //recorre todas las filas de la tabla
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase(); //obtengo nombre del paciente
            const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase(); //obteng id del paciente
            
            if (name.includes(searchTerm) || id.includes(searchTerm)) { //si el nombre o el id del paciente incluyen el termino de busqueda
                row.style.display = '';//muestro la fila
                hasResults = true;
            } else {
                row.style.display = 'none';//oculto la fila
            }
        });

        // Mostrar u ocultar el mensaje de "no hay resultados"
        noResults.style.display = hasResults ? 'none' : 'block';
    }

    // Buscar al escribir en el input
    searchInput.addEventListener('input', function() {
        filterPatients(this.value);
    });

    // Buscar al hacer clic en el botón
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        filterPatients(searchInput.value);
    });

    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterPatients(this.value);
        }
    });

    // Agregar funcionalidad para Citas Pendientes
    const citasPendientesLink = document.getElementById('citas-pendientes');
    const pendingAppointmentsContainer = document.querySelector('.pending-appointments-container');
    
    citasPendientesLink.addEventListener('click', function(e) {//agrego funcionalidad para citas pendientes
        e.preventDefault();
        hideAllContainers();
        
        // Mostrar las citas pendientes
        pendingAppointmentsContainer.style.display = 'block';
        setTimeout(() => {
            pendingAppointmentsContainer.classList.add('visible');
        }, 10);
    });

    // funcionalidad para Mi Perfil
    const miPerfilLink = document.getElementById('mi-perfil');
    const doctorProfileContainer = document.querySelector('.doctor-profile-container');

    miPerfilLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllContainers();
        
        //perfil del doctor
        doctorProfileContainer.style.display = 'block';
        setTimeout(() => {
            doctorProfileContainer.classList.add('visible');
        }, 10);
    });

    // Agregar funcionalidad para Nuevos Pacientes
    const nuevosPacientesLink = document.getElementById('nuevos-pacientes');
    const newPatientContainer = document.querySelector('.new-patient-container');
    const newPatientForm = document.querySelector('.new-patient-form');
    const cancelButton = newPatientForm.querySelector('.btn-secondary');

    nuevosPacientesLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllContainers();
        
        // Mostrar el formulario de nuevo paciente
        newPatientContainer.style.display = 'block';
        setTimeout(() => {
            newPatientContainer.classList.add('visible');
        }, 10);
    });

    // Función para generar el siguiente ID de paciente
    function getNextPatientId() {
        const rows = document.querySelectorAll('.patients-table tbody tr'); //obtengo todas las filas de la tabla
        let maxId = 0; //inicializo el maximo id en 0
        rows.forEach(row => { //recorro todas las filas
            const id = parseInt(row.querySelector('td:first-child').textContent.replace('#', '')); //obtengo el id de la fila
            maxId = Math.max(maxId, id); //actualizo el maximo id
        });
        return String(maxId + 1).padStart(3, '0');
    }

    /*Si la tabla tiene pacientes con IDs: #001, #002, #003
    maxId será 3
    maxId + 1 será 4
    .padStart(3, '0') convertirá "4" en "004"
    */


    // Función para calcular la edad a partir de la fecha de nacimiento
    function calculateAge(birthDate) {
        const today = new Date(); //obtengo la fecha actual
        const birth = new Date(birthDate); //obtengo la fecha de nacimiento
        let age = today.getFullYear() - birth.getFullYear(); //calculo la edad
        const monthDiff = today.getMonth() - birth.getMonth(); //calculo la diferencia de meses
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) { //si la diferencia de meses es menor a 0 o es 0 y la fecha actual es menor a la fecha de nacimiento
            age--; //resto 1 a la edad
        }
        return age; 
    }

    // nueva fila de paciente
    function createPatientRow(patientData) { //creo una nueva fila de paciente
        const tr = document.createElement('tr'); //creo un elemento tr
        const today = new Date().toLocaleDateString('es-ES'); //obtengo la fecha actual en formato local
        
        tr.innerHTML = `
            <td>#${patientData.id}</td>
            <td>${patientData.nombre}</td>
            <td>${patientData.edad}</td>
            <td>${today}</td>
            <td><span class="status active">Activo</span></td>
            <td>
                <button class="action-btn"><i class="fas fa-eye"></i></button>
                <button class="action-btn"><i class="fas fa-edit"></i></button>
                <button class="action-btn"><i class="fas fa-file-medical"></i></button>
            </td>
        `;
        return tr;
    }

    // Modificar el manejo del envío del formulario
    newPatientForm.addEventListener('submit', function(e) {
        e.preventDefault(); //evito que se recargue la pagina
        
        // Recoger los datos del formulario
        const patientData = {
            id: getNextPatientId(), //obtengo el siguiente id de paciente   
            nombre: document.getElementById('nombre').value, //obtengo el nombre del paciente
            edad: calculateAge(document.getElementById('fecha-nacimiento').value) //calculo la edad del paciente
        };

        // Crear y agregar la nueva fila a la tabla
        const newRow = createPatientRow(patientData); //creo la nueva fila
        const tableBody = document.querySelector('.patients-table tbody'); //obtengo el cuerpo de la tabla
        tableBody.insertBefore(newRow, tableBody.firstChild); //agrego la nueva fila al principio de la tabla

        // Actualizar el contador de pacientes
        updatePatientCounter();

        // Mostrar mensaje de éxito
        alert('Paciente registrado correctamente');
        
        // Limpiar el formulario y volver a la lista de pacientes
        this.reset();
        hideAllContainers();
        
        // Mostrar la lista de pacientes actualizada
        patientsListContainer.style.display = 'block';
        setTimeout(() => {
            patientsListContainer.classList.add('visible');
        }, 10);
    });

    // Función para actualizar el contador de pacientes
    function updatePatientCounter() {
        const patientCount = document.querySelectorAll('.patients-table tbody tr').length; //obtengo el numero de pacientes en la tabla 
        const counterElement = document.querySelector('.patient-counter span'); //obtengo el elemento span del contador de pacientes
        counterElement.textContent = `${patientCount} pacientes hoy`; //actualizo el texto del contador de pacientes
    }

    // Manejar el botón de cancelar
    cancelButton.addEventListener('click', function() {
        newPatientForm.reset();
        hideAllContainers();
    });

    // Agregar funcionalidad para Historial Médico
    const historialMedicoLink = document.getElementById('historial-medico');
    const medicalHistoryContainer = document.querySelector('.medical-history-container');

    historialMedicoLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllContainers();
        
        // Mostrar el historial médico
        medicalHistoryContainer.style.display = 'block';
        setTimeout(() => {
            medicalHistoryContainer.classList.add('visible');
        }, 10);
    });

    // Manejar el cierre y apertura del menú desplegable
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            const parentDropdown = dropdown.closest('.dropdown');
            if (!parentDropdown.contains(e.target)) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            }
        });
    });

    // Que el menú se vuelva a abrir al hacer hover, obtener todos los dropdowns, recorrerlos, agrego un evento mouseenter al dropdown
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            const dropdownContent = this.querySelector('.dropdown-content');//obtengo el contenido del dropdown
            if (dropdownContent) {
                dropdownContent.style.opacity = '1';//
                dropdownContent.style.visibility = 'visible';
            }
        });
    });

    // Agregar funcionalidad para Resultados de Laboratorio
    const resultadosLabLink = document.getElementById('resultados-lab');
    const labResultsContainer = document.querySelector('.lab-results-container');

    resultadosLabLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllContainers();
        
        // Mostrar los resultados de laboratorio
        labResultsContainer.style.display = 'block';
        setTimeout(() => {
            labResultsContainer.classList.add('visible');
        }, 10);
    });

    // Agregar funcionalidad para Diagnósticos
    const diagnosticosLink = document.getElementById('diagnosticos');
    const diagnosticsContainer = document.querySelector('.diagnostics-container');

    diagnosticosLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllContainers();
        
        // Mostrar los diagnósticos
        diagnosticsContainer.style.display = 'block';
        setTimeout(() => {
            diagnosticsContainer.classList.add('visible');
        }, 10);
    });

    // Agregar funcionalidad para Recetas
    const recetasLink = document.getElementById('recetas-link');
    const prescriptionsContainer = document.querySelector('.prescriptions-container');

    recetasLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllContainers();
        
        // Mostrar las recetas
        prescriptionsContainer.style.display = 'block';
        setTimeout(() => {
            prescriptionsContainer.classList.add('visible');//agrega la clase visible al contenedor de recetas
        }, 10);
    });

    // Agregar funcionalidad para Estadísticas
    const estadisticasLink = document.getElementById('estadisticas');  
    const statisticsContainer = document.querySelector('.statistics-container');

    estadisticasLink.addEventListener('click', function(e) { 
        e.preventDefault();//
        hideAllContainers();
        
        // Mostrar las estadísticas
        statisticsContainer.style.display = 'block'; 
        setTimeout(() => { 
            statisticsContainer.classList.add('visible'); 
        }, 10);
    });

    // Obtengo todos los contenedores principales      
    const containers = {
        dashboard: document.querySelector('.dashboard-container'),     
        patientsList: document.querySelector('.patients-list-container'),
        newPatient: document.querySelector('.new-patient-container'),
        pendingAppointments: document.querySelector('.pending-appointments-container'),
        medicalHistory: document.querySelector('.medical-history-container'),
        labResults: document.querySelector('.lab-results-container'),
        diagnostics: document.querySelector('.diagnostics-container'),
        prescriptions: document.querySelector('.prescriptions-container'),
        statistics: document.querySelector('.statistics-container'),
        doctorProfile: document.querySelector('.doctor-profile-container')
    };

    // Función para ocultar todos los contenedores
    function hideAllContainers() {
        Object.values(containers).forEach(container => {
            if (container) {
                container.style.display = 'none';
            }
        });
    }

    // Función para mostrar un contenedor específico
    function showContainer(containerId) {
        hideAllContainers();
        if (containers[containerId]) { 
            containers[containerId].style.display = 'block';
        }
    }

    // Manejadores de eventos para los elementos del menú
    document.addEventListener('DOMContentLoaded', () => {
        // Enlaces del menú de pacientes
        document.getElementById('lista-pacientes')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('patientsList');
        });

        document.getElementById('nuevos-pacientes')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('newPatient');
        });

        document.getElementById('citas-pendientes')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('pendingAppointments');
        });

        // Enlaces del menú de historiales
        document.getElementById('historial-medico')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('medicalHistory');
        });

        document.getElementById('resultados-lab')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('labResults');
        });

        document.getElementById('diagnosticos')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('diagnostics');
        });

        // Enlace de recetas
        document.getElementById('recetas-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('prescriptions');
        });

        // Enlaces del menú de perfil
        document.getElementById('mi-perfil')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('doctorProfile');
        });

        document.getElementById('estadisticas')?.addEventListener('click', (e) => {
            e.preventDefault();
            showContainer('statistics');
        });
    });

    // Mostrar el dashboard por defecto al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
        showContainer('dashboard');
    });

    // funcionalidad para exportar a PDF
    function generateLabPDF(resultCard) {
        // Crear una copia del resultado para el PDF
        const pdfContent = resultCard.cloneNode(true);
        
        // Remover los botones del footer para el PDF
        const footer = pdfContent.querySelector('.result-footer');
        if (footer) {
            footer.remove();
        }

        // Configuración del PDF
        const opt = {
            margin: 1,
            filename: 'resultado_laboratorio.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generar el PDF
        html2pdf().set(opt).from(pdfContent).save();
    }

    // Agregar event listeners a los botones de PDF
    const pdfButtons = document.querySelectorAll('.lab-result-card .btn-secondary');
    pdfButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const resultCard = this.closest('.lab-result-card');
            generateLabPDF(resultCard);
        });
    });

    // Funcionalidad para los botones de acción en la lista de pacientes
    document.querySelectorAll('.patients-table tbody tr').forEach(row => { //obtengo todas las filas de la tabla
        const actionButtons = row.querySelectorAll('.action-btn'); //obtengo todos los botones de acción de la fila
        
        // Botón Ver Detalles
        actionButtons[0].addEventListener('click', function() { //agrego un evento click al boton ver detalles
            const patientId = row.querySelector('td:first-child').textContent; //obtengo el id del paciente
            const patientName = row.querySelector('td:nth-child(2)').textContent; //obtengo el nombre del paciente
            
            // Crear modal para mostrar detalles
                const modalHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Detalles del Paciente</h3>
                            <button class="close-modal"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>ID:</strong> ${patientId}</p> 
                            <p><strong>Nombre:</strong> ${patientName}</p> 
                            <p><strong>Edad:</strong> ${row.querySelector('td:nth-child(3)').textContent}</p> 
                            <p><strong>Última Visita:</strong> ${row.querySelector('td:nth-child(4)').textContent}</p> 
                            <p><strong>Estado:</strong> ${row.querySelector('td:nth-child(5)').textContent}</p> 
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML); //agrego el modal al body
            
            // Cerrar modal
            document.querySelector('.close-modal').addEventListener('click', function() { //agrego un evento click al boton cerrar modal
                document.querySelector('.modal-overlay').remove(); //remuevo el modal del body!!
            });

            // Cerrar modal al hacer clic fuera
            document.querySelector('.modal-overlay').addEventListener('click', function(e) { //agrego un evento click al modal
                if (e.target === this) { //si el target es el modal
                    this.remove(); //remuevo el modal del body
                }
            });
        });
        
        // Botón Editar Paciente
        actionButtons[1].addEventListener('click', function() { //agrego un evento click al boton editar paciente           
            const patientId = row.querySelector('td:first-child').textContent; //obtengo el id del paciente
            const patientName = row.querySelector('td:nth-child(2)').textContent; //obtengo el nombre del paciente
            const currentStatus = row.querySelector('.status').classList[1]; //obtengo el estado del paciente
            
            // Crear formulario de edición
            const editFormHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Editar Paciente</h3>
                            <button class="close-modal"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="modal-body">
                            <form id="edit-patient-form">
                                <div class="form-group">
                                    <label>ID:</label>
                                    <input type="text" value="${patientId}" readonly> 
                                </div>
                                <div class="form-group">
                                    <label>Nombre:</label>
                                    <input type="text" value="${patientName}" id="edit-name" required> 
                                </div>
                                <div class="form-group">
                                    <label>Estado:</label>
                                    <select id="edit-status">
                                        <option value="active" ${currentStatus === 'active' ? 'selected' : ''}>Activo</option>
                                        <option value="pending" ${currentStatus === 'pending' ? 'selected' : ''}>Pendiente</option>
                                        <option value="inactive" ${currentStatus === 'inactive' ? 'selected' : ''}>Inactivo</option>
                                    </select>
                                </div>
                                <div class="form-buttons">
                                    <button type="button" class="btn-secondary close-modal">Cancelar</button>
                                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', editFormHTML); //agrego el formulario de edicion al body  
            
            // Manejar envío del formulario
            document.getElementById('edit-patient-form').addEventListener('submit', function(e) { //agrego un evento submit al formulario de edicion
                e.preventDefault(); //evito que se recargue la pagina
                
                // Actualizar datos en la tabla
                const newName = document.getElementById('edit-name').value; //obtengo el nuevo nombre del paciente
                const newStatus = document.getElementById('edit-status').value; //obtengo el nuevo estado del paciente
                
                row.querySelector('td:nth-child(2)').textContent = newName; //actualizo el nombre del paciente
                const statusCell = row.querySelector('td:nth-child(5)'); //obtengo la celda del estado del paciente
                statusCell.innerHTML = `<span class="status ${newStatus}">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span>`; //actualizo el estado del paciente
                
                // Cerrar modal
                document.querySelector('.modal-overlay').remove();
            });
            
            // Cerrar modal con botones y clic fuera
            document.querySelectorAll('.close-modal').forEach(btn => { //agrego un evento click a todos los botones cerrar modal
                btn.addEventListener('click', function() { //agrego un evento click al boton cerrar modal
                    document.querySelector('.modal-overlay').remove(); //remuevo el modal del body
                });
            });

            document.querySelector('.modal-overlay').addEventListener('click', function(e) { //agrego un evento click al modal      
                if (e.target === this) { //si el target es el modal
                    this.remove(); //remuevo el modal del body
                }
            });
        });
    });

    // Botón de emergencia
    const emergencyBtn = document.querySelector('.emergency-btn'); //

    emergencyBtn.addEventListener('click', function() {
        const emergencyModalHTML = `
            <div class="modal-overlay emergency-modal">
                <div class="modal-content">
                    <div class="modal-header emergency-header">
                        <h3><i class="fas fa-exclamation-triangle"></i> Contactos de Emergencia</h3>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="emergency-contacts">
                            <div class="emergency-contact">
                                <i class="fas fa-ambulance"></i>
                                <div class="contact-info">
                                    <h4>Ambulancia</h4>
                                    <a href="tel:911" class="emergency-phone">911</a>
                                </div>
                            </div>
                            
                            <div class="emergency-contact">
                                <i class="fas fa-hospital"></i>
                                <div class="contact-info">
                                    <h4>Hospital Central</h4>
                                    <a href="tel:+34600000000" class="emergency-phone">600 000 000</a>
                                    <p>Calle Hospital 123</p>
                                </div>
                            </div>

                            <div class="emergency-contact">
                                <i class="fas fa-user-md"></i>
                                <div class="contact-info">
                                    <h4>Dr. Lopez (Guardia)</h4>
                                    <a href="tel:+34600000001" class="emergency-phone">600 000 001</a>
                                </div>
                            </div>
                        </div>

                        <div class="emergency-actions">
                            <button class="call-emergency">
                                <i class="fas fa-phone"></i> Llamar a Emergencias
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', emergencyModalHTML);//agrego el modal de emergencia al body

        // Manejar llamada de emergencia
        document.querySelector('.call-emergency').addEventListener('click', function() {
            window.location.href = 'tel:911'; //llamo al numero de emergencia
        });

        // Cerrar modal
        document.querySelector('.close-modal').addEventListener('click', function() {
            document.querySelector('.emergency-modal').remove(); //remuevo el modal de emergencia del body
        });

        // Cerrar al hacer clic fuera
        document.querySelector('.emergency-modal').addEventListener('click', function(e) {
            if (e.target === this) { //si el target es el modal de emergencia
                this.remove(); //remuevo el modal de emergencia del body
            }
        });
    });
}); 