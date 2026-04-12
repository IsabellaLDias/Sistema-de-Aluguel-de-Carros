package com.aluguelcarros.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;

@Serdeable
@Entity
public class Rendimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entidadeEmpregadora;
    private Double valorAuferido;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEntidadeEmpregadora() { return entidadeEmpregadora; }
    public void setEntidadeEmpregadora(String entidadeEmpregadora) { this.entidadeEmpregadora = entidadeEmpregadora; }

    public Double getValorAuferido() { return valorAuferido; }
    public void setValorAuferido(Double valorAuferido) { this.valorAuferido = valorAuferido; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}