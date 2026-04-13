package com.aluguelcarros.controller;

import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;

import com.aluguelcarros.dto.ClienteDTO;
import com.aluguelcarros.dto.LoginDTO;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.repository.ClienteRepository;

@Controller("/auth")
public class AuthController {

    private final ClienteRepository repository;

    public AuthController(ClienteRepository repository) {
        this.repository = repository;
    }
    @Post("/register")
    public Cliente register(@Body ClienteDTO dto) {
        if (dto.getLogin() == null || dto.getLogin().isBlank() || dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Login e senha são obrigatórios");
        }
        if (repository.findByLogin(dto.getLogin()).isPresent()) {
            throw new HttpStatusException(HttpStatus.CONFLICT, "Login já cadastrado");
        }

        Cliente cliente = new Cliente();
        cliente.setLogin(dto.getLogin());
        cliente.setSenha(dto.getSenha());
        cliente.setNome(dto.getNome());
        cliente.setCpf(dto.getCpf());
        cliente.setRg(dto.getRg());
        cliente.setEndereco(dto.getEndereco());
        cliente.setProfissao(dto.getProfissao());
        return repository.save(cliente);
    }

    @Post("/login")
    public Cliente login(@Body LoginDTO dto) {
        if (dto.getLogin() == null || dto.getLogin().isBlank() || dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Login e senha são obrigatórios");
        }
        return repository.findByLogin(dto.getLogin())
                .filter(u -> u.getSenha().equals(dto.getSenha()))
                .orElseThrow(() -> new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login inválido"));
    }
}