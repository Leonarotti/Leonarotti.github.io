let failedLoginAttempts = 0;

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', handleFormSubmit);
});

const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (failedLoginAttempts >= 3) {
        alert('Has excedido el número máximo de intentos fallidos de inicio de sesión.');
        return;
    }
    const formData = getDataFormLogin();
    const isValid = validateForm(formData);
    if (isValid) {
        await loginUser(formData);
    }else{
        failedLoginAttempts++;
    }
    console.log(failedLoginAttempts);
};

const getDataFormLogin = () => {
    return {
        dni: document.getElementById("dni").value.trim(),
        password: document.getElementById("password").value.trim(),
    };
};

const validateForm = (formData) => {
    return (
        validateDni(formData.dni) &&
        validatePassword(formData.password)
    );
};

const loginUser = async (formData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.dni === formData.dni);
    if (!user) {
        return alert('Usuario no encontrado');
    }
    const isPasswordCorrect = await comparePasswords(formData.password, user.password);
    if (isPasswordCorrect) {
        alert(`Bienvenido ${user.name}`);
        localStorage.setItem('login_success', JSON.stringify(user));
        window.location.href = '/HTML-Pages/agenda.html';
    } else {
        failedLoginAttempts++;
        alert('Usuario y/o contraseña incorrectos');
    }
};

const validateDni = (dni) => {
    return /^\d{2}-\d{4}-\d{4}$/.test(dni);
}

const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#]{8,11}$/.test(password);
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

// Función para comparar el password encriptado con el password original
const comparePasswords = async (password, hashedPassword) => {
    const hashedInput = await encryptPassword(password);
    return hashedInput === hashedPassword;
};

const encryptPassword = async (password) => {
    const crypto = window.crypto.subtle;
    const encoder = new TextEncoder();
    const hash = await crypto.digest('SHA-256', encoder.encode(password));
    return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
};
