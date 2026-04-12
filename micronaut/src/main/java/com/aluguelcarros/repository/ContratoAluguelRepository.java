package com.aluguelcarros.repository;

import com.aluguelcarros.model.ContratoAluguel;

import io.micronaut.data.annotation.Query;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContratoAluguelRepository extends CrudRepository<ContratoAluguel, Long> {

    // Exemplo: Buscar todos os contratos de um cliente específico
    // O Micronaut entende a associação se houver um campo 'cliente' na sua Entity
    @Query("SELECT c FROM ContratoAluguel c JOIN c.pedido p JOIN p.cliente cl WHERE cl.cpf = :cpf")
    List<ContratoAluguel> findByCpfDoCliente(String cpf);

    // Exemplo: Buscar contrato pelo tipo (conforme seu diagrama)
    Optional<ContratoAluguel> findByTipoContrato(String tipoContrato);
}