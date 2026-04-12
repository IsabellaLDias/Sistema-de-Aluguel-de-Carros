package com.aluguelcarros.service;

import com.aluguelcarros.model.ContratoAluguel;
import com.aluguelcarros.model.PedidoAluguel;
import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.repository.ContratoAluguelRepository;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Singleton
public class ContratoAluguelService {

    private final ContratoAluguelRepository contratoRepository;

    // Removi o contratoCredito daqui, pois ele deve estar dentro da ENTIDADE ContratoAluguel
    // e não ser injetado no Service.

    public ContratoAluguelService(ContratoAluguelRepository contratoRepository) {
        this.contratoRepository = contratoRepository;
    }

    public List<ContratoAluguel> listar() {
        return (List<ContratoAluguel>) contratoRepository.findAll();
    }

    public Optional<ContratoAluguel> buscarPorId(Long id) {
        return contratoRepository.findById(id);
    }

    public ContratoAluguel salvar(ContratoAluguel contrato) {
        return contratoRepository.save(contrato);
    }

    /**
     * Gera um contrato a partir de um pedido aprovado.
     */
    @Transactional
    public ContratoAluguel gerarContrato(PedidoAluguel pedido, List<Automovel> veiculos) {
        ContratoAluguel contrato = new ContratoAluguel();
        
        // Conversão de tipos: No seu UML está Date, mas recomendo LocalDate
        contrato.setDataInicio(LocalDate.now()); 
        contrato.setDataFim(LocalDate.now().plusMonths(pedido.getPrazoMeses()));
        
        contrato.setTipoContrato("PADRAO");
        contrato.setPedido(pedido); // Vincula o pedido ao contrato
        contrato.setAutomoveis(veiculos);
        
        return contratoRepository.save(contrato);
    }

    /**
     * Implementa o método +executarContrato() do diagrama.
     */
    @Transactional
    public void executarContrato(Long contratoId) {
        contratoRepository.findById(contratoId).ifPresent(contrato -> {
            // Lógica de negócio: Ex: mudar status de disponibilidade dos carros incluídos
            System.out.println("Executando contrato ID: " + contrato.getId());
        });
    }
}