let portada = document.getElementById("listado-portada");
portada.addEventListener("click", () => {
    window.location.href = "../HTML/portada.html"
});

let tabla = document.getElementById("tabla-interactiva");

// Click en la tabla para ir a detalles (pero NO en las imágenes)
tabla.addEventListener("click", (e) => {
    // Si NO se hizo click en una imagen, redirigir a detalles
    if (!e.target.closest('img')) {
        window.location.href = "../HTML/detalles_listado.html"
    }
});

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
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Cerrar modal al hacer clic fuera de la imagen
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});