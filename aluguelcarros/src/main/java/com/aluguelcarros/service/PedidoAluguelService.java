package com.aluguelcarros.service;

import org.springframework.stereotype.Service;
import com.aluguelcarros.model.PedidoAluguel;
import com.aluguelcarros.dto.PedidoAluguelDTO;
import com.aluguelcarros.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class PedidoAluguelService {

    private final List<PedidoAluguel> pedidos = new ArrayList<>();
    private final AtomicLong contador = new AtomicLong();

    public PedidoAluguel criar(PedidoAluguelDTO dto) {
        PedidoAluguel p = new PedidoAluguel();
        p.setId(contador.incrementAndGet());
        p.setClienteId(dto.clienteId);
        p.setPrazoMeses(dto.prazoMeses);
        p.setValorPrevisto(dto.valorPrevisto);
        p.setDataPedido(LocalDate.now());
        p.setStatus("PENDENTE");

        pedidos.add(p);
        return p;
    }

    public List<PedidoAluguel> listar() {
        return pedidos;
    }

    public PedidoAluguel buscarPorId(Long id) {
        return pedidos.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
    }

    public PedidoAluguel atualizar(Long id, PedidoAluguelDTO dto) {
        PedidoAluguel p = buscarPorId(id);

        p.setClienteId(dto.clienteId);
        p.setPrazoMeses(dto.prazoMeses);
        p.setValorPrevisto(dto.valorPrevisto);

        return p;
    }

    public boolean deletar(Long id) {
        boolean removido = pedidos.removeIf(p -> p.getId().equals(id));
        if (!removido) {
            throw new ResourceNotFoundException("Pedido não encontrado");
        }
        return true;
    }
}