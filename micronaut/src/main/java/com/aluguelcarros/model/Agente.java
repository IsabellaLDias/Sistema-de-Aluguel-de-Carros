package com.aluguelcarros.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.Entity;

@Serdeable
@Entity
public class Agente extends Usuario {

    private String nome;
    private String cnpj;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public void modificarPedido() {}
    public void avaliarPedido(Boolean financeiro) {}
}