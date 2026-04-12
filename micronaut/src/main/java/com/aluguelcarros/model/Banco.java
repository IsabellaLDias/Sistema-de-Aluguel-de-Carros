package com.aluguelcarros.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.Entity;

@Serdeable
@Entity
public class Banco extends Agente implements Proprietario {

    private Integer codigoBanco;
    private String nomeFantasia;

    // Getters e Setters
    public Integer getCodigoBanco() { return codigoBanco; }
    public void setCodigoBanco(Integer codigoBanco) { this.codigoBanco = codigoBanco; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

    public void concederCredito() {
        // implementação futura
    }
}