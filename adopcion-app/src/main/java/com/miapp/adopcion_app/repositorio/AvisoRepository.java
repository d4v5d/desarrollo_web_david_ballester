package com.miapp.adopcion_app.repositorio;

import com.miapp.adopcion_app.modelo.AvisoAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvisoRepository extends JpaRepository<AvisoAdopcion, Integer> {
    // Spring Data JPA provee automáticamente métodos como findAll()
}