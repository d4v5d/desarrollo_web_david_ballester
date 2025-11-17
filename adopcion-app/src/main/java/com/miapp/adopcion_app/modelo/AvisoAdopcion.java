package com.miapp.adopcion_app.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "aviso_adopcion")
public class AvisoAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha_publicacion")
    private LocalDate fechaPublicacion;

    private String sector;
    
    @Column(name = "cantidad_tipo_edad")
    private String cantidadTipoEdad;

    private String comuna;

    // Relación para facilitar la carga del promedio inicial.
    // Usamos FetchType.LAZY para evitar cargar todas las notas si no se necesitan.
    @OneToMany(mappedBy = "aviso", fetch = FetchType.LAZY)
    private List<Nota> notas;

    // Campo transitorio: No es una columna en la base de datos.
    // Se usará para mostrar el promedio en la vista HTML.
    @Transient 
    private String notaPromedio; 

    // --- Constructor, Getters y Setters ---
    public AvisoAdopcion() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public LocalDate getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDate fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }
    public String getCantidadTipoEdad() { return cantidadTipoEdad; }
    public void setCantidadTipoEdad(String cantidadTipoEdad) { this.cantidadTipoEdad = cantidadTipoEdad; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }

    public String getNotaPromedio() { return notaPromedio; }
    public void setNotaPromedio(String notaPromedio) { this.notaPromedio = notaPromedio; }
    // Puedes omitir getters/setters para 'notas' si solo se usan en el servicio
}