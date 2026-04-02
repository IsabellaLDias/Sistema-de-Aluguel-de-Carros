const API = "http://localhost:8080/pedidos";

async function criarPedido() {
    const clienteId = document.getElementById("clienteId").value;
    const prazo = document.getElementById("prazo").value;
    const valor = document.getElementById("valor").value;

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

    listarPedidos();
}

async function listarPedidos() {
    const res = await fetch(API);
    const pedidos = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    pedidos.forEach(p => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>ID:</strong> ${p.id} <br>
            <strong>Cliente:</strong> ${p.clienteId} <br>
            <strong>Prazo:</strong> ${p.prazoMeses} meses <br>
            <strong>Valor:</strong> R$ ${p.valorPrevisto} <br>
            <strong>Status:</strong> ${p.status}
        `;

        lista.appendChild(li);
    });
}

// carrega automaticamente ao abrir
listarPedidos();