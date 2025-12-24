package com.miapp.adopcion_app.servicio;

import com.miapp.adopcion_app.modelo.AvisoAdopcion;
import com.miapp.adopcion_app.repositorio.AvisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository avisoRepository;

    @Autowired
    private NotaService notaService; // Inyectamos el servicio de notas para el cálculo

    // Carga todos los avisos y adjunta su nota promedio actual
    public List<AvisoAdopcion> findAllAvisosConPromedio() {
        List<AvisoAdopcion> avisos = avisoRepository.findAll();
        
        // Mapeamos la lista para inyectar el promedio usando el NotaService
        return avisos.stream().map(aviso -> {
            String promedio = notaService.recalcularPromedio(aviso.getId());
            aviso.setNotaPromedio(promedio);
            return aviso;
        }).collect(Collectors.toList());
    }
}