package com.aluguelcarros.controller;

import com.aluguelcarros.model.Agente;
import com.aluguelcarros.service.AgenteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import java.util.List;

@Controller("/agentes")
public class AgenteController {

    private final AgenteService agenteService;

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
                .map(a -> HttpResponse.ok(a))
                .orElse(HttpResponse.notFound());
    }

    @Post
    public HttpResponse<Agente> salvar(@Body Agente agente) {
        Agente novoAgente = agenteService.salvar(agente);
        return HttpResponse.created(novoAgente);
    }

    @Put("/{id}")
    public HttpResponse<Agente> atualizar(@PathVariable Long id, @Body Agente agente) {
        return agenteService.buscarPorId(id).map(existente -> {
            if (agente.getNome() != null) existente.setNome(agente.getNome());
            if (agente.getCnpj() != null) existente.setCnpj(agente.getCnpj());
            return HttpResponse.ok(agenteService.salvar(existente));
        }).orElse(HttpResponse.notFound());
    }

    @Delete("/{id}")
    public HttpResponse<?> deletar(Long id) {
        agenteService.deletar(id);
        return HttpResponse.noContent();
    }
}