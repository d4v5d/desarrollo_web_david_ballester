package com.miapp.adopcion_app.repositorio;

import com.miapp.adopcion_app.modelo.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Integer> {
    
    List<Nota> findByAvisoId(Integer avisoId); 
}