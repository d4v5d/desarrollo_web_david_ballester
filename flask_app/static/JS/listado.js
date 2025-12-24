// Botón para volver a la portada
let portada = document.getElementById("listado-portada");
if (portada) {
    portada.addEventListener("click", () => {
        window.location.href = "/";
    });
}

// Funcionalidad del modal para agrandar imágenes
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.getElementsByClassName("close")[0];

// Agregar event listener a todas las imágenes de la tabla
const imagenes = document.querySelectorAll("#tabla-interactiva img");
imagenes.forEach(img => {
    img.addEventListener("click", (e) => {
        e.stopPropagation(); // Evitar que se active el click de la tabla
        modal.style.display = "block";
        modalImg.src = img.src;
    });
});

// Cerrar modal al hacer clic en la X
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

// Cerrar modal al hacer clic fuera de la imagen
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}