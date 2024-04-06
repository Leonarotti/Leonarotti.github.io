const header = document.querySelector("header");
const footer = document.querySelector("footer");
const user = JSON.parse(localStorage.getItem('login_success')) || false;

header.innerHTML = `<div class="content">
<div class="menu container">
    <a href="/index.html" class="logo">
        Clínica Árbol de Seda
    </a>
    <input type="checkbox" id="menu">
    <label for="menu">
        <img class="menu-icono" src="/assets/menu.svg" alt="menu">
    </label>
    <nav class="navbar">
        <ul>
            <li><a href="/index.html">Inicio</a></li>
            <li><a href="/HTML-Pages/agenda.html">Agenda de citas</a></li>
            <li><a href="/HTML-Pages/medics.html">Médicos</a></li>
            <li><a href="/HTML-Pages/nosotros.html">Sobre nosotros</a></li>
            <li><a href="/HTML-Pages/servicios.html">Servicios</a></li>
            <li><a id="login" class="btn-login" href="/HTML-Pages/login.html">Iniciar Sesión</a></li>
            <li><button id="logout" class="btn-login" onclick="logout()">Cerrar Sesión</button></li>
        </ul>
    </nav>
</div>
</div>`;

footer.innerHTML = `<p>&copy; 2024 Clínica Árbol de Seda - Derechos reservados</p>
<a href="/HTML-Pages/faq.html">Preguntas frecuentes</a>
<p class="hid">|</p>
<a href="/HTML-Pages/contacto.html">Contacto</a>
<p class="hid">|</p>
<a href="/HTML-Pages/politicas.html">Política de privacidad & Términos de uso</a>
`;

if (user) {
    document.getElementById('login').style.display = 'none'
    document.getElementById('logout').style.display = 'block'
}

const logout = () => {
    alert('Hasta pronto!');
    localStorage.removeItem('login_success');
    document.getElementById('logout').style.display = 'none'
    window.location.href = '/index.html';
};
