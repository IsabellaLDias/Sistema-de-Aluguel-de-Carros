const API_PEDIDOS = "http://localhost:8080/pedidos";
const API_CLIENTES = "http://localhost:8080/clientes";
const API_AUTH = "http://localhost:8080/auth";

let usuarioAtual = {
    nome: "",
    id: null
};

// =========================
// CADASTRO
// =========================
async function cadastrarEEntrar() {
    const login = document.getElementById("regLogin").value.trim();
    const senha = document.getElementById("regSenha").value.trim();
    const nome = document.getElementById("regNome").value.trim();
    const cpf = document.getElementById("regCpf").value.trim();
    const cnpj = document.getElementById("regCnpj").value.trim();
    const rg = document.getElementById("regRg").value.trim();
    const endereco = document.getElementById("regEndereco").value.trim();
    const profissao = document.getElementById("regProfissao").value.trim();

    const eAgente = !document.getElementById("grupo-cnpj").classList.contains("hidden");

    if (!login || !senha || !nome || (eAgente ? !cnpj : !cpf)) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const botao = document.getElementById("btn-acao-principal");
    botao.disabled = true;
    botao.innerText = "Cadastrando...";

    try {
        const resCliente = await fetch(`${API_AUTH}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                login,
                senha,
                nome,
                cpf: eAgente ? null : cpf,
                rg,
                endereco,
                profissao
            })
        });

        if (!resCliente.ok) throw new Error();

        alert("Cadastro realizado com sucesso! Faça login.");

        document.getElementById("regNome").value = "";
        document.getElementById("regCpf").value = "";
        document.getElementById("regCnpj").value = "";
        document.getElementById("regRg").value = "";
        document.getElementById("regEndereco").value = "";
        document.getElementById("regProfissao").value = "";

        mostrarApenasLogin();

    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar.");
    } finally {
        botao.disabled = false;
        botao.innerText = "Cadastrar e Acessar";
    }
}

// =========================
// LOGIN
// =========================
async function realizarLogin() {
    const login = document.getElementById("regLogin").value.trim();
    const senha = document.getElementById("regSenha").value.trim();

    if (!login || !senha) {
        alert("Preencha login e senha!");
        return;
    }

    const botao = document.getElementById("btn-acao-principal");
    botao.disabled = true;
    botao.innerText = "Entrando...";

    try {
        const res = await fetch(`${API_AUTH}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ login, senha })
        });

        if (!res.ok) throw new Error();

        const cliente = await res.json();

        usuarioAtual = {
            id: cliente.id,
            nome: cliente.nome
        };

        entrarSistema();

    } catch (error) {
        console.error(error);
        alert("Login inválido!");
    } finally {
        botao.disabled = false;
        botao.innerText = "Entrar no Sistema";
    }
}

// =========================
// ENTRAR NO SISTEMA
// =========================
function entrarSistema() {
    document.getElementById("userNameDisplay").innerText = usuarioAtual.nome;
    document.querySelector(".auth-overlay").classList.add("hidden");

    document.getElementById("tela-login").classList.add("hidden");
    document.getElementById("tela-principal").classList.remove("hidden");

    listarPedidos();
}

// =========================
// SAIR
// =========================
function sairSistema() {
    usuarioAtual = { nome: "", id: null };
    location.reload();
}

// =========================
// PERFIL
// =========================
async function abrirPerfil() {
    document.getElementById("dashboard-content").classList.add("hidden");
    document.getElementById("tela-perfil").classList.remove("hidden");
    document.querySelector(".estrada").classList.add("hidden");

    try {
        const res = await fetch(`${API_CLIENTES}/${usuarioAtual.id}`);
        const cliente = await res.json();

        document.getElementById("editNome").value = cliente.nome;
        document.getElementById("editCpf").value = cliente.cpf || "";
        document.getElementById("editRg").value = cliente.rg || "";
        document.getElementById("editEndereco").value = cliente.endereco || "";
        document.getElementById("editProfissao").value = cliente.profissao || "";

    } catch {
        alert("Erro ao carregar perfil");
        voltarDashboard();
    }
}

function voltarDashboard() {
    document.getElementById("tela-perfil").classList.add("hidden");
    document.getElementById("dashboard-content").classList.remove("hidden");
    document.querySelector(".estrada").classList.remove("hidden");
}

async function salvarPerfil() {
    const dto = {
        nome: document.getElementById("editNome").value.trim(),
        cpf: document.getElementById("editCpf").value.trim(),
        rg: document.getElementById("editRg").value.trim(),
        endereco: document.getElementById("editEndereco").value.trim(),
        profissao: document.getElementById("editProfissao").value.trim()
    };

    try {
        await fetch(`${API_CLIENTES}/${usuarioAtual.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        alert("Dados atualizados!");
        voltarDashboard();

    } catch {
        alert("Erro ao salvar.");
    }
}

async function excluirConta() {
    if (!confirm("Deseja excluir sua conta?")) return;

    await fetch(`${API_CLIENTES}/${usuarioAtual.id}`, {
        method: "DELETE"
    });

    alert("Conta excluída.");
    sairSistema();
}

// =========================
// PEDIDOS
// =========================
async function criarPedido() {
    const prazo = document.getElementById("prazo").value;
    const valor = document.getElementById("valor").value;

    if (!prazo || !valor) {
        alert("Preencha os campos!");
        return;
    }

    await fetch(API_PEDIDOS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            clienteId: usuarioAtual.id,
            prazoMeses: Number(prazo),
            valorPrevisto: Number(valor)
        })
    });

    listarPedidos();
}

async function listarPedidos() {
    const lista = document.getElementById("lista");

    const res = await fetch(API_PEDIDOS);
    const todos = await res.json();

    const pedidos = todos.filter(p => p.clienteId === usuarioAtual.id);

    lista.innerHTML = "";

    if (pedidos.length === 0) {
        lista.innerHTML = "<p>Você não possui pedidos.</p>";
        return;
    }

    pedidos.forEach(p => {
        const div = document.createElement("div");
        div.className = "order-card";

        const valorFormatado = p.valorPrevisto.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const statusClass = p.status ? p.status.toLowerCase().trim() : "pendente";

        div.innerHTML = `
            <div class="order-header">
                <div class="order-id">Pedido ID #${p.id}</div>
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

        lista.appendChild(div);
    });
}

// =========================
// UI
// =========================
function mostrarCadastro(tipo) {
    document.getElementById("tela-selecao").classList.add("hidden");
    document.getElementById("tela-login").classList.remove("hidden");
    document.getElementById("campos-extras-cadastro").classList.remove("hidden");
    document.getElementById("titulo-cadastro").innerText = "Cadastro";
    document.getElementById("subtitulo-cadastro").innerText = "Preencha os dados para acessar o sistema";
    document.getElementById("btn-acao-principal").innerText = "Cadastrar e Acessar";

    if (tipo === 'cliente') {
        document.getElementById("grupo-cpf").classList.remove("hidden");
        document.getElementById("grupo-cnpj").classList.add("hidden");
    } else {
        document.getElementById("grupo-cpf").classList.add("hidden");
        document.getElementById("grupo-cnpj").classList.remove("hidden");
    }
}

function mostrarApenasLogin() {
    document.getElementById("tela-selecao").classList.add("hidden");
    document.getElementById("tela-login").classList.remove("hidden");
    document.getElementById("campos-extras-cadastro").classList.add("hidden");

    document.getElementById("titulo-cadastro").innerText = "Login";
    document.getElementById("subtitulo-cadastro").innerText = "Entre com suas credenciais";
    document.getElementById("btn-acao-principal").innerText = "Entrar no Sistema";
}

function executarAcaoPrincipal() {
    const modoLogin = document.getElementById("campos-extras-cadastro").classList.contains("hidden");

    if (modoLogin) {
        realizarLogin();
    } else {
        cadastrarEEntrar();
    }
}