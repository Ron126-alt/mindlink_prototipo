document.addEventListener("DOMContentLoaded", () => {

  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const btn = document.getElementById("btnGuardar");
  const lista = document.getElementById("lista");

  let editandoId = null;

  async function cargar() {
    const res = await fetch("http://localhost:4000/admin");
    const data = await res.json();

    lista.innerHTML = "";

    data.forEach(a => {
      const div = document.createElement("div");

      div.innerHTML = `
        ${a.nombre} - ${a.email}
        <button onclick="editar(${a.id}, '${a.nombre}', '${a.email}')">✏️</button>
        <button onclick="eliminar(${a.id})">🗑️</button>
      `;

      lista.appendChild(div);
    });
  }

  btn.addEventListener("click", async () => {

    if (!nombre.value || !email.value || !password.value) {
      alert("Completa todo");
      return;
    }

    if (editandoId) {
      await fetch(`http://localhost:4000/admin/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.value,
          email: email.value,
          password: password.value
        })
      });
      editandoId = null;
    } else {
      await fetch("http://localhost:4000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.value,
          email: email.value,
          password: password.value
        })
      });
    }

    nombre.value = "";
    email.value = "";
    password.value = "";

    cargar();
  });

  window.eliminar = async (id) => {
    await fetch(`http://localhost:4000/admin/${id}`, {
      method: "DELETE"
    });
    cargar();
  };

  window.editar = (id, n, e) => {
    nombre.value = n;
    email.value = e;
    editandoId = id;
  };

  cargar();

});