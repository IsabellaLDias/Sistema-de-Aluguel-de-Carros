const API = "http://localhost:8080/pedidos";
const API_CLIENTES = "http://localhost:8080/clientes";

let usuarioAtual = {
    nome: "",
    id: null
};

async function cadastrarEEntrar() {
    const nome = document.getElementById("regNome").value.trim();
    const cpf = document.getElementById("regCpf").value.trim();
    const rg = document.getElementById("regRg").value.trim();
    const endereco = document.getElementById("regEndereco").value.trim();
    const profissao = document.getElementById("regProfissao").value.trim();

    if (!nome || !cpf) {
        alert("Por favor, preencha pelo menos Nome e CPF.");
        return;
    }

    const botao = document.querySelector("#tela-login .btn-create");
    botao.disabled = true;
    botao.innerHTML = "Cadastrando...";

    try {
        const res = await fetch(API_CLIENTES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                cpf: cpf,
                rg: rg,
                endereco: endereco,
                profissao: profissao
            })
        });

        if (!res.ok) throw new Error("Falha ao cadastrar cliente.");

        const clienteCriado = await res.json();

        usuarioAtual.nome = clienteCriado.nome;
        usuarioAtual.id = clienteCriado.id;

        document.getElementById("userNameDisplay").innerText = usuarioAtual.nome;

        document.getElementById("tela-login").classList.add("hidden");
        document.getElementById("tela-principal").classList.remove("hidden");

        listarPedidos();
    } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Erro ao cadastrar. Verifique se o servidor está rodando.");
    } finally {
        botao.disabled = false;
        botao.innerHTML = "Cadastrar e Acessar";
    }
}

function sairSistema() {
    usuarioAtual = { nome: "", id: null };

    document.getElementById("regNome").value = "";
    document.getElementById("regCpf").value = "";
    document.getElementById("regRg").value = "";
    document.getElementById("regEndereco").value = "";
    document.getElementById("regProfissao").value = "";

    document.getElementById("tela-principal").classList.add("hidden");
    document.getElementById("tela-login").classList.remove("hidden");
}

async function criarPedido() {
    const prazo = document.getElementById("prazo").value;
    const valor = document.getElementById("valor").value;

    if (!prazo || !valor) {
        alert("Preencha todos os campos do pedido");
        return;
    }

    const botao = document.querySelector("#tela-principal .btn-create");
    botao.disabled = true;
    botao.innerHTML = "Criando...";

    try {
        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clienteId: usuarioAtual.id,
                prazoMeses: Number(prazo),
                valorPrevisto: Number(valor)
            })
        });

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

    if (!usuarioAtual.id) return;

    btnAtualizar.disabled = true;
    lista.innerHTML = '<div class="loading"><span class="spinner"></span></div>';

    try {
        const res = await fetch(API);
        const todosPedidos = await res.json();

        const pedidosDoCliente = todosPedidos.filter(p => p.clienteId === usuarioAtual.id);

        lista.innerHTML = "";

        if (pedidosDoCliente.length === 0) {
            lista.innerHTML = '<div class="empty-state">Você ainda não possui pedidos.</div>';
            return;
        }

        pedidosDoCliente.forEach(p => {
            const statusClass = p.status.toLowerCase().trim();
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
        lista.innerHTML = '<div class="error-state">Erro ao buscar pedidos do servidor.</div>';
    } finally {
        btnAtualizar.disabled = false;
    }
}