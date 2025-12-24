
document.addEventListener('DOMContentLoaded', () => {
    const selectorNota = document.getElementById('selector-nota');
    const opcionesNota = document.getElementById('opciones-nota');
    
    let avisoActualId = null;
    let celdaPromedioActual = null;

    // Generar dinámicamente las opciones de 1 a 7
    for (let i = 1; i <= 7; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        span.className = 'opcion-nota';
        span.style.cursor = 'pointer';
        span.style.margin = '0 5px';
        span.style.fontWeight = 'bold';
        span.dataset.nota = i;
        opcionesNota.appendChild(span);
        
        // Asignar el listener de clic para enviar la nota
        span.addEventListener('click', enviarNota);
    }
    
    // Función global para mostrar el selector (llamada desde el HTML)
    window.mostrarSelectorNota = (btn, event) => {
        event.preventDefault();
        
        avisoActualId = btn.dataset.avisoId;
        // Encuentra la celda del promedio para actualizarla después
        celdaPromedioActual = btn.closest('tr').querySelector('.nota-promedio');
        
        // Posicionar y mostrar el selector al lado del botón
        const rect = btn.getBoundingClientRect();
        selectorNota.style.top = `${rect.bottom + window.scrollY + 5}px`;
        selectorNota.style.left = `${rect.left + window.scrollX}px`;
        selectorNota.style.display = 'block';
    };

    // Ocultar el selector al hacer clic fuera
    document.addEventListener('click', (event) => {
        if (selectorNota.style.display === 'block' && 
            !selectorNota.contains(event.target) && 
            !event.target.classList.contains('btn-evaluar')) {
            selectorNota.style.display = 'none';
        }
    });

    /**
     * Envía la nota seleccionada al endpoint de Spring Boot.
     */
    function enviarNota(event) {
        const notaSeleccionada = parseInt(event.target.dataset.nota);
        selectorNota.style.display = 'none'; // Ocultar después de seleccionar

        if (!avisoActualId || isNaN(notaSeleccionada)) {
            console.error("ID de aviso o nota no válido.");
            return;
        }

        const data = {
            // Spring Boot JPA espera un objeto AvisoAdopcion anidado con solo el ID
            nota: notaSeleccionada, 
            aviso: { id: avisoActualId } 
        };

        fetch('/api/notas/evaluar', { // Endpoint del NotaRestController
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                // Si Spring Boot devuelve un error 400, gestionamos el mensaje
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            // Actualizar el contador en la interfaz
            if (celdaPromedioActual && data.nuevo_promedio) {
                celdaPromedioActual.textContent = data.nuevo_promedio;
                console.log(`Nota agregada con éxito. Nuevo promedio: ${data.nuevo_promedio}`);
            }
        })
        .catch(error => {
            console.error('Error al enviar la evaluación:', error);
            alert(`Error: ${error.message || 'No se pudo registrar la nota.'}`);
        });
    }
});