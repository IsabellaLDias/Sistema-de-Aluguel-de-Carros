package com.aluguelcarros.security;

public class SecurityConfig {

    public boolean validarToken(String token) {
        return token != null && token.equals("123");
    }
}