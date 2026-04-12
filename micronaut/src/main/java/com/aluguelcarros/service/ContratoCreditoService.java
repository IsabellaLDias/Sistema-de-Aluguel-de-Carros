package com.aluguelcarros.service;

import com.aluguelcarros.model.ContratoCredito;
import com.aluguelcarros.repository.ContratoCreditoRepository;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.util.Optional;

@Singleton
public class ContratoCreditoService {

    private final ContratoCreditoRepository repository;

    public ContratoCreditoService(ContratoCreditoRepository repository) {
        this.repository = repository;
    }

    /**
     * Implementa a lógica de 'concederCredito' do Banco no diagrama.
     */
    @Transactional
    public ContratoCredito salvar(ContratoCredito contratoCredito) {
        // Aqui poderiam ser adicionadas validações de taxa de juros
        // ou verificações de limite de crédito do cliente.
        return repository.save(contratoCredito);
    }

    public Optional<ContratoCredito> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}