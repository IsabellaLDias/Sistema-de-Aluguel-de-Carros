package com.aluguelcarros.model;

import jakarta.persistence.ManyToOne;

public class Automovel {

    private String matricula;
    private Integer ano;
    private String marca;
    private String modelo;
    private String placa;

    @ManyToOne
    private Usuario proprietario;

    public String getMatricula() {
        return matricula;
    }

    public Integer getAno() {
        return ano;
    }

    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public String getPlaca() {
        return placa;
    }
    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

}