package com.aluguelcarros.config;

import jakarta.inject.Singleton;

@Singleton
public class AppConfig {

    public String getNomeSistema() {
        return "Sistema de Aluguel de Carros";
    }
}