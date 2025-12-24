package com.miapp.adopcion_app.controlador;

import com.miapp.adopcion_app.modelo.AvisoAdopcion;
import com.miapp.adopcion_app.servicio.AvisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Controller
public class AvisoController {

    @Autowired
    private AvisoService avisoService;

    @GetMapping("/")
    public String listarAvisos(Model model) {
        // Carga la lista de avisos con su promedio de nota ya calculado
        List<AvisoAdopcion> avisos = avisoService.findAllAvisosConPromedio();
        
        model.addAttribute("avisos", avisos);
        return "avisos_listado"; // Nombre del archivo HTML en src/main/resources/templates/
    }
}