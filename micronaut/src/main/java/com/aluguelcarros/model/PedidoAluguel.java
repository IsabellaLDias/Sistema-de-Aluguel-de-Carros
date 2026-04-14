package com.aluguelcarros.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Serdeable
public class PedidoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dataPedido;
    private Integer prazoMeses;
    private Double valorPrevisto;
    private String status;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    @JsonIgnore
    private Agente avaliador;

    @JsonIgnore
    @OneToOne(mappedBy = "pedido")
    private ContratoAluguel contratoGerado;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDate dataPedido) { this.dataPedido = dataPedido; }

    public Integer getPrazoMeses() { return prazoMeses; }
    public void setPrazoMeses(Integer prazoMeses) { this.prazoMeses = prazoMeses; }

    public Double getValorPrevisto() { return valorPrevisto; }
    public void setValorPrevisto(Double valorPrevisto) { this.valorPrevisto = valorPrevisto; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public Agente getAvaliador() { return avaliador; }
    public void setAvaliador(Agente avaliador) { this.avaliador = avaliador; }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("avaliadorId")
    public Long getAvaliadorId() {
        return avaliador != null ? avaliador.getId() : null;
    }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("clienteId")
    public Long getClienteId() {
        return cliente != null ? cliente.getId() : null;
    }

}