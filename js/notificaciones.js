document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        window.location.href = "index.html";
        return;
    }

    const users = JSON.parse(localStorage.getItem("mindlink_users") || "[]");
    const user = users.find(u => u.email === usuarioActivo.email);

    const list = document.getElementById("notificaciones-list");
    if (!list) return;

    if (!user || !user.notifications || user.notifications.length === 0) {
        list.innerHTML = `<li>No hay notificaciones nuevas.</li>`;
        actualizarBadge(0);
        return;
    }

    list.innerHTML = "";

    user.notifications.slice().reverse().forEach((notif, index) => {
        const li = document.createElement("li");
        li.className = "history-item";
        li.style.cursor = "pointer";
        li.style.borderLeft = notif.read ? "5px solid #ccc" : "5px solid #E04B4B";
        
        li.innerHTML = `
            <strong>${notif.date}</strong><br>
            ${notif.text}
            <br>
            <small style="color:${notif.read ? "#0A8F6E" : "#E04B4B"};">
                ${notif.read ? "Leída" : "No leída"}
            </small>
        `;

        li.addEventListener("click", () => {
            notif.read = true;
            localStorage.setItem("mindlink_users", JSON.stringify(users));
            cargarNotificaciones();
        });

        list.appendChild(li);
    });

    const noLeidas = user.notifications.filter(n => !n.read).length;
    actualizarBadge(noLeidas);
});

function cargarNotificaciones() {
    location.reload();
}

function actualizarBadge(num) {
    localStorage.setItem("notifCount", num);
    const badge = document.getElementById("notifBadge");
    if (badge) badge.textContent = num;
}
