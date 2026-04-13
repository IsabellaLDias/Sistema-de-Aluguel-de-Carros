package com.aluguelcarros.repository;

import com.aluguelcarros.model.Rendimento;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.List;

@Repository
public interface RendimentoRepository extends CrudRepository<Rendimento, Long> {
    List<Rendimento> findByUsuarioId(Long usuarioId);
}
