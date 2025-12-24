let formulario = document.getElementById("crear_aviso");
if (formulario) {
    formulario.addEventListener("click", () => {
        window.location.href = "/crear-aviso";
    });
}

let listado = document.getElementById("listado");
if (listado) {
    listado.addEventListener("click", () => {
        window.location.href = "/listado";
    });
}

let stats = document.getElementById("estadisticas");
if (stats) {
    stats.addEventListener("click", () => {
        window.location.href = "/estadisticas";
    });
}