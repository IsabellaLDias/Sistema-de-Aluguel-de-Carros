package com.aluguelcarros.service;

import com.aluguelcarros.model.ContratoAluguel;
import com.aluguelcarros.model.ContratoCredito;
import com.aluguelcarros.model.PedidoAluguel;
import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.repository.ContratoAluguelRepository;
import jakarta.inject.Singleton;
import jakarta.persistence.OneToOne;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

@Singleton
public class ContratoAluguelService {

    private final ContratoAluguelRepository contratoRepository;
    @OneToOne
private ContratoCredito contratoCredito;

// E o seu respectivo getter/setter
    public ContratoCredito getContratoCredito() {
        return contratoCredito;
    }

    public void setContratoCredito(ContratoCredito contratoCredito) {
        this.contratoCredito = contratoCredito;
    }


    public ContratoAluguelService(ContratoAluguelRepository contratoRepository) {
        this.contratoRepository = contratoRepository;
    }

    /**
     * Gera um contrato a partir de um pedido aprovado.
     * Reflete a associação "PedidoAluguel gera ContratoAluguel" do diagrama.
     */
    @Transactional
    public ContratoAluguel gerarContrato(PedidoAluguel pedido, List<Automovel> veiculos) {
        ContratoAluguel contrato = new ContratoAluguel();
        contrato.setDataInicio(LocalDate.now());
        contrato.setDataFim(LocalDate.now().plusMonths(pedido.getPrazoMeses()));
        contrato.setTipoContrato("PADRAO");
        
        // No diagrama: ContratoAluguel inclui Automovel (Agregação)
        contrato.setAutomoveis(veiculos);
        
        return contratoRepository.save(contrato);
    }

    /**
     * Implementa o método +executarContrato() do diagrama.
     */
    @Transactional
    public void executarContrato(Long contratoId) {
        contratoRepository.findById(contratoId).ifPresent(contrato -> {
            // Lógica para ativar o contrato, emitir avisos, etc.
            System.out.println("Executando contrato tipo: " + contrato.getTipoContrato());
        });
    }
}