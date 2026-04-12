package com.aluguelcarros.service;

import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.repository.AutomovelRepository;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Singleton // Equivalente ao @Service do Spring
public class AutomovelService {

    private final AutomovelRepository repository;

    // No Micronaut, a injeção por construtor é a prática recomendada
    public AutomovelService(AutomovelRepository repository) {
        this.repository = repository;
    }

    public List<Automovel> listarTodos() {
        return (List<Automovel>) repository.findAll();
    }

    public Optional<Automovel> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional // Garante a integridade da transação no banco
    public Automovel salvar(Automovel automovel) {
        return repository.save(automovel);
    }

    @Transactional
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}