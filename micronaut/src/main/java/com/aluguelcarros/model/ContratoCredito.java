package com.aluguelcarros.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;

@Serdeable
@Entity
public class ContratoCredito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double valor;
    private Double taxaJuros;

    @ManyToOne
    @JoinColumn(name = "banco_id")
    private Banco bancoConcedente;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }

    public Double getTaxaJuros() { return taxaJuros; }
    public void setTaxaJuros(Double taxaJuros) { this.taxaJuros = taxaJuros; }

    public Banco getBancoConcedente() { return bancoConcedente; }
    public void setBancoConcedente(Banco bancoConcedente) { this.bancoConcedente = bancoConcedente; }
}