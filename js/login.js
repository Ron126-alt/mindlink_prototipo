document.getElementById("btnLogin").addEventListener("click", async () => {

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;
  const msg = document.getElementById("login-msg");

  msg.textContent = "";

  if (!email || !password) {
    msg.textContent = "Completa todos los campos";
    return;
  }

  try {

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      msg.textContent = data.error || "Error al iniciar sesión";
      return;
    }

    const usuarioActivo = {
      id: data.user.id,
      nombre: data.user.nombre,
      email: data.user.email
    };

    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));

    msg.textContent = "Inicio de sesión correcto";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);

  } catch (error) {

    console.error(error);
    msg.textContent = "No se pudo conectar con el servidor";

  }

});
