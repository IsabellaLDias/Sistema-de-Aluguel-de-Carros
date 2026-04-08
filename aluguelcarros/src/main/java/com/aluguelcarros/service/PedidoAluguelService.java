package com.aluguelcarros.service;

import org.springframework.stereotype.Service;
import com.aluguelcarros.model.PedidoAluguel;
import com.aluguelcarros.dto.PedidoAluguelDTO;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.repository.PedidoAluguelRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class PedidoAluguelService {

    private final PedidoAluguelRepository repository;

    public PedidoAluguelService(PedidoAluguelRepository repository) {
        this.repository = repository;
    }

    public PedidoAluguel criar(PedidoAluguelDTO dto) {
        PedidoAluguel p = new PedidoAluguel();
        p.setClienteId(dto.clienteId);
        p.setPrazoMeses(dto.prazoMeses);
        p.setValorPrevisto(dto.valorPrevisto);
        p.setDataPedido(LocalDate.now());
        p.setStatus("PENDENTE");
        return repository.save(p);
    }

    public List<PedidoAluguel> listar() {
        return repository.findAll();
    }

    public PedidoAluguel buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
    }

    public PedidoAluguel atualizar(Long id, PedidoAluguelDTO dto) {
        PedidoAluguel p = buscarPorId(id);

        p.setClienteId(dto.clienteId);
        p.setPrazoMeses(dto.prazoMeses);
        p.setValorPrevisto(dto.valorPrevisto);
        p.setStatus(String.valueOf(dto.status));

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