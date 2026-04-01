package com.aluguelcarros.controller;

import io.micronaut.http.annotation.*;
import com.aluguelcarros.service.ClienteService;
import com.aluguelcarros.dto.ClienteDTO;
import com.aluguelcarros.model.Cliente;

import java.util.List;

@Controller("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @Post
    public Cliente criar(@Body ClienteDTO dto) {
        return service.criar(dto);
    }

    @Get
    public List<Cliente> listar() {
        return service.listar();
    }

    @Put("/{id}")
    public Cliente atualizar(@PathVariable Long id, @Body ClienteDTO dto) {
        return service.atualizar(id, dto);
    }

    @Delete("/{id}")
    public boolean deletar(@PathVariable Long id) {
        return service.deletar(id);
    }
}