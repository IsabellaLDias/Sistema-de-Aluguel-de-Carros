package com.aluguelcarros.controller;

import com.aluguelcarros.model.ContratoAluguel;
import com.aluguelcarros.service.ContratoAluguelService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import java.util.List;

@Controller("/contratos-aluguel")
@ExecuteOn(TaskExecutors.IO)
public class ContratoAluguelController {

    private final ContratoAluguelService contratoService;

    public ContratoAluguelController(ContratoAluguelService contratoService) {
        this.contratoService = contratoService;
    }

    @Get
    public List<ContratoAluguel> listar() {
        return contratoService.listar();
    }

    @Post
    public HttpResponse<ContratoAluguel> criar(@Body ContratoAluguel contrato) {
        return HttpResponse.created(contratoService.salvar(contrato));
    }

    // Endpoint para a operação "executarContrato()" do seu diagrama
    @Post("/{id}/executar")
    public HttpResponse<Void> executar(Long id) {
        contratoService.executarContrato(id);
        return HttpResponse.ok();
    }
}