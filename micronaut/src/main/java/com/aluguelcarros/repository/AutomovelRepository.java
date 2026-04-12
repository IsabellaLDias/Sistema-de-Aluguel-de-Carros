package com.aluguelcarros.repository;

import com.aluguelcarros.model.Automovel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository // Anotação específica do Micronaut Data
public interface AutomovelRepository extends CrudRepository<Automovel, Long> {
    // Métodos de busca customizados podem vir aqui
}