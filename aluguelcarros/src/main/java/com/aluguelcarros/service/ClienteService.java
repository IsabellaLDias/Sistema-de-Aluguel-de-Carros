package com.aluguelcarros.service;

import org.springframework.stereotype.Service;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.dto.ClienteDTO;
import com.aluguelcarros.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ClienteService {

    private final List<Cliente> clientes = new ArrayList<>();
    private final AtomicLong contador = new AtomicLong();

    public Cliente criar(ClienteDTO dto) {
        Cliente c = new Cliente();
        c.setId(contador.incrementAndGet());
        c.setNome(dto.nome);
        c.setCpf(dto.cpf);
        c.setRg(dto.rg);
        c.setEndereco(dto.endereco);
        c.setProfissao(dto.profissao);

        clientes.add(c);
        return c;
    }

    public List<Cliente> listar() {
        return clientes;
    }

    public Cliente atualizar(Long id, ClienteDTO dto) {
        for (Cliente c : clientes) {
            if (c.getId().equals(id)) {
                c.setNome(dto.nome);
                c.setCpf(dto.cpf);
                c.setRg(dto.rg);
                c.setEndereco(dto.endereco);
                c.setProfissao(dto.profissao);
                return c;
            }
        }
        throw new ResourceNotFoundException("Cliente não encontrado");
    }

    public boolean deletar(Long id) {
        boolean removido = clientes.removeIf(c -> c.getId().equals(id));
        if (!removido) {
            throw new ResourceNotFoundException("Cliente não encontrado");
        }
        return true;
    }
}