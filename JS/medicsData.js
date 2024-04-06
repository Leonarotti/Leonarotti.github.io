const getMedics = () => {
    return fetch('/utility/medics.json') // Cargar archivo JSON
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            return response.json(); // Convertir respuesta a JSON
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
            return []; // array vacío en caso de error
        });
}

const getMedicByDni = (dni) => {
    return getMedics()
        .then(medics => {
            const medico = medics.find(medico => medico.dni === dni);
            if (medico) {
                return medico;
            } else {
                throw new Error('Médico no encontrado');
            }
        });
};