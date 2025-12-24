
document.addEventListener('DOMContentLoaded', () => {
    const selectorNota = document.getElementById('selector-nota');
    const opcionesNota = document.getElementById('opciones-nota');
    
    let avisoActualId = null;
    let celdaPromedioActual = null;

    // Generación de opciones de 1 a 7 (Misma lógica)
    for (let i = 1; i <= 7; i++) {
        // ... (Creación y estilos del span) ...
        const span = document.createElement('span');
        span.textContent = i;
        span.className = 'opcion-nota';
        span.style.cursor = 'pointer';
        span.style.margin = '0 5px';
        span.style.fontWeight = 'bold';
        span.dataset.nota = i;
        opcionesNota.appendChild(span);
        span.addEventListener('click', enviarNota);
    }
    
    // Función global para mostrar el selector (Misma lógica)
    window.mostrarSelectorNota = (btn, event) => {
        event.preventDefault();
        // ... (Obtención de ID y Celda, Posicionamiento y Muestra) ...
        avisoActualId = btn.dataset.avisoId;
        celdaPromedioActual = btn.closest('tr').querySelector('.nota-promedio');
        
        const rect = btn.getBoundingClientRect();
        selectorNota.style.top = `${rect.bottom + window.scrollY + 5}px`;
        selectorNota.style.left = `${rect.left + window.scrollX}px`;
        selectorNota.style.display = 'block';
    };

    // Ocultar el selector al hacer clic fuera (Misma lógica)
    document.addEventListener('click', (event) => {
        // ... (Lógica de ocultamiento) ...
        if (selectorNota.style.display === 'block' && 
            !selectorNota.contains(event.target) && 
            !event.target.classList.contains('btn-evaluar')) {
            selectorNota.style.display = 'none';
        }
    });

    /**
     * Envía la nota seleccionada al endpoint de Flask.
     */
    function enviarNota(event) {
        const notaSeleccionada = parseInt(event.target.dataset.nota);
        selectorNota.style.display = 'none'; 

        if (!avisoActualId || isNaN(notaSeleccionada)) {
            console.error("ID de aviso o nota no válido.");
            return;
        }

        const data = {
            aviso_id: parseInt(avisoActualId), 
            nota: notaSeleccionada
        };

        // URL del endpoint de Flask
        fetch('/api/notas/evaluar', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            // Actualizar la interfaz con el nuevo promedio devuelto por Flask
            if (celdaPromedioActual && data.nuevo_promedio) {
                celdaPromedioActual.textContent = data.nuevo_promedio;
                alert(`Nota agregada con éxito. Nuevo promedio: ${data.nuevo_promedio}`);
            }
        })
        .catch(error => {
            console.error('Error al enviar la evaluación:', error);
            alert(`Error: ${error.message || 'No se pudo registrar la nota.'}`);
        });
    }
});