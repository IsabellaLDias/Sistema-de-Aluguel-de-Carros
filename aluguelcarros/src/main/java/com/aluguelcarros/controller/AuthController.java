package com.aluguelcarros.controller;

import org.springframework.web.bind.annotation.*;

import com.aluguelcarros.dto.LoginDTO;
import com.aluguelcarros.model.Usuario;
import com.aluguelcarros.repository.UsuarioRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioRepository repository;

    public AuthController(UsuarioRepository repository) {
        this.repository = repository;
    }
    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {
    return repository.save(usuario);
}

    @PostMapping("/login")
    public Usuario login(@RequestBody LoginDTO dto) {
        return repository.findByLogin(dto.getLogin())
                .filter(u -> u.getSenha().equals(dto.getSenha()))
                .orElseThrow(() -> new RuntimeException("Login inválido"));
    }
}