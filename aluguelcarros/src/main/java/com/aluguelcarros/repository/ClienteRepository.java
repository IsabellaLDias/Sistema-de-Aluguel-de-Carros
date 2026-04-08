package com.aluguelcarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aluguelcarros.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}