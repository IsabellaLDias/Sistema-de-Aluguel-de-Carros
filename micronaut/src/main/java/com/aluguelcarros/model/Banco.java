package com.aluguelcarros.model;

public class Banco extends Agente implements Proprietario {

    private Integer codigoBanco;
    private String nomeFantasia;

    public Integer getCodigoBanco() {
        return codigoBanco;
    }

    public void setCodigoBanco(Integer codigoBanco) {
        this.codigoBanco = codigoBanco;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public void concederCredito() {
        // implementação futura
    }
}