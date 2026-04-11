package com.aluguelcarros.model;

import java.time.LocalDate;

public class ContratoAluguel {

    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String tipoContrato;

    public LocalDate getDataInicio() {  
        return dataInicio;
    }
    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }
    public LocalDate getDataFim() {
        return dataFim;
    }       
    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }
    public String getTipoContrato() {
        return tipoContrato;
    }
    public void setTipoContrato(String tipoContrato) {
        this.tipoContrato = tipoContrato;
    }
    

    public void executarContrato() {
        // implementação futura
    }
}