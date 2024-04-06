document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', loginUser);
});

const loginUser = () => {
    getMedics()
        .then(medicos => {
            const medico = medicos.find(medico => medico.dni === document.getElementById("dni").value);
            if (!medico) {
                return alert('Medico no encontrado');
            }
            const isPasswordCorrect = (document.getElementById("password").value == "123") ? true : false;
            if (isPasswordCorrect) {
                alert(`Bienvenido ${medico.nombre}`);
                localStorage.setItem('login_success', JSON.stringify(medico));
                window.location.href = '/HTML-Pages/agenda.html';
            } else {
                alert('Usuario y/o contraseña incorrectos');
            }
        })
        .catch(error => {
            console.error(error);
        });
};

// Validación del formato de la cédula
document.getElementById("dni").addEventListener("input", function (event) {
    var inputValue = event.target.value.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos

    // Formatear número de cédula con guiones
    var formattedValue = inputValue.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/, function (match, p1, p2, p3) {
        var parts = [p1, p2, p3].filter(Boolean); // Filtrar partes vacías
        return parts.join('-');
    });

    event.target.value = formattedValue;
});

// Autocompletar el "0" al inicio de la cédula
document.getElementById("dni").addEventListener("keypress", function (event) {
    if (event.target.value === "") {
        event.target.value = "0";
    }
});