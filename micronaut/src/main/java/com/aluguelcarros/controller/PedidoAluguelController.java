package com.aluguelcarros.controller;

import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import com.aluguelcarros.service.PedidoAluguelService;
import com.aluguelcarros.dto.PedidoAluguelDTO;
import com.aluguelcarros.model.PedidoAluguel;

import java.util.List;

@Controller("/pedidos")
public class PedidoAluguelController {

    private final PedidoAluguelService service;

    public PedidoAluguelController(PedidoAluguelService service) {
        this.service = service;
    }

    @Post
    public PedidoAluguel criar(@Body PedidoAluguelDTO dto) {
        return service.criar(dto);
    }

    @Get
    public List<PedidoAluguel> listar() {
        return service.listar();
    }

    @Get("/{id}")
    public PedidoAluguel buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @Put("/{id}")
    public PedidoAluguel atualizar(@PathVariable Long id, @Body PedidoAluguelDTO dto) {
        return service.atualizar(id, dto);
    }

    @Delete("/{id}")
    public boolean deletar(@PathVariable Long id) {
        return service.deletar(id);
    }
}