package com.aluguelcarros.controller;

import org.springframework.web.bind.annotation.*;
import com.aluguelcarros.service.PedidoAluguelService;
import com.aluguelcarros.dto.PedidoAluguelDTO;
import com.aluguelcarros.model.PedidoAluguel;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoAluguelController {

    private final PedidoAluguelService service;

    public PedidoAluguelController(PedidoAluguelService service) {
        this.service = service;
    }

    @PostMapping
    public PedidoAluguel criar(@RequestBody PedidoAluguelDTO dto) {
        return service.criar(dto);
    }

    @GetMapping
    public List<PedidoAluguel> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PedidoAluguel buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public PedidoAluguel atualizar(@PathVariable Long id, @RequestBody PedidoAluguelDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public boolean deletar(@PathVariable Long id) {
        return service.deletar(id);
    }
}