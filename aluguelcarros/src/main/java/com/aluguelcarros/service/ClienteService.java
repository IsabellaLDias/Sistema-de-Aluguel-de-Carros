package com.aluguelcarros.service;

import org.springframework.stereotype.Service;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.dto.ClienteDTO;
import com.aluguelcarros.exception.ResourceNotFoundException;
import com.aluguelcarros.repository.ClienteRepository;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public Cliente criar(ClienteDTO dto) {
        Cliente c = new Cliente();
        c.setNome(dto.nome);
        c.setCpf(dto.cpf);
        c.setRg(dto.rg);
        c.setEndereco(dto.endereco);
        c.setProfissao(dto.profissao);
        return repository.save(c);
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }

    public Cliente atualizar(Long id, ClienteDTO dto) {
        Cliente c = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        c.setNome(dto.nome);
        c.setCpf(dto.cpf);
        c.setRg(dto.rg);
        c.setEndereco(dto.endereco);
        c.setProfissao(dto.profissao);
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