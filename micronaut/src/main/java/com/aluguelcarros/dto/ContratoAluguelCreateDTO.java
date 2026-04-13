package com.aluguelcarros.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;
import java.util.List;

/**
 * DTO para criação de contrato de aluguel.
 * Usado pelo frontend para enviar todos os dados necessários,
 * incluindo pedidoId, agenteId (para registrar propriedade dos veículos),
 * lista de automovelIds e id do contrato de crédito (opcional).
 */
@Introspected
@Serdeable
public class ContratoAluguelCreateDTO {

    private String tipoContrato;   // CLIENTE | EMPRESA | BANCO
    private String dataInicio;
    private String dataFim;
    private Long pedidoId;
    private Long agenteId;         // ID do agente que está formalizando (para proprietário)
    private List<Long> automovelIds;
    private Long contratoCreditoId; // nullable — só para tipo BANCO

    public String getTipoContrato() { return tipoContrato; }
    public void setTipoContrato(String tipoContrato) { this.tipoContrato = tipoContrato; }

    public String getDataInicio() { return dataInicio; }
    public void setDataInicio(String dataInicio) { this.dataInicio = dataInicio; }

    public String getDataFim() { return dataFim; }
    public void setDataFim(String dataFim) { this.dataFim = dataFim; }

    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }

    public Long getAgenteId() { return agenteId; }
    public void setAgenteId(Long agenteId) { this.agenteId = agenteId; }

    public List<Long> getAutomovelIds() { return automovelIds; }
    public void setAutomovelIds(List<Long> automovelIds) { this.automovelIds = automovelIds; }

    public Long getContratoCreditoId() { return contratoCreditoId; }
    public void setContratoCreditoId(Long contratoCreditoId) { this.contratoCreditoId = contratoCreditoId; }
}
