package com.aluguelcarros.controller;

import com.aluguelcarros.model.Rendimento;
import com.aluguelcarros.repository.RendimentoRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;

import java.util.List;

@Controller("/rendimentos")
@ExecuteOn(TaskExecutors.IO)
public class RendimentoController {

    private final RendimentoRepository repository;

    public RendimentoController(RendimentoRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista todos os rendimentos de um usuário específico.
     * GET /rendimentos/usuario/{usuarioId}
     */
    @Get("/usuario/{usuarioId}")
    public List<Rendimento> listarPorUsuario(@PathVariable Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    /**
     * Cria um novo rendimento associado a um usuário.
     * POST /rendimentos
     * Body: { "entidadeEmpregadora": "...", "valorAuferido": 5000, "usuario": { "id": 1 } }
     */
    @Post
    public HttpResponse<Rendimento> criar(@Body Rendimento rendimento) {
        return HttpResponse.created(repository.save(rendimento));
    }

    /**
     * Remove um rendimento pelo ID.
     * DELETE /rendimentos/{id}
     */
    @Delete("/{id}")
    public HttpResponse<Void> deletar(@PathVariable Long id) {
        repository.deleteById(id);
        return HttpResponse.noContent();
    }
}
