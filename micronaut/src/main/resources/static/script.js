const API = "http://localhost:8080/pedidos";
const API_CLIENTES = "http://localhost:8080/clientes";

let usuarioAtual = {
    nome: "",
    id: null
};

async function cadastrarEEntrar() {
    // Inputs da tela de cadastro
    const nome = document.getElementById("regNome").value.trim();
    const cpf = document.getElementById("regCpf").value.trim();
    const rg = document.getElementById("regRg").value.trim();
    const endereco = document.getElementById("regEndereco").value.trim();
    const profissao = document.getElementById("regProfissao").value.trim();

    if (!nome || !cpf) {
        alert("Por favor, preencha pelo menos Nome e CPF.");
        return;
    }

    const botao = document.querySelector("#tela-login .btn-primary");
    botao.disabled = true;
    botao.innerHTML = "Cadastrando...";

    try {
        const res = await fetch(API_CLIENTES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, cpf, rg, endereco, profissao })
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
    document.getElementById("tela-perfil").classList.add("hidden"); // Garante que fecha o perfil
    document.getElementById("dashboard-content").classList.remove("hidden"); // Reseta dashboard
    document.getElementById("tela-login").classList.remove("hidden");
}

async function abrirPerfil() {
    document.getElementById("dashboard-content").classList.add("hidden");
    document.getElementById("tela-perfil").classList.remove("hidden");

    try {
        const res = await fetch(`${API_CLIENTES}/${usuarioAtual.id}`);
        if (!res.ok) throw new Error("Erro ao buscar dados.");

        const cliente = await res.json();

        document.getElementById("editNome").value = cliente.nome;
        document.getElementById("editCpf").value = cliente.cpf;
        document.getElementById("editRg").value = cliente.rg;
        document.getElementById("editEndereco").value = cliente.endereco;
        document.getElementById("editProfissao").value = cliente.profissao;
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        alert("Erro ao carregar seus dados. Tente atualizar a página.");
        voltarDashboard();
    }
}

function voltarDashboard() {
    document.getElementById("tela-perfil").classList.add("hidden");
    document.getElementById("dashboard-content").classList.remove("hidden");
}

async function salvarPerfil() {
    const btnSalvar = document.querySelector(".profile-actions .action-save");
    btnSalvar.disabled = true;
    btnSalvar.innerHTML = "Salvando...";

    const dto = {
        nome: document.getElementById("editNome").value.trim(),
        cpf: document.getElementById("editCpf").value.trim(),
        rg: document.getElementById("editRg").value.trim(),
        endereco: document.getElementById("editEndereco").value.trim(),
        profissao: document.getElementById("editProfissao").value.trim()
    };

    if (!dto.nome || !dto.cpf) {
        alert("Nome e CPF são obrigatórios.");
        btnSalvar.disabled = false;
        btnSalvar.innerHTML = "Salvar";
        return;
    }

    try {
        const res = await fetch(`${API_CLIENTES}/${usuarioAtual.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        if (!res.ok) throw new Error("Erro ao atualizar.");

        usuarioAtual.nome = dto.nome;
        document.getElementById("userNameDisplay").innerText = usuarioAtual.nome;

        alert("Dados atualizados com sucesso!");
        voltarDashboard();
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert("Erro ao atualizar dados.");
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.innerHTML = "Salvar";
    }
}

async function excluirConta() {
    const confirmacao = confirm("ATENÇÃO: Tem certeza que deseja excluir sua conta? TODOS os seus pedidos também serão apagados permanentemente.");

    if (!confirmacao) return;

    try {
        const res = await fetch(`${API_CLIENTES}/${usuarioAtual.id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Erro ao excluir conta.");

        alert("Sua conta foi excluída bem-sucedidamente.");
        sairSistema();
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir sua conta. Tente novamente mais tarde.");
    }
}

async function criarPedido() {
    const prazo = document.getElementById("prazo").value;
    const valor = document.getElementById("valor").value;

    if (!prazo || !valor) {
        alert("Preencha prazo e valor do pedido.");
        return;
    }

    const botao = document.querySelector("#dashboard-content .btn-primary");
    botao.disabled = true;
    botao.innerHTML = "Criando...";

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                clienteId: usuarioAtual.id,
                prazoMeses: Number(prazo),
                valorPrevisto: Number(valor)
            })
        });

        if (!res.ok) throw new Error("Erro ao criar pedido.");

        document.getElementById("prazo").value = "";
        document.getElementById("valor").value = "";

        listarPedidos();
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        alert("Erro ao criar pedido. Verifique o servidor.");
    } finally {
        botao.disabled = false;
        botao.innerHTML = "Criar Pedido";
    }
}

async function listarPedidos() {
    const lista = document.getElementById("lista");
    const btnAtualizar = document.querySelector(".card-header .btn-secondary");

    if (!usuarioAtual.id) return;

    btnAtualizar.disabled = true;
    btnAtualizar.innerHTML = "Atualizando...";
    lista.innerHTML = '<div class="loading"><span class="spinner"></span></div>';

    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Erro ao buscar pedidos.");
        const todosPedidos = await res.json();

        const pedidosDoCliente = todosPedidos.filter(p => p.clienteId === usuarioAtual.id);

        lista.innerHTML = "";

        if (pedidosDoCliente.length === 0) {
            lista.innerHTML = '<div class="empty-state">Você ainda não possui pedidos realizados.</div>';
            return;
        }

        pedidosDoCliente.forEach(p => {
            const statusClass = p.status ? p.status.toLowerCase().trim() : "pendente";

            const pedidoDiv = document.createElement("div");
            pedidoDiv.className = "order-card";

            const valorFormatado = p.valorPrevisto.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

            pedidoDiv.innerHTML = `
                <div class="order-header">
                    <div class="order-id">Pedido #${p.id}</div>
                    <div class="status-badge status-${statusClass}">${p.status || 'PENDENTE'}</div>
                </div>
                <div class="order-grid">
                    <div class="order-field">
                        <span class="field-label">Prazo</span>
                        <span class="field-value">${p.prazoMeses} meses</span>
                    </div>
                    <div class="order-field">
                        <span class="field-label">Valor Previsto</span>
                        <span class="field-value">${valorFormatado}</span>
                    </div>
                </div>
            `;

            lista.appendChild(pedidoDiv);
        });
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        lista.innerHTML = '<div class="error-state">Não foi possível carregar os pedidos. Verifique a conexão com o servidor.</div>';
    } finally {
        btnAtualizar.disabled = false;
        btnAtualizar.innerHTML = "Atualizar Lista";
    }
}