package com.aluguelcarros.controller;

import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.service.AutomovelService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;

import java.util.List;

@Controller("/automoveis")
@ExecuteOn(TaskExecutors.IO)
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @Get
    public List<Automovel> listarTodos() {
        return automovelService.listarTodos();
    }

    @Get("/{id}")
    public HttpResponse<Automovel> buscarPorId(Long id) {
        return automovelService.buscarPorId(id)
                .map(HttpResponse::ok)
                .orElse(HttpResponse.notFound());
    }

    @Post
    public HttpResponse<Automovel> criar(@Body Automovel automovel) {
        Automovel novo = automovelService.salvar(automovel);
        return HttpResponse.created(novo);
    }

    @Put("/{id}")
    public HttpResponse<Automovel> atualizar(@PathVariable Long id, @Body Automovel automovel) {
        return automovelService.buscarPorId(id).map(existente -> {
            existente.setMatricula(automovel.getMatricula());
            existente.setAno(automovel.getAno());
            existente.setMarca(automovel.getMarca());
            existente.setModelo(automovel.getModelo());
            existente.setPlaca(automovel.getPlaca());
            existente.setProprietario(automovel.getProprietario());
            return HttpResponse.ok(automovelService.salvar(existente));
        }).orElse(HttpResponse.notFound());
    }

    @Delete("/{id}")
    public HttpResponse<Void> deletar(@PathVariable Long id) {
        automovelService.deletar(id);
        return HttpResponse.noContent();
    }
}
