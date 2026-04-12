package com.aluguelcarros.controller;

import com.aluguelcarros.model.Agente;
import com.aluguelcarros.service.AgenteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import java.util.List;

@Controller("/agentes") // Define a rota base
public class AgenteController {

    private final AgenteService agenteService;

    // Injeção de dependência via construtor
    public AgenteController(AgenteService agenteService) {
        this.agenteService = agenteService;
    }

    @Get
    public List<Agente> listarTodos() {
        return agenteService.listar();
    }

    @Get("/{id}")
    public HttpResponse<Agente> buscarPorId(Long id) {
        return agenteService.buscarPorId(id)
                .map(Agente -> HttpResponse.ok(Agente))
                .orElse(HttpResponse.notFound());
    }

    @Post
    public HttpResponse<Agente> salvar(@Body Agente agente) {
        Agente novoAgente = agenteService.salvar(agente);
        return HttpResponse.created(novoAgente);
    }

    @Delete("/{id}")
    public HttpResponse<?> deletar(Long id) {
        agenteService.deletar(id);
        return HttpResponse.noContent();
    }
}