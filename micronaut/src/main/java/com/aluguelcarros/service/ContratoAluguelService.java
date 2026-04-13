package com.aluguelcarros.service;

import com.aluguelcarros.dto.ContratoAluguelCreateDTO;
import com.aluguelcarros.model.*;
import com.aluguelcarros.repository.*;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Singleton
public class ContratoAluguelService {

    private final ContratoAluguelRepository   contratoRepository;
    private final PedidoAluguelRepository     pedidoRepository;
    private final AutomovelRepository         automovelRepository;
    private final AgenteRepository            agenteRepository;
    private final ClienteRepository           clienteRepository;
    private final ContratoCreditoRepository   creditoRepository;

    public ContratoAluguelService(
            ContratoAluguelRepository  contratoRepository,
            PedidoAluguelRepository    pedidoRepository,
            AutomovelRepository        automovelRepository,
            AgenteRepository           agenteRepository,
            ClienteRepository          clienteRepository,
            ContratoCreditoRepository  creditoRepository) {

        this.contratoRepository  = contratoRepository;
        this.pedidoRepository    = pedidoRepository;
        this.automovelRepository = automovelRepository;
        this.agenteRepository    = agenteRepository;
        this.clienteRepository   = clienteRepository;
        this.creditoRepository   = creditoRepository;
    }

    // -----------------------------------------------
    // Listar todos os contratos
    // -----------------------------------------------
    @Transactional
    public List<ContratoAluguel> listar() {
        return (List<ContratoAluguel>) contratoRepository.findAll();
    }

    @Transactional
    public Optional<ContratoAluguel> buscarPorId(Long id) {
        return contratoRepository.findById(id);
    }

    // -----------------------------------------------
    // Salvar (usado internamente / por outros controllers)
    // -----------------------------------------------
    @Transactional
    public ContratoAluguel salvar(ContratoAluguel contrato) {
        return contratoRepository.save(contrato);
    }

    // -----------------------------------------------
    // Criar contrato completo via DTO
    // - vincula pedido, veículos, contrato de crédito
    // - registra proprietário dos veículos conforme tipo
    // -----------------------------------------------
    @Transactional
    public ContratoAluguel criarContrato(ContratoAluguelCreateDTO dto) {

        ContratoAluguel c = new ContratoAluguel();
        c.setTipoContrato(dto.getTipoContrato());

        if (dto.getDataInicio() != null && !dto.getDataInicio().isBlank()) {
            c.setDataInicio(LocalDate.parse(dto.getDataInicio()));
        }
        if (dto.getDataFim() != null && !dto.getDataFim().isBlank()) {
            c.setDataFim(LocalDate.parse(dto.getDataFim()));
        }

        // ── Pedido ──────────────────────────────────
        PedidoAluguel pedido = null;
        if (dto.getPedidoId() != null) {
            pedido = pedidoRepository.findById(dto.getPedidoId()).orElse(null);
            c.setPedido(pedido);
        }

        // ── Contrato de Crédito (somente tipo BANCO) ─
        if (dto.getContratoCreditoId() != null) {
            creditoRepository.findById(dto.getContratoCreditoId())
                    .ifPresent(c::setContratoCredito);
        }

        // ── Determinar o proprietário dos veículos ───
        // tipo CLIENTE  → proprietário = cliente do pedido
        // tipo EMPRESA  → proprietário = agente (empresa)
        // tipo BANCO    → proprietário = agente (banco)
        Usuario proprietario = null;
        if ("CLIENTE".equals(dto.getTipoContrato()) && pedido != null) {
            proprietario = pedido.getCliente();
        } else if (dto.getAgenteId() != null) {
            proprietario = agenteRepository.findById(dto.getAgenteId()).orElse(null);
        }

        // ── Automóveis ───────────────────────────────
        if (dto.getAutomovelIds() != null && !dto.getAutomovelIds().isEmpty()) {
            List<Automovel> autos = new ArrayList<>();
            final Usuario dono = proprietario; // effectively final para lambda

            for (Long autoId : dto.getAutomovelIds()) {
                automovelRepository.findById(autoId).ifPresent(auto -> {
                    if (dono != null) {
                        auto.setProprietario(dono);
                        automovelRepository.save(auto);
                    }
                    autos.add(auto);
                });
            }
            c.setAutomoveis(autos);
        }

        return contratoRepository.save(c);
    }

    // -----------------------------------------------
    // Gerar contrato a partir de um pedido aprovado (uso interno)
    // -----------------------------------------------
    @Transactional
    public ContratoAluguel gerarContrato(PedidoAluguel pedido, List<Automovel> veiculos) {
        ContratoAluguel contrato = new ContratoAluguel();
        contrato.setDataInicio(LocalDate.now());
        contrato.setDataFim(LocalDate.now().plusMonths(pedido.getPrazoMeses()));
        contrato.setTipoContrato("PADRAO");
        contrato.setPedido(pedido);
        contrato.setAutomoveis(veiculos);
        return contratoRepository.save(contrato);
    }

    // -----------------------------------------------
    // Executar contrato
    // -----------------------------------------------
    @Transactional
    public void executarContrato(Long contratoId) {
        contratoRepository.findById(contratoId).ifPresent(contrato -> {
            // Aqui pode-se alterar status, flags de disponibilidade dos carros, etc.
            System.out.println("Executando contrato ID: " + contrato.getId());
        });
    }
}