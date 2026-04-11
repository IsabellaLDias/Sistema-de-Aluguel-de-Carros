package com.aluguelcarros.repository;

import com.aluguelcarros.model.PedidoAluguel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.List;

@Repository
public interface PedidoAluguelRepository extends CrudRepository<PedidoAluguel, Long> {

    // Busca todos os pedidos de um cliente específico (usado na sua função listarPedidos do JS)
    List<PedidoAluguel> findByClienteId(Long clienteId);

    // Busca pedidos por status (útil para o Agente ver o que está PENDENTE)
    List<PedidoAluguel> findByStatus(String status);
}