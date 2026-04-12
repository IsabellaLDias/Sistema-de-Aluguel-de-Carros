package com.aluguelcarros.model;

import jakarta.persistence.ManyToOne;

public class ContratoCredito {

    private Double valor;
    private Double taxaJuros;

    @ManyToOne
    private Banco bancoConcedente;

    public Double getValor() {
        return valor;
    }   
    public void setValor(Double valor) {
        this.valor = valor;
    }
    public Double getTaxaJuros() {
        return taxaJuros;
    }
    public void setTaxaJuros(Double taxaJuros) {
        this.taxaJuros = taxaJuros;
    }
}