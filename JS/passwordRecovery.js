document.addEventListener("DOMContentLoaded", function() {
    const passwordRecoveryForm = document.getElementById("passwordRecoveryForm");

    passwordRecoveryForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        setTimeout(function() {
            alert("Se ha enviado un correo electrónico con instrucciones para recuperar la contraseña.");
            window.location.href = "/HTML-Pages/login.html";
        }, 1000);
    });
});

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