package com.aluguelcarros.controller;

import org.springframework.web.bind.annotation.*;
import com.aluguelcarros.service.ClienteService;
import com.aluguelcarros.dto.ClienteDTO;
import com.aluguelcarros.model.Cliente;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @PostMapping
    public Cliente criar(@RequestBody ClienteDTO dto) {
        return service.criar(dto);
    }

    @GetMapping
    public List<Cliente> listar() {
        return service.listar();
    }

    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Long id, @RequestBody ClienteDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public boolean deletar(@PathVariable Long id) {
        return service.deletar(id);
    }
}