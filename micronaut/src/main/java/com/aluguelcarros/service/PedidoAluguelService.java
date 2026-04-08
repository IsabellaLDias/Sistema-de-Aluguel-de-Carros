package com.aluguelcarros.service;

import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import com.aluguelcarros.model.PedidoAluguel;
import com.aluguelcarros.dto.PedidoAluguelDTO;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.repository.PedidoAluguelRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;

@Singleton
@Transactional
public class PedidoAluguelService {

    private final PedidoAluguelRepository repository;

    public PedidoAluguelService(PedidoAluguelRepository repository) {
        this.repository = repository;
    }

    public PedidoAluguel criar(PedidoAluguelDTO dto) {
        PedidoAluguel p = new PedidoAluguel();
        p.setClienteId(dto.getClienteId());
        p.setPrazoMeses(dto.getPrazoMeses());
        p.setValorPrevisto(dto.getValorPrevisto());
        p.setDataPedido(LocalDate.now());
        p.setStatus("PENDENTE");
        return repository.update(p);
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

        p.setClienteId(dto.getClienteId());
        p.setPrazoMeses(dto.getPrazoMeses());
        p.setValorPrevisto(dto.getValorPrevisto());
        p.setStatus(String.valueOf(dto.getStatus()));

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