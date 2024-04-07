document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector('#signupForm');
    signupForm.addEventListener('submit', handleFormSubmit);
});

const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = getDataSignupForm();
    const isValid = validateForm(formData);
    if (isValid) {
        registerUser(formData);
        window.location.href = '/HTML-Pages/login.html';
    }
};

const getDataSignupForm = () => {
    return {
        dni: document.getElementById("dni").value.trim(),
        name: document.getElementById("name").value.trim(),
        lastname: document.getElementById("lastname").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim()
    };
};

const validateForm = (formData) => {
    return (
        validateDni(formData.dni) &&
        validateName(formData.name) &&
        validateLastname(formData.lastname) &&
        validatePhone(formData.phone) &&
        validateEmail(formData.email) &&
        confirmPassword(formData.password, document.getElementById("confirmationPassword").value.trim())
    );
};

const registerUser = async (formData) => {
    const hashedPassword = await encryptPassword(formData.password);
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const isUserRegistered = users.find(user => user.dni === formData.dni);
    if (isUserRegistered) {
        alert('El usuario ya está registrado!');
    } else {
        const newUser = { ...formData, password: hashedPassword };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registro exitoso!');
    }
};

const manageSuccess = () => {
    alert("Inicio de sesión exitoso");
    limpiarCamposTexto();
};

const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll('#signupForm input[type="text"], #signupForm input[type="email"], #signupForm input[type="password"]');
    campos.forEach((campo) => campo.value = "");
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

// Validación del formato del número de teléfono
document.getElementById("phone").addEventListener("input", function (event) {
    var inputValue = event.target.value.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos

    // Insertar guion "-" automáticamente después del cuarto dígito
    var formattedValue;
    if (inputValue.length > 4) {
        formattedValue = inputValue.substring(0, 4) + '-' + inputValue.substring(4);
    } else {
        formattedValue = inputValue;
    }

    event.target.value = formattedValue;
});

// Validación de la confirmación de la contraseña
document.getElementById("confirmationPassword").addEventListener("input", function (event) {
    const password = document.getElementById("password").value.trim();
    const confirmationPassword = event.target.value.trim();
    if (confirmPassword(password, confirmationPassword)) {
        event.target.setCustomValidity("");
        event.target.classList.remove("error");
    } else {
        event.target.setCustomValidity("Las contraseñas no coinciden");
        event.target.classList.add("error");
    }
});


const validateDni = (dni) => {
    return /^\d{2}-\d{4}-\d{4}$/.test(dni);
}

const validateName = (name) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+(?:\s+[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+)*$/.test(name) && name.length <= 20;
}

const validateLastname = (lastname) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+(?:\s+[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+)*$/.test(lastname) && lastname.length <= 30;;
}

const validatePhone = (phone) => {
    return /^\d{4}-\d{4}$/.test(phone);
}

const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#]{8,11}$/.test(password);
};

const confirmPassword = (password, confirmationPassword) => { // confirmar contraseña
    return ((password === confirmationPassword) && validatePassword(password));
}

const encryptPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashedPassword;
};