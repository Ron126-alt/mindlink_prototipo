document.getElementById('btnRegister').addEventListener('click', async () => {

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const dob = document.getElementById('dob').value;
  const email = document.getElementById('email').value.trim().toLowerCase();
  const pass = document.getElementById('password').value;
  const pass2 = document.getElementById('password2').value;
  const msg = document.getElementById('register-msg');

  msg.textContent = '';

  // VALIDACIONES
  if (!firstName || !lastName || !dob || !email || !pass || !pass2) {
    msg.textContent = 'Completa todos los campos';
    return;
  }

  if (!email.includes('@')) {
    msg.textContent = 'Correo inválido';
    return;
  }

  if (pass.length < 6) {
    msg.textContent = 'Contraseña mínima 6 caracteres';
    return;
  }

  if (pass !== pass2) {
    msg.textContent = 'Contraseñas no coinciden';
    return;
  }

  // ENVÍO AL SERVIDOR
  try {

    const response = await fetch("http://localhost:4000/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: pass
      })
    });

    const data = await response.json();

    if (!response.ok) {
      msg.textContent = data.error || "Error al registrar usuario";
      return;
    }

    msg.textContent = 'Registro exitoso. Redirigiendo al inicio...';
    msg.classList.add('success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);

  } catch (error) {
    console.error(error);
    msg.textContent = "Error al conectar con el servidor";
  }

});