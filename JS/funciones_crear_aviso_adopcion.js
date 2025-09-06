// Objeto que contiene todas las regiones de Chile como claves,
// y dentro de cada una un arreglo con sus comunas correspondientes.
const regiones_comunas = {
    "1 - Región de Tarapacá": ["Camiña", "Huara", "Pozo Almonte", "Iquique", "Pica", "Colchane", "Alto Hospicio"],
    "2 - Región de Antofagasta": ["Tocopilla", "Maria Elena", "Ollague", "Calama", "San Pedro Atacama", "Sierra Gorda", "Mejillones", "Antofagasta", "Taltal"],
    // ... (se repite la misma lógica para todas las regiones)
    "16 - Región del Ñuble": ["Cobquecura", "Ñiquen", "San Fabian", "San Carlos", "Quirihue", "Ninhue", "Trehuaco", "San Nicolas", "Coihueco", "Chillan", "Portezuelo", "Pinto", "Coelemu", "Bulnes", "San Ignacio", "Ranquil", "Quillon", "El Carmen", "Pemuco", "Yungay", "Chillan Viejo"]
};

// Listas auxiliares para poblar selects
const tipo_mascota = ["Gato", "Perro"];
const medida_edad = ["Año(s)", "Mes(es)"];

/**
 * Función que llena el select de regiones con las claves del objeto regiones_comunas.
 */
const poblarRegiones = () => {
    let regionSelect = document.getElementById("select-region");
    for (const region in regiones_comunas) {
        let option = document.createElement("option");
        option.value = region;
        option.text = region;
        regionSelect.appendChild(option);
    }
};

/**
 * Función genérica que llena un <select> con valores de un arreglo.
 * @param {Array} data - Arreglo con los datos a cargar en el select
 * @param {string} select - ID del select a poblar
 */
const poblarSelect = (data, select) => {
    let dataSelect = document.getElementById(select);
    for (const info in data) {
        let option = document.createElement("option");
        option.value = data[info];
        option.text = data[info];
        dataSelect.appendChild(option);
    }
};

/**
 * Ejemplo de función que obtiene elementos seleccionados de un select múltiple
 * y los muestra en un alert.
 */
const mostrarSeleccion = () => {
    const select = document.getElementById("frutas");
    const seleccionados = Array.from(select.selectedOptions).map(option => option.value);
    alert("Seleccionaste: " + seleccionados.join(", "));
};

/**
 * Función que actualiza el select de comunas según la región seleccionada.
 */
const updateComunas = () => {
    let regionSelect = document.getElementById("select-region");
    let comunaSelect = document.getElementById("select-comuna");
    let selectedRegion = regionSelect.value;
    
    // Reinicia el select con la opción por defecto
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    
    // Si existen comunas para la región seleccionada, se cargan
    if (regiones_comunas[selectedRegion]) {
        regiones_comunas[selectedRegion].forEach(comuna => {
            let option = document.createElement("option");
            option.value = comuna;
            option.text = comuna;
            comunaSelect.appendChild(option);
        });
    }
};

/**
 * Función que actualiza dinámicamente inputs de contacto según las opciones seleccionadas.
 * Cada contacto requiere un input de texto para ingresar datos.
 */
function changeContactos() {
    const select = document.getElementById("select-contacto");
    const inputsContacto = document.getElementById("inputs-contacto");
    const selected = Array.from(select.selectedOptions);
    
    if (selected.length === 0) {
        inputsContacto.innerHTML = "";
    }

    if (selected.length <= 5) { // Se limita a un máximo de 5 contactos
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
            siguiente.hidden = false; // Muestra el siguiente input
        }
    });
}
mostrarSiguienteInput(foto1, foto2);
mostrarSiguienteInput(foto2, foto3);
mostrarSiguienteInput(foto3, foto4);
mostrarSiguienteInput(foto4, foto5);

// Configuración de fecha por defecto: se muestra la hora actual menos 1 hora
let fechaAMostrar = new Date();
fechaAMostrar.setHours(fechaAMostrar.getHours() - 1);
const formattedDate = fechaAMostrar.toISOString().slice(0, 16);
document.getElementById("entrega").value = formattedDate;

// Listeners que conectan selects con funciones dinámicas
document.getElementById("select-region").addEventListener("change", updateComunas);
document.getElementById("select-contacto").addEventListener("change", changeContactos);

/**
 * Función que se ejecuta al cargar la página.
 * Pone en funcionamiento los selects de tipo de mascota, medida de edad y regiones,
 * además de inicializar los inputs de contacto.
 */
window.onload = () => {
    poblarSelect(tipo_mascota, "select-tipo");
    poblarSelect(medida_edad, "select-edad");
    poblarRegiones();
    changeContactos();
};
