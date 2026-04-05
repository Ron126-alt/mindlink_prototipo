document.addEventListener("DOMContentLoaded", async () => {

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
        window.location.href = "index.html";
        return;
    }

    const chartCanvas = document.getElementById("emocionesChart");

    let chartInstance = null;

    async function obtenerEmociones() {
        try {
            const res = await fetch("http://localhost:4000/emocion");
            return await res.json();
        } catch (error) {
            console.error("Error:", error);
            return [];
        }
    }

    async function renderChart() {

        const emociones = await obtenerEmociones();

        const filtradas = emociones.filter(e => e.usuario_id === usuarioActivo.id);

        if (filtradas.length === 0) {
            console.log("No hay emociones para mostrar");
            return;
        }

        const conteo = {};

        filtradas.forEach(e => {
            conteo[e.estado] = (conteo[e.estado] || 0) + 1;
        });

        const labels = Object.keys(conteo);
        const data = Object.values(conteo);

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Mis emociones",
                    data: data,
                    backgroundColor: [
                        "#2E86C1",
                        "#E04B4B",
                        "#0A8F6E",
                        "#F4D03F",
                        "#A569BD"
                    ]
                }]
            }
        });
    }

    renderChart();

});