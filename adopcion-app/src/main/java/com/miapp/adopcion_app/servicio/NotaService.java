// src/main/java/com/tuapp/servicio/NotaService.java
package com.miapp.adopcion_app.servicio;

import com.miapp.adopcion_app.modelo.Nota;
import com.miapp.adopcion_app.repositorio.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.OptionalDouble;
import java.util.List;

@Service
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    // Asumiendo que AvisoAdopcion tiene un campo 'id'
    public Nota guardarNota(Nota nuevaNota) {
        // **Validación de Regla de Negocio (Entero entre 1 y 7)**
        if (nuevaNota.getNota() < 1 || nuevaNota.getNota() > 7) {
            throw new IllegalArgumentException("La nota debe ser un entero entre 1 y 7.");
        }
        return notaRepository.save(nuevaNota);
    }

    public String recalcularPromedio(Integer avisoId) {
        List<Nota> notas = notaRepository.findByAvisoId(avisoId);
        
        // Uso de Streams para calcular el promedio de forma concisa.
        OptionalDouble promedioOpt = notas.stream()
            .mapToInt(Nota::getNota) // Mapea a enteros
            .average(); // Calcula el promedio

        if (promedioOpt.isPresent()) {
            // Formatear a un decimal (opcional, dependiendo de la presentación)
            double promedio = promedioOpt.getAsDouble();
            return String.format("%.1f", promedio); 
        } else {
            return "-"; // Si no hay notas, retorna "-"
        }
    }
}