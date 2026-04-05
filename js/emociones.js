document.addEventListener("DOMContentLoaded", () => {

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
        window.location.href = "index.html";
        return;
    }

    const list = document.getElementById("emotions-list");
    const filter = document.getElementById("filter-mood");
    const btnSave = document.getElementById("btnSave");
    const moodSelect = document.getElementById("mood-select");
    const moodNote = document.getElementById("mood-note");

    let editandoId = null;


    async function obtenerEmociones() {
        const res = await fetch("http://localhost:4000/emocion");
        return await res.json();
    }


    btnSave.addEventListener("click", async () => {

        const mood = moodSelect.value;
        const note = moodNote.value.trim();

        if (!mood) {
            alert("Selecciona un estado");
            return;
        }

        const fecha = new Date().toISOString().split("T")[0];

        if (editandoId) {

            await fetch(`http://localhost:4000/emocion/${editandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    estado: mood,
                    nota: note
                })
            });

            editandoId = null;
            btnSave.textContent = "Guardar";

        } else {

            await fetch("http://localhost:4000/emocion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fecha,
                    estado: mood,
                    nota: note,
                    usuario_id: usuarioActivo.id
                })
            });
        }

        moodSelect.value = "";
        moodNote.value = "";

        renderList();
    });

    async function eliminarEmocion(id) {
        await fetch(`http://localhost:4000/emocion/${id}`, {
            method: "DELETE"
        });
        renderList();
    }

    async function editarEmocion(id, estado, nota) {
        moodSelect.value = estado;
        moodNote.value = nota || "";

        editandoId = id;
        btnSave.textContent = "Actualizar";
    }

    async function renderList() {

        const selected = filter.value;
        const emociones = await obtenerEmociones();

        const filtradas = emociones
            .filter(e => e.usuario_id === usuarioActivo.id)
            .filter(e => selected ? e.estado === selected : true);

        list.innerHTML = "";

        if (filtradas.length === 0) {
            list.innerHTML = "<p>No hay registros</p>";
            return;
        }

        filtradas.forEach(e => {

            const div = document.createElement("div");
            div.className = "history-item";

            div.innerHTML = `
                <strong>${e.fecha}</strong> — ${e.estado}
                ${e.nota ? "| " + e.nota : ""}
                <br>
                <button onclick="editar(${e.id}, '${e.estado}', '${e.nota || ""}')">✏️ Editar</button>
                <button onclick="eliminar(${e.id})">🗑️ Eliminar</button>
            `;

            list.appendChild(div);
        });
    }

    window.eliminar = eliminarEmocion;
    window.editar = editarEmocion;

    filter.addEventListener("change", renderList);

    renderList();

});