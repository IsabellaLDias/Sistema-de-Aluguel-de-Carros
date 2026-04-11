package com.aluguelcarros.service;

import com.aluguelcarros.model.Agente;
import com.aluguelcarros.model.PedidoAluguel;
import com.aluguelcarros.repository.AgenteRepository;
import com.aluguelcarros.repository.PedidoRepository;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Singleton // Define que o Micronaut gerencie esta classe
public class AgenteService {

    private final AgenteRepository agenteRepository;
    private final PedidoRepository pedidoRepository;

    public AgenteService(AgenteRepository agenteRepository, PedidoRepository pedidoRepository) {
        this.agenteRepository = agenteRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional
public Agente salvar(Agente agente) {
    // Aqui você pode adicionar validações, como verificar se o CNPJ já existe
    return agenteRepository.save(agente);
}
@Transactional
public Optional<PedidoAluguel> avaliarPedido(Long pedidoId, boolean aprovado) {
    return pedidoRepository.findById(pedidoId).map(pedido -> {
        if (aprovado) {
            pedido.setStatus("APROVADO");
        } else {
            pedido.setStatus("REJEITADO");
        }
        return pedidoRepository.update(pedido);
    });
}

    public List<Agente> listar() {
        return (List<Agente>) agenteRepository.findAll();
    }

    public Optional<Agente> buscarPorId(Long id) {
        return agenteRepository.findById(id);
    }

    @Transactional
    public void deletar(Long id) {
        agenteRepository.deleteById(id);
    }

}