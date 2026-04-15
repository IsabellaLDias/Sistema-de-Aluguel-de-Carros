package com.aluguelcarros.service;

import com.aluguelcarros.dto.AutomovelDTO;
import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.repository.AutomovelRepository;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Singleton
public class AutomovelService {

    private final AutomovelRepository repository;

    public AutomovelService(AutomovelRepository repository) {
        this.repository = repository;
    }

    public List<Automovel> listarTodos() {
        return (List<Automovel>) repository.findAll();
    }

    public Optional<Automovel> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Automovel salvar(Automovel automovel) {
        return repository.save(automovel);
    }

    @Transactional
    public Automovel criar(AutomovelDTO dto) {
        Automovel automovel = new Automovel();
        mapearDtoParaEntidade(dto, automovel);
        return repository.save(automovel);
    }

    @Transactional
    public Optional<Automovel> atualizar(Long id, AutomovelDTO dto) {
        return repository.findById(id).map(existente -> {
            mapearDtoParaEntidade(dto, existente);
            return repository.save(existente);
        });
    }

    @Transactional
    public void deletar(Long id) {
        repository.deleteById(id);
    }

    private void mapearDtoParaEntidade(AutomovelDTO dto, Automovel entidade) {
        if (dto.getMarca() != null) entidade.setMarca(dto.getMarca());
        if (dto.getModelo() != null) entidade.setModelo(dto.getModelo());
        if (dto.getAno() != null) entidade.setAno(dto.getAno());
        if (dto.getPlaca() != null) entidade.setPlaca(dto.getPlaca());
        if (dto.getMatricula() != null) entidade.setMatricula(dto.getMatricula());
        
        if (dto.getImagemBase64() != null && !dto.getImagemBase64().isEmpty()) {
            try {
                byte[] decodedBytes = Base64.getDecoder().decode(dto.getImagemBase64());
                entidade.setImagem(decodedBytes);
            } catch (IllegalArgumentException e) {
            }
        }
    }
}