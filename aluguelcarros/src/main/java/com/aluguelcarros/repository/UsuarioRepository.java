package com.aluguelcarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.aluguelcarros.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByLogin(String login);
}