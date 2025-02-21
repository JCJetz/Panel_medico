document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos
    const listaPacientesLink = document.getElementById('lista-pacientes');
    const patientsListContainer = document.querySelector('.patients-list-container');
    
    console.log('Link:', listaPacientesLink); // Para depuración
    console.log('Container:', patientsListContainer); // Para depuración
    
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
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const tableRows = document.querySelectorAll('.patients-table tbody tr');

    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.style.display = 'none';
    noResults.innerHTML = '<p>No se encontraron pacientes que coincidan con la búsqueda</p>';
    
    // Insertar después de la tabla
    document.querySelector('.patients-table').after(noResults);

    function filterPatients(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        let hasResults = false;
        
        tableRows.forEach(row => {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || id.includes(searchTerm)) {
                row.style.display = '';
                hasResults = true;
            } else {
                row.style.display = 'none';
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
    
    citasPendientesLink.addEventListener('click', function(e) {
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
        
        // Mostrar el perfil del doctor
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
        const rows = document.querySelectorAll('.patients-table tbody tr');
        let maxId = 0;
        rows.forEach(row => {
            const id = parseInt(row.querySelector('td:first-child').textContent.replace('#', ''));
            maxId = Math.max(maxId, id);
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
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    // Función para crear una nueva fila de paciente
    function createPatientRow(patientData) {
        const tr = document.createElement('tr');
        const today = new Date().toLocaleDateString('es-ES');
        
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
        e.preventDefault();
        
        // Recoger los datos del formulario
        const patientData = {
            id: getNextPatientId(),
            nombre: document.getElementById('nombre').value,
            edad: calculateAge(document.getElementById('fecha-nacimiento').value)
        };

        // Crear y agregar la nueva fila a la tabla
        const newRow = createPatientRow(patientData);
        const tableBody = document.querySelector('.patients-table tbody');
        tableBody.insertBefore(newRow, tableBody.firstChild);

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
        const patientCount = document.querySelectorAll('.patients-table tbody tr').length;
        const counterElement = document.querySelector('.patient-counter span');
        counterElement.textContent = `${patientCount} pacientes hoy`;
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

    // Permitir que el menú se vuelva a abrir al hacer hover
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            const dropdownContent = this.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.style.opacity = '1';
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
            prescriptionsContainer.classList.add('visible');
        }, 10);
    });

    // Agregar funcionalidad para Estadísticas
    const estadisticasLink = document.getElementById('estadisticas');
    const statisticsContainer = document.querySelector('.statistics-container');

    estadisticasLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllContainers();
        
        // Mostrar las estadísticas
        statisticsContainer.style.display = 'block';
        setTimeout(() => {
            statisticsContainer.classList.add('visible');
        }, 10);
    });

    // Actualizar la función hideAllContainers
    function hideAllContainers() {
        const containers = [
            patientsListContainer,
            pendingAppointmentsContainer,
            doctorProfileContainer,
            newPatientContainer,
            medicalHistoryContainer,
            labResultsContainer,
            diagnosticsContainer,
            prescriptionsContainer,
            statisticsContainer
        ];
        
        containers.forEach(container => {
            if (container) {
                container.style.display = 'none';
                container.classList.remove('visible');
            }
        });
    }

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
}); 