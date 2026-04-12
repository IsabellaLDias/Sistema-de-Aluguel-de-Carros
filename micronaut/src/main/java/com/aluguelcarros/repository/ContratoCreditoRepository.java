package com.aluguelcarros.repository;

import com.aluguelcarros.model.ContratoCredito;
import io.micronaut.data.annotation.Repository; 
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface ContratoCreditoRepository extends CrudRepository<ContratoCredito, Long> {
}