package com.aluguelcarros.config;

import io.micronaut.context.annotation.Requires;
import io.micronaut.context.annotation.Value;
import io.micronaut.context.annotation.Context;
import jakarta.annotation.PreDestroy;
import jakarta.inject.Singleton;
import org.h2.tools.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;

@Singleton
@Context
@Requires(property = "h2.console.enabled", value = "true")
public class H2ConsoleServer {
    private static final Logger LOG = LoggerFactory.getLogger(H2ConsoleServer.class);

    private Server webServer;

    public H2ConsoleServer(@Value("${h2.console.port:8082}") int port) {
        try {
            this.webServer = Server.createWebServer(
                    "-web",
                    "-webPort",
                    String.valueOf(port)
            ).start();
            LOG.info("H2 Console iniciado em http://localhost:{}", port);
        } catch (SQLException e) {
            // Nao derruba a API se o console ja estiver em uso por outro processo.
            LOG.warn("Nao foi possivel iniciar o H2 Console na porta {}: {}", port, e.getMessage());
        }
    }

    @PreDestroy
    void stop() {
        if (webServer != null) {
            webServer.stop();
            webServer = null;
        }
    }
}
