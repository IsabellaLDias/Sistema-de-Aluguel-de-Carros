package com.aluguelcarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aluguelcarros.model.PedidoAluguel;

public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {
}
