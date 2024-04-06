const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const resultsContainer = document.querySelector('#results-container');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('.modal-content');
const orderBySelect = document.querySelector('#order-by-select');
const resultadosPorPagina = 5; // Número de resultados por página
let paginaActual = 1;

// Función para cerrar el modal
function closeModal() {
    modal.style.display = 'none'; // Ocultar el modal al hacer clic en la X
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Eventos búsqueda
searchBtn.addEventListener('click', () => {
    paginaActual = 1; // Resetear a la página 1 al realizar una nueva búsqueda
    const criterioOrdenacion = orderBySelect.value;
    realizarBusquedaConOrdenacion(criterioOrdenacion);
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evitar que se envíe el formulario si está dentro de un formulario
        paginaActual = 1;
        const criterioOrdenacion = orderBySelect.value;
        realizarBusquedaConOrdenacion(criterioOrdenacion);
    }
});

// Función para realizar la búsqueda con el criterio de ordenación seleccionado
function realizarBusquedaConOrdenacion(criterioOrdenacion) {
    const searchTerm = searchInput.value.toLowerCase();
    getMedics()
        .then(medics => {
            const filteredmedics = medics.filter(medico => {
                return medico.nombre.toLowerCase().includes(searchTerm) ||
                    medico.especialidad.toLowerCase().includes(searchTerm) ||
                    medico.ubicacion.toLowerCase().includes(searchTerm);
            });
            const totalPaginas = calcularTotalPaginas(filteredmedics);
            const medicsOrdenados = ordenarmedics(criterioOrdenacion, filteredmedics);
            mostrarResultadosEnPagina(medicsOrdenados, paginaActual, totalPaginas);
        })
        .catch(error => console.error(error)); // Manejar errores de la promesa
}

// Función para calcular el número total de páginas
function calcularTotalPaginas(resultados) {
    return Math.ceil(resultados.length / resultadosPorPagina);
}

// Mostrar resultados de una página específica
function mostrarResultadosEnPagina(resultados, pagina, totalPaginas) {
    const inicio = (pagina - 1) * resultadosPorPagina;
    const fin = inicio + resultadosPorPagina;
    const resultadosPagina = resultados.slice(inicio, fin);
    mostrarResultados(resultadosPagina);
    mostrarBotonesPaginacion(resultados, totalPaginas);
}

// Mostrar los resultados de búsqueda
function mostrarResultados(results) {
    resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

    results.forEach((medico) => {
        const resultElement = document.createElement('div');
        resultElement.classList.add('result');
        resultElement.innerHTML = `<h3>${medico.nombre}</h3>
                                    <p><strong>Especialidad:</strong> ${medico.especialidad}</p>
                                    <p><strong>Ubicación:</strong> ${medico.ubicacion}</p>
                                    <p><strong>Calificación:</strong> ${medico.calificacion}</p>
                                    <p><strong>Horario: ...</strong></p>`;

        resultElement.addEventListener('click', () => {
            // Mostrar los detalles del médico en el modal
            modalContent.innerHTML = `<span class="close" onclick="closeModal();">&times;</span><h2>${medico.nombre}</h2>
                                      <p><strong>Especialidad:</strong> ${medico.especialidad}</p>
                                      <p><strong>Ubicación:</strong> ${medico.ubicacion}</p>
                                      <p><strong>Teléfono:</strong> ${medico.telefono}</p>
                                      <p><strong>Correo electrónico:</strong> ${medico.correo}</p>
                                      <p><strong>Calificación:</strong> ${medico.calificacion}</p>
                                      <p><strong>Biografía:</strong> ${medico.bio}</p>
                                      <p><strong>Horario:</strong></p>
                                      <ul>
                                          ${Object.entries(medico.horario).map(([dia, horario]) => `
                                              <li><strong>${dia}:</strong> ${horario.inicio} - ${horario.fin}</li>
                                          `).join('')}
                                      </ul>`;
            modal.style.display = 'block'; // Mostrar el modal
        });

        resultsContainer.appendChild(resultElement);
    });
}


// Función para mostrar los controles de paginación
function mostrarBotonesPaginacion(resultados, totalPaginas) {
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination');

    for (let i = 1; i <= totalPaginas; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        if (i === paginaActual) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            paginaActual = i;
            mostrarResultadosEnPagina(resultados, paginaActual, totalPaginas);
        });
        paginationContainer.appendChild(pageLink);
    }

    resultsContainer.appendChild(paginationContainer);
}


// Función para ordenar los resultados según el criterio seleccionado
function ordenarmedics(criterio, medics) {
    switch (criterio) {
        case 'nombre':
            return medics.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
        case 'especialidad':
            return medics.slice().sort((a, b) => a.especialidad.localeCompare(b.especialidad));
        case 'ubicacion':
            return medics.slice().sort((a, b) => a.ubicacion.localeCompare(b.ubicacion));
        case 'calificacion':
            return medics.slice().sort((a, b) => b.calificacion - a.calificacion);
        default:
            return medics;
    }
}

// Evento de cambio en el menú desplegable
orderBySelect.addEventListener('change', () => {
    const criterioOrdenacion = orderBySelect.value;
    realizarBusquedaConOrdenacion(criterioOrdenacion);
});

