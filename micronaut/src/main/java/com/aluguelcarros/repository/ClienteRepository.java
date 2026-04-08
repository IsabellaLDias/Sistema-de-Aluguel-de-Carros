package com.aluguelcarros.repository;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import com.aluguelcarros.model.Cliente;

@Repository
public interface ClienteRepository extends CrudRepository<Cliente, Long> {
}