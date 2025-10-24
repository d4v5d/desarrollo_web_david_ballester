let portada = document.getElementById("info-portada");
if (portada) {
    portada.addEventListener("click", () => {
        window.location.href = "/";
    });
}

let tabla = document.getElementById("info-tabla");
if (tabla) {
    tabla.addEventListener("click", () => {
        window.location.href = "/listado";
    });
}