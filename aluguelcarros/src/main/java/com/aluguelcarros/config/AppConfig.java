package com.aluguelcarros.config;

import org.springframework.stereotype.Component;

@Component
public class AppConfig {

    public String getNomeSistema() {
        return "Sistema de Aluguel de Carros";
    }
}