package com.aluguelcarros.service;

import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.model.PedidoAluguel;
import com.aluguelcarros.dto.PedidoAluguelDTO;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.repository.ClienteRepository;
import com.aluguelcarros.repository.PedidoAluguelRepository;
import com.aluguelcarros.repository.AgenteRepository;
import com.aluguelcarros.model.Agente;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;

@Singleton
@Transactional
public class PedidoAluguelService {

    private final PedidoAluguelRepository repository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;

    public PedidoAluguelService(PedidoAluguelRepository repository, ClienteRepository clienteRepository, AgenteRepository agenteRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
    }

    public PedidoAluguel criar(PedidoAluguelDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado para o pedido"));

        PedidoAluguel p = new PedidoAluguel();
        p.setPrazoMeses(dto.getPrazoMeses());
        p.setValorPrevisto(dto.getValorPrevisto());
        p.setDataPedido(LocalDate.now());
        p.setStatus("PENDENTE");
        p.setCliente(cliente);
        return repository.save(p);
    }

    public List<PedidoAluguel> listar() {
        return StreamSupport.stream(repository.findAll().spliterator(), false).toList();
    }

    public PedidoAluguel buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
    }

    public PedidoAluguel atualizar(Long id, PedidoAluguelDTO dto) {
        PedidoAluguel p = buscarPorId(id);

        p.setPrazoMeses(dto.getPrazoMeses());
        p.setValorPrevisto(dto.getValorPrevisto());
        if (dto.getStatus() != null) {
            p.setStatus(String.valueOf(dto.getStatus()));
        }
        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado para o pedido"));
            p.setCliente(cliente);
        }
        if (dto.getAgenteId() != null) {
            Agente avaliador = agenteRepository.findById(dto.getAgenteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));
            p.setAvaliador(avaliador);
        }

        return repository.save(p);
    }

    public boolean deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Pedido não encontrado");
        }
        repository.deleteById(id);
        return true;
    }
}