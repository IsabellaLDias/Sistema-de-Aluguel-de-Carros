package com.aluguelcarros.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Serdeable
public class ContratoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String tipoContrato;

    @JsonIgnore
    @OneToOne
    private PedidoAluguel pedido;

    @OneToOne(cascade = CascadeType.ALL)
    private ContratoCredito contratoCredito;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Automovel> automoveis;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public String getTipoContrato() { return tipoContrato; }
    public void setTipoContrato(String tipoContrato) { this.tipoContrato = tipoContrato; }

    public PedidoAluguel getPedido() { return pedido; }
    public void setPedido(PedidoAluguel pedido) { this.pedido = pedido; }

    // Expõe apenas o ID do pedido para o frontend (sem serializar o objeto inteiro)
    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("pedidoId")
    public Long getPedidoId() {
        return pedido != null ? pedido.getId() : null;
    }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("agenciaNome")
    public String getAgenciaNome() {
        return (pedido != null && pedido.getAvaliador() != null) ? pedido.getAvaliador().getNome() : null;
    }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("carros")
    public String getCarros() {
        if (automoveis == null || automoveis.isEmpty()) return null;
        return automoveis.stream()
                .map(a -> a.getMarca() + " " + a.getModelo() + " (" + a.getPlaca() + ")")
                .collect(Collectors.joining(", "));
    }

    public List<Automovel> getAutomoveis() { return automoveis; }
    public void setAutomoveis(List<Automovel> automoveis) { this.automoveis = automoveis; }

    public ContratoCredito getContratoCredito() { return contratoCredito; }
    public void setContratoCredito(ContratoCredito contratoCredito) { this.contratoCredito = contratoCredito; }
}