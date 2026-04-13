package com.aluguelcarros.controller;

import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;

import com.aluguelcarros.dto.ClienteDTO;
import com.aluguelcarros.dto.LoginDTO;
import com.aluguelcarros.model.Agente;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.repository.AgenteRepository;
import com.aluguelcarros.repository.ClienteRepository;

import java.util.HashMap;
import java.util.Map;

@Controller("/auth")
public class AuthController {

    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;

    public AuthController(ClienteRepository clienteRepository, AgenteRepository agenteRepository) {
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
    }

    // -----------------------------------------------
    // Cadastro de cliente
    // -----------------------------------------------
    @Post("/register")
    public Cliente register(@Body ClienteDTO dto) {
        if (dto.getLogin() == null || dto.getLogin().isBlank()
                || dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Login e senha são obrigatórios");
        }
        if (clienteRepository.findByLogin(dto.getLogin()).isPresent()
                || agenteRepository.findByLogin(dto.getLogin()).isPresent()) {
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
        return clienteRepository.save(cliente);
    }

    // -----------------------------------------------
    // Login unificado (cliente ou agente)
    // Retorna um Map com: id, nome, cnpj (null para cliente)
    // O frontend detecta o tipo pelo campo cnpj
    // -----------------------------------------------
    @Post("/login")
    public Map<String, Object> login(@Body LoginDTO dto) {
        if (dto.getLogin() == null || dto.getLogin().isBlank()
                || dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Login e senha são obrigatórios");
        }

        // Tentar como cliente primeiro
        var clienteOpt = clienteRepository.findByLogin(dto.getLogin());
        if (clienteOpt.isPresent()) {
            Cliente c = clienteOpt.get();
            if (!c.getSenha().equals(dto.getSenha())) {
                throw new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login inválido");
            }
            Map<String, Object> resp = new HashMap<>();
            resp.put("id",   c.getId());
            resp.put("nome", c.getNome());
            resp.put("cnpj", null);           // null => frontend sabe que é cliente
            resp.put("login", c.getLogin());
            return resp;
        }

        // Tentar como agente
        var agenteOpt = agenteRepository.findByLogin(dto.getLogin());
        if (agenteOpt.isPresent()) {
            Agente a = agenteOpt.get();
            if (!a.getSenha().equals(dto.getSenha())) {
                throw new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login inválido");
            }
            Map<String, Object> resp = new HashMap<>();
            resp.put("id",   a.getId());
            resp.put("nome", a.getNome());
            resp.put("cnpj", a.getCnpj());    // cnpj preenchido => frontend sabe que é agente
            resp.put("login", a.getLogin());
            return resp;
        }

        throw new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login inválido");
    }
}