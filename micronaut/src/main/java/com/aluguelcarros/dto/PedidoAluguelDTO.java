package com.aluguelcarros.dto;

import com.aluguelcarros.enum_.StatusAluguel;
import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

@Introspected
@Serdeable
public class PedidoAluguelDTO {

    private Long clienteId;
    private Integer prazoMeses;
    private Double valorPrevisto;
    private StatusAluguel status;

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Integer getPrazoMeses() {
        return prazoMeses;
    }

    public void setPrazoMeses(Integer prazoMeses) {
        this.prazoMeses = prazoMeses;
    }

    public Double getValorPrevisto() {
        return valorPrevisto;
    }

    public void setValorPrevisto(Double valorPrevisto) {
        this.valorPrevisto = valorPrevisto;
    }

    public StatusAluguel getStatus() {
        return status;
    }

    public void setStatus(StatusAluguel status) {
        this.status = status;
    }
}