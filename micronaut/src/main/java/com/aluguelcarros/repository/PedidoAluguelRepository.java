package com.aluguelcarros.repository;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import com.aluguelcarros.model.PedidoAluguel;

@Repository
public interface PedidoAluguelRepository extends CrudRepository<PedidoAluguel, Long> {
}
