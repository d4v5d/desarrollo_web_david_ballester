// Función que actualiza el select de comunas según la región seleccionada
const updateComunas = async () => {
    let regionSelect = document.getElementById("select-region");
    let comunaSelect = document.getElementById("select-comuna");
    let selectedRegion = regionSelect.value;
    
    // Reinicia el select con la opción por defecto
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    
    if (selectedRegion) {
        try {
            // Hacer petición AJAX a la API de Flask
            const response = await fetch(`/api/comunas/${selectedRegion}`);
            const data = await response.json();
            
            // Cargar comunas en el select
            data.comunas.forEach(comuna => {
                let option = document.createElement("option");
                option.value = comuna.id;
                option.text = comuna.nombre;
                comunaSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar comunas:', error);
        }
    }
};

/**
 * Función que actualiza dinámicamente inputs de contacto según las opciones seleccionadas.
 */
function changeContactos() {
    const select = document.getElementById("select-contacto");
    const inputsContacto = document.getElementById("inputs-contacto");
    const selected = Array.from(select.selectedOptions);
    
    if (selected.length === 0) {
        inputsContacto.innerHTML = "";
        return;
    }

    if (selected.length <= 5) {
        inputsContacto.innerHTML = "";
        selected.forEach(option => {
            const label = document.createElement("label");
            label.textContent = `${option.value}`;
            label.classList.add("contact-input");

            const input = document.createElement("input");
            input.type = "text";
            input.minLength = "4";
            input.maxLength = "50";
            input.name = `contacto-${option.value}`;
            input.required = true;
            input.placeholder = `Ingresa tu ${option.value}`;

            const div = document.createElement("div");
            div.appendChild(label);
            div.appendChild(input);

            inputsContacto.appendChild(div);
        });
    }
}

// Inputs de fotos
const foto1 = document.getElementById("foto1");
const foto2 = document.getElementById("foto2");
const foto3 = document.getElementById("foto3");
const foto4 = document.getElementById("foto4");
const foto5 = document.getElementById("foto5");

/**
 * Función que muestra el siguiente input de foto solo si el anterior ya tiene un archivo cargado.
 */
function mostrarSiguienteInput(actual, siguiente) {
    actual.addEventListener('change', () => {
        if (actual.files.length > 0) {
            siguiente.hidden = false;
        }
    });
}

mostrarSiguienteInput(foto1, foto2);
mostrarSiguienteInput(foto2, foto3);
mostrarSiguienteInput(foto3, foto4);
mostrarSiguienteInput(foto4, foto5);

// Configuración de fecha por defecto
let fechaAMostrar = new Date();
fechaAMostrar.setHours(fechaAMostrar.getHours() + 1);
const formattedDate = fechaAMostrar.toISOString().slice(0, 16);
document.getElementById("entrega").value = formattedDate;

// Listeners
document.getElementById("select-region").addEventListener("change", updateComunas);
document.getElementById("select-contacto").addEventListener("change", changeContactos);

// Inicializar al cargar la página
window.onload = () => {
    changeContactos();
};