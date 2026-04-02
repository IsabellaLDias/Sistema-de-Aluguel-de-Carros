package com.aluguelcarros.dto;

import com.aluguelcarros.enum_.StatusAluguel;

public class PedidoAluguelDTO {

    public Long clienteId;
    public Integer prazoMeses;
    public Double valorPrevisto;
    public StatusAluguel status;
}