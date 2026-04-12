package com.aluguelcarros.controller;

import com.aluguelcarros.model.ContratoCredito;
import com.aluguelcarros.service.ContratoCreditoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;

@Controller("/contratos-credito")
@ExecuteOn(TaskExecutors.IO)
public class ContratoCreditoController {

    private final ContratoCreditoService creditoService;

    public ContratoCreditoController(ContratoCreditoService creditoService) {
        this.creditoService = creditoService;
    }

    @Post
    public HttpResponse<ContratoCredito> concederCredito(@Body ContratoCredito credito) {
        // Implementa a lógica do Banco.concederCredito() do diagrama
        return HttpResponse.created(creditoService.salvar(credito));
    }

    @Get("/{id}")
    public HttpResponse<ContratoCredito> buscar(Long id) {
        return creditoService.buscarPorId(id)
                .map(HttpResponse::ok)
                .orElse(HttpResponse.notFound());
    }
}