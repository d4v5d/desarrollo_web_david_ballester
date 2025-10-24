document.getElementById('form-comentario').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const avisoId = form.aviso_id.value;
    const nombre = form.nombre.value.trim();
    const texto = form.texto.value.trim();
    const messageContainer = document.getElementById('comentario-flash-messages');
    messageContainer.innerHTML = '';

    // --- Validación Lado del Cliente ---
    let errors = [];
    if (nombre.length < 3 || nombre.length > 80) {
        errors.push('El nombre debe tener entre 3 y 80 caracteres.');
    }
    if (texto.length < 5) {
        errors.push('El comentario debe tener al menos 5 caracteres.');
    }

    if (errors.length > 0) {
        messageContainer.innerHTML = `<div class="alert error">${errors.join('<br>')}</div>`;
        return;
    }
    // --- Fin Validación Lado del Cliente ---

    try {
        const response = await fetch('/api/comentarios', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                aviso_id: parseInt(avisoId),
                nombre: nombre,
                texto: texto
            }),
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            // Éxito: limpiar formulario y recargar para ver el nuevo comentario
            messageContainer.innerHTML = `<div class="alert success">${result.message}</div>`;
            form.reset();
            
            // Recargar la página para ver el nuevo comentario sin hacer fetch para el listado
            window.location.reload(); 

        } else {
            // Error de servidor (validación 400 o error interno 500)
            let errorMsg;
            if (response.status === 400 && result.errors) {
                // Errores de validación del servidor
                errorMsg = result.errors.join('<br>');
            } else {
                // Otro error del servidor
                errorMsg = result.message || `Error al agregar el comentario. Estado: ${response.status}`;
            }
            messageContainer.innerHTML = `<div class="alert error">Error: ${errorMsg}</div>`;
        }
    } catch (error) {
        messageContainer.innerHTML = `<div class="alert error">Error de red al intentar agregar el comentario.</div>`;
        console.error('Fetch error:', error);
    }
});