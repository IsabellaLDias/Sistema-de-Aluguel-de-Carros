package com.aluguelcarros.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Serdeable
public class ContratoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String tipoContrato;

    // @JsonIgnore: evita serializar a árvore inteira PedidoAluguel → Cliente → ...
    // O frontend recebe o ID via getPedidoId()
    @JsonIgnore
    @OneToOne
    private PedidoAluguel pedido;

    @OneToOne(cascade = CascadeType.ALL)
    private ContratoCredito contratoCredito;

    // @JsonIgnore: evita LazyInitializationException ao serializar fora da transação
    @JsonIgnore
    @ManyToMany
    private List<Automovel> automoveis;

    // --- Getters e Setters ---

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
    public Long getPedidoId() {
        return pedido != null ? pedido.getId() : null;
    }

    public List<Automovel> getAutomoveis() { return automoveis; }
    public void setAutomoveis(List<Automovel> automoveis) { this.automoveis = automoveis; }

    public ContratoCredito getContratoCredito() { return contratoCredito; }
    public void setContratoCredito(ContratoCredito contratoCredito) { this.contratoCredito = contratoCredito; }
}