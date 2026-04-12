package com.aluguelcarros.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.Entity;
@Serdeable
@Entity
public class Agente extends Usuario {

    private String cnpj;


    public String getCnpj() { return cnpj;}
    public void setCnpj(String cnpj) { this.cnpj = cnpj;}

    public void modificarPedido() {}
    public void avaliarPedido(Boolean financeiro) {}
}