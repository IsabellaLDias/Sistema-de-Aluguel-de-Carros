package com.aluguelcarros.service;

import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.dto.ClienteDTO;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.repository.ClienteRepository;

import java.util.List;
import java.util.stream.StreamSupport;

@Singleton
@Transactional
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public Cliente criar(ClienteDTO dto) {
        Cliente c = new Cliente();
        c.setNome(dto.getNome());
        c.setCpf(dto.getCpf());
        c.setRg(dto.getRg());
        c.setEndereco(dto.getEndereco());
        c.setProfissao(dto.getProfissao());
        return repository.update(c);
    }

    public List<Cliente> listar() {
        return StreamSupport.stream(repository.findAll().spliterator(), false).toList();
    }

    public Cliente atualizar(Long id, ClienteDTO dto) {
        Cliente c = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        c.setNome(dto.getNome());
        c.setCpf(dto.getCpf());
        c.setRg(dto.getRg());
        c.setEndereco(dto.getEndereco());
        c.setProfissao(dto.getProfissao());
        return repository.save(c);
    }

    public boolean deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado");
        }
        repository.deleteById(id);
        return true;
    }
}