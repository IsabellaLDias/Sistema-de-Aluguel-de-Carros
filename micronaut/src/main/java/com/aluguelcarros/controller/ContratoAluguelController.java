package com.aluguelcarros.controller;

import com.aluguelcarros.dto.ContratoAluguelCreateDTO;
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

    @Get("/{id}")
    public HttpResponse<ContratoAluguel> buscarPorId(Long id) {
        return contratoService.buscarPorId(id)
                .map(HttpResponse::ok)
                .orElse(HttpResponse.notFound());
    }

    /**
     * Cria um contrato completo via DTO:
     * - vincula ao pedido aprovado
     * - registra propriedade dos veículos conforme tipo (CLIENTE / EMPRESA / BANCO)
     * - vincula contrato de crédito quando tipo = BANCO
     */
    @Post
    public HttpResponse<ContratoAluguel> criar(@Body ContratoAluguelCreateDTO dto) {
        return HttpResponse.created(contratoService.criarContrato(dto));
    }

    /**
     * Executa um contrato (operação +executarContrato() do diagrama de classe).
     */
    @Post("/{id}/executar")
    public HttpResponse<Void> executar(Long id) {
        contratoService.executarContrato(id);
        return HttpResponse.ok();
    }
}