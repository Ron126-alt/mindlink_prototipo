document.addEventListener("DOMContentLoaded", () => {

  let navbarContainer = document.getElementById("navbar-container");

  if (!navbarContainer) {
    navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";
    document.body.prepend(navbarContainer);
  }

  navbarContainer.innerHTML = `
    <div class="menu">
      <div class="menu-left">
        <span class="logo">MindLink</span>
        <button class="menu-toggle" id="menuToggle">☰</button>
      </div>

      <div class="menu-right" id="menuRight">
        <a href="dashboard.html">Dashboard</a>
        <a href="emociones.html">Mis emociones</a>
        <a href="notificaciones.html">
          Notificaciones 
          <span id="notifBadge" class="notif-badge">0</span>
        </a>
        <a href="recomendaciones.html">Recomendaciones</a>
        <a href="contenido.html">Contenido</a>
        <a href="usuario.html">Usuario</a>
        <a href="administracion.html">Administración</a>

        <span class="user-name" id="navUserName"></span>
        <button class="btn-logout" id="logoutBtn">Cerrar sesión</button>
      </div>
    </div>
  `;

  let userData = null;

  try {
    const raw = localStorage.getItem("usuarioActivo");
    if (raw) userData = JSON.parse(raw);
  } catch (e) {
    console.warn("usuarioActivo inválido", e);
  }

  const path = window.location.pathname.split("/").pop();
  const paginasPublicas = ["index.html", "registro.html"];

  if (!userData && !paginasPublicas.includes(path)) {
    window.location.href = "index.html";
    return;
  }

  if (userData) {
    const navUserName = document.getElementById("navUserName");
    if (navUserName) {
      navUserName.textContent = userData.nombre;
    }
  }
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "index.html";
    });
  }

  const menuToggle = document.getElementById("menuToggle");
  const menuRight = document.getElementById("menuRight");

  if (menuToggle && menuRight) {
    menuToggle.addEventListener("click", () => {
      menuRight.classList.toggle("active");
    });
  }

  const badge = document.getElementById("notifBadge");

  if (badge) {
    const num = localStorage.getItem("notifCount") || 0;
    badge.textContent = num;
  }

});