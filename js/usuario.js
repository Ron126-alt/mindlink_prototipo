document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuarioActivo) {
        window.location.href = 'index.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('mindlink_users') || '[]');
    const currentUser = users.find(u => u.email === usuarioActivo.email);

    if (!currentUser) return;

    const perfilInfo = document.getElementById('perfil-info');
    perfilInfo.innerHTML = `
        <p><strong>Nombre:</strong> ${currentUser.firstName} ${currentUser.lastName}</p>
        <p><strong>Correo:</strong> ${currentUser.email}</p>
        <p><strong>Fecha de nacimiento:</strong> ${currentUser.dob}</p>
        <p><strong>Rol:</strong> ${currentUser.rol}</p>
        <p><strong>Emociones registradas:</strong> ${currentUser.emotions.length}</p>
    `;
});
