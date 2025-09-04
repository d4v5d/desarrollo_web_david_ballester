const regiones_comunas = {
    "1 - Región de Tarapacá": ["Camiña", "Huara", "Pozo Almonte", "Iquique", "Pica", "Colchane", "Alto Hospicio"],
    "2 - Región de Antofagasta": ["Tocopilla", "Maria Elena", "Ollague", "Calama", "San Pedro Atacama", "Sierra Gorda", "Mejillones", "Antofagasta", "Taltal"],
    "3 - Región de Atacama": ["Diego de Almagro", "Chañaral", "Caldera", "Copiapo", "Tierra Amarilla", "Huasco", "Freirina", "Vallenar", "Alto del Carmen"],
    "4 - Región de Coquimbo ": ["La Higuera", "La Serena", "Vicuña", "Paihuano", "Coquimbo", "Andacollo", "Rio Hurtado", "Ovalle", "Monte Patria", "Punitaqui", "Combarbala", "Mincha", "Illapel", "Salamanca", "Los Vilos"],
    "5 - Región de Valparaíso": ["Petorca", "Cabildo", "Papudo", "La Ligua", "Zapallar", "Putaendo", "Santa Maria", "San Felipe", "Pencahue", "Catemu", "Llay Llay", "Nogales", "La Calera", "Hijuelas", "La Cruz", "Quillota", "Olmue", "Limache", "Los Andes", "Rinconada", "Calle Larga", "San Esteban", "Puchuncavi", "Quintero", "Viña del Mar", "Villa Alemana", "Quilpue", "Valparaiso", "Juan Fernandez", "Casablanca", "Concon", "Isla de Pascua", "Algarrobo", "El Quisco", "El Tabo", "Cartagena", "San Antonio", "Santo Domingo"],
    "6 - Región del Libertador Bernardo Ohiggins": ["Mostazal", "Codegua", "Graneros", "Machali", "Rancagua", "Olivar", "Doñihue", "Requinoa", "Coinco", "Coltauco", "Quinta Tilcoco", "Las Cabras", "Rengo", "Peumo", "Pichidegua", "Malloa", "San Vicente", "Navidad", "La Estrella", "Marchigue", "Pichilemu", "Litueche", "Paredones", "San Fernando", "Peralillo", "Placilla", "Chimbarongo", "Palmilla", "Nancagua", "Santa Cruz", "Pumanque", "Chepica", "Lolol"],
    "7 - Región del Maule": ["Teno", "Romeral", "Rauco", "Curico", "Sagrada Familia", "Hualañe", "Vichuquen", "Molina", "Licanten", "Rio Claro", "Curepto", "Pelarco", "Talca", "Pencahue", "San Clemente", "Constitucion", "Maule", "Empedrado", "San Rafael", "San Javier", "Colbun", "Villa Alegre", "Yerbas Buenas", "Linares", "Longavi", "Retiro", "Parral", "Chanco", "Pelluhue", "Cauquenes"],
    "8 - Región del Biobío": ["Tome", "Florida", "Penco", "Talcahuano", "Concepcion", "Hualqui", "Coronel", "Lota", "Santa Juana", "Chiguayante", "San Pedro de la Paz", "Hualpen", "Cabrero", "Yumbel", "Tucapel", "Antuco", "San Rosendo", "Laja", "Quilleco", "Los Angeles", "Nacimiento", "Negrete", "Santa Barbara", "Quilaco", "Mulchen", "Alto Bio Bio", "Arauco", "Curanilahue", "Los Alamos", "Lebu", "Cañete", "Contulmo", "Tirua"],
    "9 - Región de La Araucanía": ["Renaico", "Angol", "Collipulli", "Los Sauces", "Puren", "Ercilla", "Lumaco", "Victoria", "Traiguen", "Curacautin", "Lonquimay", "Perquenco", "Galvarino", "Lautaro", "Vilcun", "Temuco", "Carahue", "Melipeuco", "Nueva Imperial", "Puerto Saavedra", "Cunco", "Freire", "Pitrufquen", "Teodoro Schmidt", "Gorbea", "Pucon", "Villarrica", "Tolten", "Curarrehue", "Loncoche", "Padre Las Casas", "Cholchol"],
    "10 - Región de Los Lagos": ["San Pablo", "San Juan", "Osorno", "Puyehue", "Rio Negro", "Purranque", "Puerto Octay", "Frutillar", "Fresia", "Llanquihue", "Puerto Varas", "Los Muermos", "Puerto Montt", "Maullin", "Calbuco", "Cochamo", "Ancud", "Quemchi", "Dalcahue", "Curaco de Velez", "Castro", "Chonchi", "Queilen", "Quellon", "Quinchao", "Puqueldon", "Chaiten", "Futaleufu", "Palena", "Hualaihue"],
    "11 - Región Aisén del General Carlos Ibáñez del Campo": ["Guaitecas", "Cisnes", "Aysen", "Coyhaique", "Lago Verde", "Rio Ibañez", "Chile Chico", "Cochrane", "Tortel", "O'Higins"],
    "12 - Región de Magallanes y la Antártica Chilena": ["Torres del Paine", "Puerto Natales", "Laguna Blanca", "San Gregorio", "Rio Verde", "Punta Arenas", "Porvenir", "Primavera", "Timaukel", "Antartica"],
    "RM - Región Metropolitana de Santiago ": ["Tiltil", "Colina", "Lampa", "Conchali", "Quilicura", "Renca", "Las Condes", "Pudahuel", "Quinta Normal", "Providencia", "Santiago", "La Reina", "Ñuñoa", "San Miguel", "Maipu", "La Cisterna", "La Florida", "La Granja", "Independencia", "Huechuraba", "Recoleta", "Vitacura", "Lo Barrenechea", "Macul", "Peñalolen", "San Joaquin", "La Pintana", "San Ramon", "El Bosque", "Pedro Aguirre Cerda", "Lo Espejo", "Estacion Central", "Cerrillos", "Lo Prado", "Cerro Navia", "San Jose de Maipo", "Puente Alto", "Pirque", "San Bernardo", "Calera de Tango", "Buin", "Paine", "Peñaflor", "Talagante", "El Monte", "Isla de Maipo", "Curacavi", "Maria Pinto", "Melipilla", "San Pedro", "Alhue", "Padre Hurtado"],
    "14 - Región de Los Ríos": ["Lanco", "Mariquina", "Panguipulli", "Mafil", "Valdivia", "Los Lagos", "Corral", "Paillaco", "Futrono", "Lago Ranco", "La Union", "Rio Bueno"],
    "15 - Región Arica y Parinacota": ["Gral. Lagos", "Putre", "Arica", "Camarones"],
    "16 - Región del Ñuble": ["Cobquecura", "Ñiquen", "San Fabian", "San Carlos", "Quirihue", "Ninhue", "Trehuaco", "San Nicolas", "Coihueco", "Chillan", "Portezuelo", "Pinto", "Coelemu", "Bulnes", "San Ignacio", "Ranquil", "Quillon", "El Carmen", "Pemuco", "Yungay", "Chillan Viejo"]
};

const tipo_mascota = ["Gato", "Perro"];
const medida_edad = ["Año(s)", "Mes(es)"];


const poblarRegiones = () => {
    let regionSelect = document.getElementById("select-region");
    for (const region in regiones_comunas) {
        let option = document.createElement("option");
        option.value = region;
        option.text = region;
        regionSelect.appendChild(option);
    }
};


const poblarSelect = (data, select) => {
    let dataSelect = document.getElementById(select);
    for (const info in data) {
        let option = document.createElement("option");
        option.value = data[info];
        option.text = data[info];
        dataSelect.appendChild(option);
    }
};

const mostrarSeleccion = () => {
    const select = document.getElementById("frutas");
    const seleccionados = Array.from(select.selectedOptions).map(option => option.value);
    alert("Seleccionaste: " + seleccionados.join(", "));
};

const updateComunas = () => {
    let regionSelect = document.getElementById("select-region");
    let comunaSelect = document.getElementById("select-comuna");
    let selectedRegion = regionSelect.value;
    
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    
    if (regiones_comunas[selectedRegion]) {
        regiones_comunas[selectedRegion].forEach(comuna => {
            let option = document.createElement("option");
            option.value = comuna;
            option.text = comuna;
            comunaSelect.appendChild(option);
        });
    }
};

function changeContactos() {
    const select = document.getElementById("select-contacto");
    const inputsContacto = document.getElementById("inputs-contacto");
    const selected = Array.from(select.selectedOptions)
    
    if (selected.length === 0) {
        inputsContacto.innerHTML = "";
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
        input.required = true

        const div = document.createElement("div");
        div.appendChild(label);
        div.appendChild(input);

        inputsContacto.appendChild(div);
        })
    }
}


const foto1 = document.getElementById("foto1");
const foto2 = document.getElementById("foto2");
const foto3 = document.getElementById("foto3");
const foto4 = document.getElementById("foto4");
const foto5 = document.getElementById("foto5");

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


let fechaAMostrar = new Date();
fechaAMostrar.setHours(fechaAMostrar.getHours() - 1);
const formattedDate = fechaAMostrar.toISOString().slice(0, 16);
document.getElementById("entrega").value = formattedDate;


document.getElementById("select-region").addEventListener("change", updateComunas);
document.getElementById("select-contacto").addEventListener("change", changeContactos);

window.onload = () => {
    poblarSelect(tipo_mascota, "select-tipo");
    poblarSelect(medida_edad, "select-edad");
    poblarRegiones();
    changeContactos();
};