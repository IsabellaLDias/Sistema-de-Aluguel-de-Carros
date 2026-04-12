package com.aluguelcarros.controller;

import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;

import com.aluguelcarros.dto.LoginDTO;
import com.aluguelcarros.model.Usuario;
import com.aluguelcarros.repository.UsuarioRepository;

@Controller("/auth")
public class AuthController {

    private final UsuarioRepository repository;

    public AuthController(UsuarioRepository repository) {
        this.repository = repository;
    }
    @Post("/register")
    public Usuario register(@Body Usuario usuario) {
        return repository.save(usuario);
    }

    @Post("/login")
    public Usuario login(@Body LoginDTO dto) {
        return repository.findByLogin(dto.getLogin())
                .filter(u -> u.getSenha().equals(dto.getSenha()))
                .orElseThrow(() -> new RuntimeException("Login inválido"));
    }
}