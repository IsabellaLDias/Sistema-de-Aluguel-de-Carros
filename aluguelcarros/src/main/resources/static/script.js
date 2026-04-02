const API = "http://localhost:8080/pedidos";

async function criarPedido() {
    const clienteId = document.getElementById("clienteId").value;
    const prazo = document.getElementById("prazo").value;
    const valor = document.getElementById("valor").value;

    if (!clienteId || !prazo || !valor) {
        alert("Preencha todos os campos");
        return;
    }

    const botao = document.querySelector(".btn-create");
    botao.disabled = true;
    botao.innerHTML = "Criando...";

    try {
        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clienteId: Number(clienteId),
                prazoMeses: Number(prazo),
                valorPrevisto: Number(valor)
            })
        });

        document.getElementById("clienteId").value = "";
        document.getElementById("prazo").value = "";
        document.getElementById("valor").value = "";

        listarPedidos();
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        alert("Erro ao criar pedido");
    } finally {
        botao.disabled = false;
        botao.innerHTML = "Criar Pedido";
    }
}

async function listarPedidos() {
    const lista = document.getElementById("lista");
    const btnAtualizar = document.querySelector(".btn-refresh");

    btnAtualizar.disabled = true;
    lista.innerHTML = '<div class="loading"><span class="spinner"></span></div>';

    try {
        const res = await fetch(API);
        const pedidos = await res.json();

        lista.innerHTML = "";

        if (pedidos.length === 0) {
            lista.innerHTML = '<div class="empty-state">Nenhum pedido encontrado</div>';
            return;
        }

        pedidos.forEach(p => {
            const statusClass = p.status.toLowerCase();
            const pedidoDiv = document.createElement("div");
            pedidoDiv.className = "order-card";

            const valorFormatado = p.valorPrevisto.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

            pedidoDiv.innerHTML = `
                <div class="order-header">
                    <div class="order-id">Pedido #${p.id}</div>
                    <div class="status-badge status-${statusClass}">${p.status}</div>
                </div>
                <div class="order-grid">
                    <div class="order-field">
                        <span class="field-label">Cliente</span>
                        <span class="field-value">${p.clienteId}</span>
                    </div>
                    <div class="order-field">
                        <span class="field-label">Prazo</span>
                        <span class="field-value">${p.prazoMeses} meses</span>
                    </div>
                    <div class="order-field">
                        <span class="field-label">Valor</span>
                        <span class="field-value">${valorFormatado}</span>
                    </div>
                </div>
            `;

            lista.appendChild(pedidoDiv);
        });
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        lista.innerHTML = '<div class="error-state">Erro ao buscar pedidos</div>';
    } finally {
        btnAtualizar.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    listarPedidos();
});