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
