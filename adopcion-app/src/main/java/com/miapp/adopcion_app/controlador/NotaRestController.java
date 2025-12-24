package com.miapp.adopcion_app.controlador;

import com.miapp.adopcion_app.modelo.Nota;
import com.miapp.adopcion_app.servicio.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notas")
public class NotaRestController {

    @Autowired
    private NotaService notaService;

    @PostMapping("/evaluar")
    public ResponseEntity<?> evaluarAviso(@RequestBody Nota nuevaNota) {
        try {
            // Guarda la nota y realiza la validación (en el Service)
            notaService.guardarNota(nuevaNota);
            
            // Recalcula el nuevo promedio del aviso
            String nuevoPromedio = notaService.recalcularPromedio(nuevaNota.getAviso().getId());

            // Devuelve el nuevo promedio al cliente para actualizar la interfaz
            Map<String, String> response = new HashMap<>();
            response.put("nuevo_promedio", nuevoPromedio);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Captura el error de validación (nota fuera de rango)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Otros errores del servidor/BD
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al procesar la evaluación.");
        }
    }
}