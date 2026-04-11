package com.aluguelcarros.repository;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import com.aluguelcarros.model.Agente;
@Repository
public interface AgenteRepository extends CrudRepository<Agente, Long> {
}