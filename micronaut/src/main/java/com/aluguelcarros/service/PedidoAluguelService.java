package com.aluguelcarros.service;

import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.model.PedidoAluguel;
import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.model.Agente;
import com.aluguelcarros.dto.PedidoAluguelDTO;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.repository.ClienteRepository;
import com.aluguelcarros.repository.PedidoAluguelRepository;
import com.aluguelcarros.repository.AgenteRepository;
import com.aluguelcarros.repository.AutomovelRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;

@Singleton
@Transactional
public class PedidoAluguelService {

    private final PedidoAluguelRepository repository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final AutomovelRepository automovelRepository;

    public PedidoAluguelService(PedidoAluguelRepository repository, 
                               ClienteRepository clienteRepository, 
                               AgenteRepository agenteRepository,
                               AutomovelRepository automovelRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
        this.automovelRepository = automovelRepository;
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

        if (dto.getAutomovelId() != null) {
            Automovel auto = automovelRepository.findById(dto.getAutomovelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Automóvel não encontrado"));
            p.setAutomovel(auto);
        }

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

        if (dto.getPrazoMeses() != null) p.setPrazoMeses(dto.getPrazoMeses());
        if (dto.getValorPrevisto() != null) p.setValorPrevisto(dto.getValorPrevisto());
        
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
        if (dto.getAutomovelId() != null) {
            Automovel auto = automovelRepository.findById(dto.getAutomovelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Automóvel não encontrado"));
            p.setAutomovel(auto);
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