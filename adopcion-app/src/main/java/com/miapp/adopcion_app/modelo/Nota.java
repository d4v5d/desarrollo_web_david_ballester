package com.miapp.adopcion_app.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Relación ManyToOne: Muchas notas a un AvisoAdopcion
    @ManyToOne 
    @JoinColumn(name = "aviso_id", nullable = false)
    private AvisoAdopcion aviso; // Asumiendo que esta Entidad existe y tiene la PK

    @NotNull
    @Min(value = 1, message = "La nota debe ser 1 o mayor.")
    @Max(value = 7, message = "La nota debe ser 7 o menor.")
    @Column(name = "nota", nullable = false)
    private Integer nota;

    // --- Constructor ---
    public Nota() {}

    // --- Getters y Setters ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public AvisoAdopcion getAviso() { return aviso; }
    public void setAviso(AvisoAdopcion aviso) { this.aviso = aviso; }
    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
}
