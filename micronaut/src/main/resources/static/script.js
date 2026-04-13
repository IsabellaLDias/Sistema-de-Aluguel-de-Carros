// ========================
// APIs
// ========================
const API_PEDIDOS          = "http://localhost:8080/pedidos";
const API_CLIENTES         = "http://localhost:8080/clientes";
const API_AGENTES          = "http://localhost:8080/agentes";
const API_AUTH             = "http://localhost:8080/auth";
const API_AUTOMOVEIS       = "http://localhost:8080/automoveis";
const API_CONTRATOS        = "http://localhost:8080/contratos-aluguel";
const API_CONTRATOS_CREDIT = "http://localhost:8080/contratos-credito";
const API_RENDIMENTOS      = "http://localhost:8080/rendimentos";

// ========================
// ESTADO GLOBAL
// ========================
let usuarioAtual = {
    id:   null,
    nome: "",
    tipo: null,   // "cliente" ou "agente"
    cnpj: null
};

// ========================
// TOAST
// ========================
function showToast(msg, tipo = "sucesso") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = `toast toast-${tipo}`;
    setTimeout(() => t.classList.add("hidden"), 3500);
}

// ========================
// MODAL
// ========================
function fecharModal(id) { document.getElementById(id).classList.add("hidden"); }
function abrirModal(id)  { document.getElementById(id).classList.remove("hidden"); }

// ========================
// FORMATAÇÃO
// ========================
function formatarMoeda(v) {
    return (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatarData(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("pt-BR");
}

// ========================
// AUTH: TELAS
// ========================
function mostrarCadastro(tipo) {
    document.getElementById("tela-selecao").classList.add("hidden");
    document.getElementById("tela-login").classList.remove("hidden");
    document.getElementById("campos-extras-cadastro").classList.remove("hidden");
    document.getElementById("titulo-cadastro").innerText = tipo === "cliente" ? "Cadastro de Cliente" : "Cadastro de Agente";
    document.getElementById("subtitulo-cadastro").innerText = "Preencha os dados para criar sua conta";
    document.getElementById("btn-acao-principal").innerText = "Cadastrar e Acessar";
    document.getElementById("btn-acao-principal").dataset.acao = "cadastrar";
    document.getElementById("btn-acao-principal").dataset.tipo = tipo;

    if (tipo === "cliente") {
        document.getElementById("grupo-cpf").classList.remove("hidden");
        document.getElementById("grupo-cnpj").classList.add("hidden");
        document.getElementById("campos-cliente-extra").classList.remove("hidden");
    } else {
        document.getElementById("grupo-cpf").classList.add("hidden");
        document.getElementById("grupo-cnpj").classList.remove("hidden");
        document.getElementById("campos-cliente-extra").classList.add("hidden");
    }
}

function mostrarApenasLogin() {
    document.getElementById("tela-selecao").classList.add("hidden");
    document.getElementById("tela-login").classList.remove("hidden");
    document.getElementById("campos-extras-cadastro").classList.add("hidden");
    document.getElementById("titulo-cadastro").innerText = "Login";
    document.getElementById("subtitulo-cadastro").innerText = "Entre com suas credenciais";
    document.getElementById("btn-acao-principal").innerText = "Entrar no Sistema";
    document.getElementById("btn-acao-principal").dataset.acao = "login";
}

function executarAcaoPrincipal() {
    const acao = document.getElementById("btn-acao-principal").dataset.acao || "login";
    if (acao === "login") {
        realizarLogin();
    } else {
        const tipo = document.getElementById("btn-acao-principal").dataset.tipo || "cliente";
        tipo === "cliente" ? cadastrarCliente() : cadastrarAgente();
    }
}

// ========================
// CADASTRO — CLIENTE
// ========================
async function cadastrarCliente() {
    const login    = document.getElementById("regLogin").value.trim();
    const senha    = document.getElementById("regSenha").value.trim();
    const nome     = document.getElementById("regNome").value.trim();
    const cpf      = document.getElementById("regCpf").value.trim();
    const rg       = document.getElementById("regRg").value.trim();
    const endereco = document.getElementById("regEndereco").value.trim();
    const profissao= document.getElementById("regProfissao").value.trim();

    if (!login || !senha || !nome || !cpf) {
        showToast("Preencha todos os campos obrigatórios!", "erro"); return;
    }

    const botao = document.getElementById("btn-acao-principal");
    botao.disabled = true; botao.innerText = "Cadastrando...";

    try {
        const res = await fetch(`${API_AUTH}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, senha, nome, cpf, rg, endereco, profissao })
        });
        if (!res.ok) throw new Error(await res.text() || "Erro ao cadastrar.");
        showToast("Cadastro realizado! Faça login.");
        mostrarApenasLogin();
        document.getElementById("regLogin").value = login;
    } catch (e) {
        showToast(e.message || "Erro ao cadastrar.", "erro");
    } finally {
        botao.disabled = false; botao.innerText = "Cadastrar e Acessar";
    }
}

// ========================
// CADASTRO — AGENTE
// ========================
async function cadastrarAgente() {
    const login = document.getElementById("regLogin").value.trim();
    const senha = document.getElementById("regSenha").value.trim();
    const nome  = document.getElementById("regNome").value.trim();
    const cnpj  = document.getElementById("regCnpj").value.trim();

    if (!login || !senha || !nome || !cnpj) {
        showToast("Preencha todos os campos obrigatórios!", "erro"); return;
    }

    const botao = document.getElementById("btn-acao-principal");
    botao.disabled = true; botao.innerText = "Cadastrando...";

    try {
        const res = await fetch(API_AGENTES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, senha, nome, cnpj })
        });
        if (!res.ok) throw new Error("Erro ao cadastrar agente.");
        showToast("Cadastro realizado! Faça login.");
        mostrarApenasLogin();
        document.getElementById("regLogin").value = login;
    } catch (e) {
        showToast(e.message || "Erro ao cadastrar.", "erro");
    } finally {
        botao.disabled = false; botao.innerText = "Cadastrar e Acessar";
    }
}

// ========================
// LOGIN
// ========================
async function realizarLogin() {
    const login = document.getElementById("regLogin").value.trim();
    const senha = document.getElementById("regSenha").value.trim();

    if (!login || !senha) { showToast("Preencha login e senha!", "erro"); return; }

    const botao = document.getElementById("btn-acao-principal");
    botao.disabled = true; botao.innerText = "Entrando...";

    try {
        const res = await fetch(`${API_AUTH}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, senha })
        });
        if (!res.ok) throw new Error("Login inválido!");

        const usuario = await res.json();
        const eAgente = usuario.cnpj != null && usuario.cnpj !== "";

        usuarioAtual = {
            id:   usuario.id,
            nome: usuario.nome,
            tipo: eAgente ? "agente" : "cliente",
            cnpj: usuario.cnpj || null
        };

        entrarSistema();
    } catch (e) {
        showToast(e.message || "Login inválido!", "erro");
    } finally {
        botao.disabled = false; botao.innerText = "Entrar no Sistema";
    }
}

// ========================
// ENTRAR NO SISTEMA
// ========================
function entrarSistema() {
    document.getElementById("auth-overlay").classList.add("hidden");
    document.getElementById("tela-principal").classList.remove("hidden");
    document.getElementById("userNameDisplay").innerText = usuarioAtual.nome;

    const badge = document.getElementById("badge-tipo-usuario");
    badge.innerText = usuarioAtual.tipo === "agente" ? "Agente" : "Cliente";
    badge.className = `badge-tipo badge-${usuarioAtual.tipo}`;

    montarNavegacao();

    if (usuarioAtual.tipo === "cliente") {
        document.getElementById("tela-cliente").classList.remove("hidden");
    } else {
        document.getElementById("tela-agente").classList.remove("hidden");
    }
    navegarPara("pedidos");
}

// ========================
// SAIR
// ========================
function sairSistema() {
    usuarioAtual = { id: null, nome: "", tipo: null, cnpj: null };
    location.reload();
}

// ========================
// NAVEGAÇÃO
// ========================
const abasCliente = [
    { id: "pedidos", label: "Pedidos",    init: listarPedidosCliente },
    { id: "perfil",  label: "Meu Perfil", init: carregarPerfilCliente }
];

const abasAgente = [
    { id: "pedidos",    label: "Pedidos",    init: listarPedidosAgente },
    { id: "contratos",  label: "Contratos",  init: carregarContratos },
    { id: "automoveis", label: "Automóveis", init: carregarAutomoveis },
    { id: "perfil",     label: "Perfil",     init: carregarPerfilAgente }
];

function montarNavegacao() {
    const nav  = document.getElementById("dashboard-nav");
    const abas = usuarioAtual.tipo === "cliente" ? abasCliente : abasAgente;
    nav.innerHTML = "";
    abas.forEach(aba => {
        const btn = document.createElement("button");
        btn.className = "nav-tab";
        btn.id = `nav-${aba.id}`;
        btn.innerText = aba.label;
        btn.onclick = () => navegarPara(aba.id);
        nav.appendChild(btn);
    });
}

function navegarPara(abaId) {
    const prefixo = usuarioAtual.tipo === "cliente" ? "cliente" : "agente";
    const abas    = usuarioAtual.tipo === "cliente" ? abasCliente : abasAgente;

    document.querySelectorAll(".aba-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".nav-tab").forEach(el => el.classList.remove("active"));

    const conteudo = document.getElementById(`aba-${prefixo}-${abaId}`);
    if (conteudo) conteudo.classList.remove("hidden");

    const navBtn = document.getElementById(`nav-${abaId}`);
    if (navBtn) navBtn.classList.add("active");

    const estrada = document.getElementById("estrada-anim");
    if (estrada) estrada.style.display = abaId === "perfil" ? "none" : "block";

    const aba = abas.find(a => a.id === abaId);
    if (aba && aba.init) aba.init();
}

// ========================
// PEDIDOS — CLIENTE
// (criar, visualizar, editar, cancelar)
// ========================
async function criarPedido() {
    const prazo = document.getElementById("prazo").value;
    const valor = document.getElementById("valor").value;
    if (!prazo || !valor) { showToast("Preencha prazo e valor!", "erro"); return; }

    const btn = document.getElementById("btn-criar-pedido");
    btn.disabled = true; btn.innerText = "Criando...";

    try {
        const res = await fetch(API_PEDIDOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clienteId: usuarioAtual.id, prazoMeses: Number(prazo), valorPrevisto: Number(valor) })
        });
        if (!res.ok) throw new Error();
        document.getElementById("prazo").value = "";
        document.getElementById("valor").value = "";
        showToast("Pedido criado com sucesso!");
        await listarPedidosCliente();
    } catch {
        showToast("Erro ao criar pedido.", "erro");
    } finally {
        btn.disabled = false; btn.innerText = "Criar Pedido";
    }
}

async function listarPedidosCliente() {
    const lista = document.getElementById("lista-pedidos-cliente");
    lista.innerHTML = `<div class="loading">Carregando pedidos...</div>`;
    try {
        const res    = await fetch(API_PEDIDOS);
        const todos  = await res.json();
        const pedidos = todos.filter(p => {
            // clienteId pode vir como campo direto (@Transient) ou dentro do objeto cliente
            const cid = p.clienteId ?? p.cliente?.id;
            return cid === usuarioAtual.id;
        });

        lista.innerHTML = "";
        if (pedidos.length === 0) {
            lista.innerHTML = `<div class="empty-state">Nenhum pedido encontrado.</div>`; return;
        }
        pedidos.forEach(p => lista.appendChild(criarCardPedidoCliente(p)));
    } catch {
        lista.innerHTML = `<div class="empty-state error">Erro ao carregar pedidos.</div>`;
    }
}

function criarCardPedidoCliente(p) {
    const div = document.createElement("div");
    div.className = "order-card";
    const status      = (p.status || "PENDENTE").toUpperCase();
    const statusClass = status.toLowerCase();
    const cid         = p.clienteId ?? p.cliente?.id ?? usuarioAtual.id;
    const isPendente  = status === "PENDENTE";

    div.innerHTML = `
        <div class="order-header">
            <div class="order-id">Pedido #${p.id}</div>
            <div class="status-badge status-${statusClass}">${status}</div>
        </div>
        <div class="order-grid">
            <div class="order-field">
                <span class="field-label">Prazo</span>
                <span class="field-value">${p.prazoMeses} meses</span>
            </div>
            <div class="order-field">
                <span class="field-label">Valor Previsto</span>
                <span class="field-value">${formatarMoeda(p.valorPrevisto)}</span>
            </div>
            <div class="order-field">
                <span class="field-label">Data</span>
                <span class="field-value">${formatarData(p.dataPedido)}</span>
            </div>
        </div>
        ${isPendente ? `
        <div class="order-actions">
            <button class="btn btn-secondary btn-sm"
                onclick="abrirEdicaoPedido(${p.id}, ${p.prazoMeses}, ${p.valorPrevisto}, ${cid}, '${status}')">
                Editar
            </button>
            <button class="btn btn-danger btn-sm"
                onclick="cancelarPedido(${p.id}, ${p.prazoMeses}, ${p.valorPrevisto})">
                Cancelar
            </button>
        </div>` : ""}
    `;
    return div;
}

async function cancelarPedido(id, prazoMeses, valorPrevisto) {
    if (!confirm("Deseja cancelar este pedido?")) return;
    try {
        const res = await fetch(`${API_PEDIDOS}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                clienteId: usuarioAtual.id,
                prazoMeses,
                valorPrevisto,
                status: "CANCELADO"
            })
        });
        if (!res.ok) throw new Error();
        showToast("Pedido cancelado.");
        await listarPedidosCliente();
    } catch {
        showToast("Erro ao cancelar pedido.", "erro");
    }
}

// ========================
// PEDIDOS — AGENTE
// (visualizar, aprovar, reprovar, modificar)
// ========================
async function listarPedidosAgente() {
    const lista = document.getElementById("lista-pedidos-agente");
    lista.innerHTML = `<div class="loading">Carregando pedidos...</div>`;
    try {
        const res    = await fetch(API_PEDIDOS);
        const pedidos = await res.json();

        lista.innerHTML = "";
        if (pedidos.length === 0) {
            lista.innerHTML = `<div class="empty-state">Nenhum pedido no sistema.</div>`; return;
        }
        pedidos.forEach(p => lista.appendChild(criarCardPedidoAgente(p)));
    } catch {
        lista.innerHTML = `<div class="empty-state error">Erro ao carregar pedidos.</div>`;
    }
}

function criarCardPedidoAgente(p) {
    const div = document.createElement("div");
    div.className = "order-card";
    const status      = (p.status || "PENDENTE").toUpperCase();
    const statusClass = status.toLowerCase();
    const cid         = p.clienteId ?? p.cliente?.id ?? null;
    const isPendente  = status === "PENDENTE";

    div.innerHTML = `
        <div class="order-header">
            <div class="order-id">
                Pedido #${p.id}
                <span class="order-cliente-label">Cliente ID ${cid ?? "—"}</span>
            </div>
            <div class="status-badge status-${statusClass}">${status}</div>
        </div>
        <div class="order-grid">
            <div class="order-field">
                <span class="field-label">Prazo</span>
                <span class="field-value">${p.prazoMeses} meses</span>
            </div>
            <div class="order-field">
                <span class="field-label">Valor Previsto</span>
                <span class="field-value">${formatarMoeda(p.valorPrevisto)}</span>
            </div>
            <div class="order-field">
                <span class="field-label">Data do Pedido</span>
                <span class="field-value">${formatarData(p.dataPedido)}</span>
            </div>
        </div>
        ${isPendente ? `
        <div class="order-actions">
            <button class="btn btn-primary btn-sm"
                onclick="avaliarPedido(${p.id}, ${p.prazoMeses}, ${p.valorPrevisto}, ${cid ?? 'null'}, 'CONCLUIDO')">
                Aprovar
            </button>
            <button class="btn btn-danger btn-sm"
                onclick="avaliarPedido(${p.id}, ${p.prazoMeses}, ${p.valorPrevisto}, ${cid ?? 'null'}, 'CANCELADO')">
                Reprovar
            </button>
            <button class="btn btn-secondary btn-sm"
                onclick="abrirEdicaoPedido(${p.id}, ${p.prazoMeses}, ${p.valorPrevisto}, ${cid ?? 'null'}, '${status}')">
                Modificar
            </button>
        </div>` : ""}
    `;
    return div;
}

async function avaliarPedido(id, prazoMeses, valorPrevisto, clienteId, novoStatus) {
    const acao = novoStatus === "CONCLUIDO" ? "aprovar" : "reprovar";
    if (!confirm(`Deseja ${acao} este pedido?`)) return;
    try {
        const res = await fetch(`${API_PEDIDOS}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clienteId, prazoMeses, valorPrevisto, status: novoStatus })
        });
        if (!res.ok) throw new Error();
        showToast(`Pedido ${acao === "aprovar" ? "aprovado" : "reprovado"}!`);
        await listarPedidosAgente();
    } catch {
        showToast("Erro ao avaliar pedido.", "erro");
    }
}

// ========================
// EDITAR PEDIDO (modal compartilhado)
// ========================
function abrirEdicaoPedido(id, prazo, valor, clienteId, status) {
    document.getElementById("editPedidoId").value       = id;
    document.getElementById("editPedidoClienteId").value= clienteId;
    document.getElementById("editPedidoStatus").value   = status || "PENDENTE";
    document.getElementById("editPrazo").value          = prazo;
    document.getElementById("editValor").value          = valor;
    abrirModal("modal-pedido");
}

async function salvarEdicaoPedido() {
    const id        = document.getElementById("editPedidoId").value;
    const clienteId = document.getElementById("editPedidoClienteId").value;
    const status    = document.getElementById("editPedidoStatus").value;
    const prazo     = document.getElementById("editPrazo").value;
    const valor     = document.getElementById("editValor").value;

    if (!prazo || !valor) { showToast("Preencha todos os campos!", "erro"); return; }

    try {
        const res = await fetch(`${API_PEDIDOS}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                clienteId: clienteId ? Number(clienteId) : null,
                prazoMeses: Number(prazo),
                valorPrevisto: Number(valor),
                status: status || "PENDENTE"
            })
        });
        if (!res.ok) throw new Error();
        showToast("Pedido atualizado!");
        fecharModal("modal-pedido");
        if (usuarioAtual.tipo === "cliente") await listarPedidosCliente();
        else await listarPedidosAgente();
    } catch {
        showToast("Erro ao salvar pedido.", "erro");
    }
}

// ========================
// CONTRATOS (aba do agente)
// ========================
async function carregarContratos() {
    const elAprovados  = document.getElementById("lista-pedidos-aprovados");
    const elContratos  = document.getElementById("lista-contratos");
    elAprovados.innerHTML = `<div class="loading">Carregando...</div>`;
    elContratos.innerHTML = `<div class="loading">Carregando...</div>`;

    try {
        const [resPedidos, resContratos] = await Promise.all([
            fetch(API_PEDIDOS),
            fetch(API_CONTRATOS)
        ]);
        const pedidos   = await resPedidos.json();
        const contratos = await resContratos.json();

        // IDs de pedidos que já têm contrato
        const pedidosComContrato = new Set(
            contratos.map(c => c.pedidoId).filter(Boolean)
        );

        // Pedidos CONCLUIDOS sem contrato = aguardando formalização
        const aguardando = pedidos.filter(p =>
            (p.status || "").toUpperCase() === "CONCLUIDO" &&
            !pedidosComContrato.has(p.id)
        );

        // Renderizar pedidos aguardando contrato
        elAprovados.innerHTML = "";
        if (aguardando.length === 0) {
            elAprovados.innerHTML = `<div class="empty-state">Nenhum pedido aguardando formalização de contrato.</div>`;
        } else {
            aguardando.forEach(p => elAprovados.appendChild(criarCardPedidoAguardandoContrato(p)));
        }

        // Renderizar contratos criados
        elContratos.innerHTML = "";
        if (contratos.length === 0) {
            elContratos.innerHTML = `<div class="empty-state">Nenhum contrato criado ainda.</div>`;
        } else {
            contratos.forEach(c => elContratos.appendChild(criarCardContrato(c)));
        }
    } catch {
        elAprovados.innerHTML = `<div class="empty-state error">Erro ao carregar dados.</div>`;
        elContratos.innerHTML = "";
    }
}

function criarCardPedidoAguardandoContrato(p) {
    const div = document.createElement("div");
    div.className = "order-card";
    const cid = p.clienteId ?? p.cliente?.id;
    div.innerHTML = `
        <div class="order-header">
            <div class="order-id">Pedido #${p.id} <span class="order-cliente-label">Cliente ID ${cid ?? "—"}</span></div>
            <div class="status-badge status-concluido">APROVADO</div>
        </div>
        <div class="order-grid">
            <div class="order-field"><span class="field-label">Prazo</span><span class="field-value">${p.prazoMeses} meses</span></div>
            <div class="order-field"><span class="field-label">Valor</span><span class="field-value">${formatarMoeda(p.valorPrevisto)}</span></div>
        </div>
        <div class="order-actions">
            <button class="btn btn-primary btn-sm" onclick="abrirModalContrato(${p.id}, ${cid})">Formalizar Contrato</button>
        </div>
    `;
    return div;
}

function criarCardContrato(c) {
    const div = document.createElement("div");
    div.className = "order-card";
    const tipoLabel = {
        CLIENTE: "Propriedade do Cliente",
        EMPRESA: "Propriedade da Empresa",
        BANCO:   "Propriedade do Banco"
    }[c.tipoContrato] || c.tipoContrato || "—";

    div.innerHTML = `
        <div class="order-header">
            <div class="order-id">Contrato #${c.id}</div>
            <div class="status-badge status-ativo">${tipoLabel}</div>
        </div>
        <div class="order-grid">
            <div class="order-field"><span class="field-label">Pedido</span><span class="field-value">#${c.pedidoId || "—"}</span></div>
            <div class="order-field"><span class="field-label">Início</span><span class="field-value">${c.dataInicio || "—"}</span></div>
            <div class="order-field"><span class="field-label">Fim</span><span class="field-value">${c.dataFim || "—"}</span></div>
            ${c.contratoCredito ? `<div class="order-field"><span class="field-label">Crédito</span><span class="field-value">${formatarMoeda(c.contratoCredito.valor)}</span></div>` : ""}
        </div>
    `;
    return div;
}

async function abrirModalContrato(pedidoId, clienteId) {
    document.getElementById("contratoPedidoId").value     = pedidoId;
    document.getElementById("contratoTipo").value         = "CLIENTE";
    document.getElementById("contratoDataInicio").value   = "";
    document.getElementById("contratoDataFim").value      = "";
    document.getElementById("campos-credito").classList.add("hidden");

    // ── Dados do contratante ────────────────────────────────────────
    const contratanteDiv = document.getElementById("contratante-info");
    contratanteDiv.innerHTML = '<div class="loading">Carregando dados do contratante...</div>';

    if (clienteId && clienteId !== 'null') {
        try {
            const [resC, resR] = await Promise.all([
                fetch(`${API_CLIENTES}/${clienteId}`),
                fetch(`${API_RENDIMENTOS}/usuario/${clienteId}`)
            ]);
            const cliente    = resC.ok  ? await resC.json() : null;
            const rendimentos = resR.ok ? await resR.json() : [];

            if (cliente) {
                const rendHtml = rendimentos.length > 0
                    ? rendimentos.map(r => `
                        <div class="rendimento-item">
                            <span>${r.entidadeEmpregadora || '—'}</span>
                            <strong>${formatarMoeda(r.valorAuferido)}</strong>
                        </div>`).join('')
                    : '<p class="text-muted-sm">Nenhum rendimento cadastrado.</p>';

                contratanteDiv.innerHTML = `
                    <div class="contratante-grid">
                        <div class="contratante-field">
                            <span class="field-label">Nome</span>
                            <span class="field-value">${cliente.nome || '—'}</span>
                        </div>
                        <div class="contratante-field">
                            <span class="field-label">CPF</span>
                            <span class="field-value">${cliente.cpf || '—'}</span>
                        </div>
                        <div class="contratante-field">
                            <span class="field-label">RG</span>
                            <span class="field-value">${cliente.rg || '—'}</span>
                        </div>
                        <div class="contratante-field">
                            <span class="field-label">Profissão</span>
                            <span class="field-value">${cliente.profissao || '—'}</span>
                        </div>
                        <div class="contratante-field contratante-field-full">
                            <span class="field-label">Endereço</span>
                            <span class="field-value">${cliente.endereco || '—'}</span>
                        </div>
                    </div>
                    <div class="contratante-rendimentos">
                        <span class="field-label">Rendimentos</span>
                        ${rendHtml}
                    </div>
                `;
            } else {
                contratanteDiv.innerHTML = '<p class="text-muted-sm">Dados do cliente não encontrados.</p>';
            }
        } catch {
            contratanteDiv.innerHTML = '<p class="text-muted-sm">Erro ao carregar dados do contratante.</p>';
        }
    } else {
        contratanteDiv.innerHTML = '<p class="text-muted-sm">ID do cliente não disponível.</p>';
    }

    // ── Carregar veículos disponíveis como checkboxes ────────────────
    const lista = document.getElementById("contrato-veiculos-lista");
    lista.innerHTML = `<div class="loading">Carregando veículos...</div>`;

    try {
        const res   = await fetch(API_AUTOMOVEIS);
        const autos = await res.json();
        if (autos.length === 0) {
            lista.innerHTML = `<p class="text-muted-sm">Nenhum automóvel cadastrado na frota. Adicione em "Automóveis" primeiro.</p>`;
        } else {
            lista.innerHTML = autos.map(a => `
                <label class="checkbox-label">
                    <input type="checkbox" class="veiculo-check" value="${a.id}">
                    <span>${a.marca} ${a.modelo} &mdash; Placa: ${a.placa || "s/placa"} (${a.ano || "s/ano"})</span>
                </label>
            `).join("");
        }
    } catch {
        lista.innerHTML = `<p class="text-muted-sm">Erro ao carregar veículos.</p>`;
    }

    abrirModal("modal-contrato");
}

function toggleCreditoFields() {
    const tipo = document.getElementById("contratoTipo").value;
    document.getElementById("campos-credito").classList.toggle("hidden", tipo !== "BANCO");
}

async function salvarContrato() {
    const pedidoId   = document.getElementById("contratoPedidoId").value;
    const tipo       = document.getElementById("contratoTipo").value;
    const dataInicio = document.getElementById("contratoDataInicio").value;
    const dataFim    = document.getElementById("contratoDataFim").value;

    if (!dataInicio || !dataFim) { showToast("Preencha as datas do contrato!", "erro"); return; }
    if (dataFim <= dataInicio)   { showToast("A data fim deve ser após a data início.", "erro"); return; }

    const btn = document.getElementById("btn-salvar-contrato");
    btn.disabled = true; btn.innerText = "Salvando...";

    try {
        // ── Veículos selecionados ─────────────────────────────
        const checked      = document.querySelectorAll(".veiculo-check:checked");
        const automovelIds = Array.from(checked).map(cb => Number(cb.value));

        // ── Contrato de crédito (apenas para tipo BANCO) ──────
        let contratoCreditoId = null;
        if (tipo === "BANCO") {
            const valor = document.getElementById("creditoValor").value;
            const taxa  = document.getElementById("creditoTaxa").value;
            if (valor && taxa) {
                const resC = await fetch(API_CONTRATOS_CREDIT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        valor: Number(valor),
                        taxaJuros: Number(taxa),
                        bancoConcedente: { id: usuarioAtual.id }  // agente banco
                    })
                });
                if (resC.ok) {
                    const credCriado = await resC.json();
                    contratoCreditoId = credCriado.id;
                }
            }
        }

        // ── Enviar o contrato via DTO ─────────────────────────
        const body = {
            tipoContrato:     tipo,
            dataInicio,
            dataFim,
            pedidoId:         Number(pedidoId),
            agenteId:         usuarioAtual.id,
            automovelIds,
            contratoCreditoId
        };

        const res = await fetch(API_CONTRATOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        showToast("Contrato criado com sucesso!");
        fecharModal("modal-contrato");
        await carregarContratos();
    } catch {
        showToast("Erro ao criar contrato.", "erro");
    } finally {
        btn.disabled = false; btn.innerText = "Criar Contrato";
    }
}


// ========================
// AUTOMÓVEIS (somente agente)
// ========================
function abrirModalAutomovel() {
    ["autoMarca","autoModelo","autoAno","autoPlaca","autoMatricula"]
        .forEach(id => document.getElementById(id).value = "");
    abrirModal("modal-automovel");
}

async function salvarAutomovel() {
    const marca     = document.getElementById("autoMarca").value.trim();
    const modelo    = document.getElementById("autoModelo").value.trim();
    const ano       = document.getElementById("autoAno").value;
    const placa     = document.getElementById("autoPlaca").value.trim();
    const matricula = document.getElementById("autoMatricula").value.trim();

    if (!marca || !modelo || !ano || !placa) {
        showToast("Preencha marca, modelo, ano e placa!", "erro"); return;
    }

    const btn = document.getElementById("btn-salvar-automovel");
    btn.disabled = true; btn.innerText = "Salvando...";

    try {
        const res = await fetch(API_AUTOMOVEIS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ marca, modelo, ano: Number(ano), placa, matricula })
        });
        if (!res.ok) throw new Error();
        showToast("Automóvel cadastrado!");
        fecharModal("modal-automovel");
        await carregarAutomoveis();
    } catch {
        showToast("Erro ao cadastrar automóvel.", "erro");
    } finally {
        btn.disabled = false; btn.innerText = "Cadastrar";
    }
}

async function carregarAutomoveis() {
    const lista = document.getElementById("lista-automoveis-agente");
    if (!lista) return;
    lista.innerHTML = `<div class="loading">Carregando...</div>`;

    try {
        const res   = await fetch(API_AUTOMOVEIS);
        const autos = await res.json();

        lista.innerHTML = "";
        if (autos.length === 0) {
            lista.innerHTML = `<div class="empty-state">Nenhum automóvel na frota.</div>`; return;
        }

        const grid = document.createElement("div");
        grid.className = "automoveis-grid";
        autos.forEach(a => grid.appendChild(criarCardAutomovel(a)));
        lista.appendChild(grid);
    } catch {
        lista.innerHTML = `<div class="empty-state error">Erro ao carregar automóveis.</div>`;
    }
}

function criarCardAutomovel(a) {
    const card = document.createElement("div");
    card.className = "automovel-card";
    card.innerHTML = `
        <div class="automovel-info">
            <div class="automovel-nome">${a.marca} ${a.modelo}</div>
            <div class="automovel-detalhes">
                <span>${a.ano || "—"}</span>
                <span class="placa-badge">${a.placa || "—"}</span>
                ${a.matricula ? `<span>Mat: ${a.matricula}</span>` : ""}
            </div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="deletarAutomovel(${a.id})">Remover</button>
    `;
    return card;
}

async function deletarAutomovel(id) {
    if (!confirm("Deseja remover este automóvel da frota?")) return;
    try {
        await fetch(`${API_AUTOMOVEIS}/${id}`, { method: "DELETE" });
        showToast("Automóvel removido.");
        await carregarAutomoveis();
    } catch {
        showToast("Erro ao remover automóvel.", "erro");
    }
}

// ========================
// PERFIL — CLIENTE
// ========================
async function carregarPerfilCliente() {
    try {
        const res     = await fetch(`${API_CLIENTES}/${usuarioAtual.id}`);
        const cliente = await res.json();
        document.getElementById("editNome").value      = cliente.nome      || "";
        document.getElementById("editCpf").value       = cliente.cpf       || "";
        document.getElementById("editRg").value        = cliente.rg        || "";
        document.getElementById("editEndereco").value  = cliente.endereco  || "";
        document.getElementById("editProfissao").value = cliente.profissao || "";
        await carregarRendimentos();
    } catch {
        showToast("Erro ao carregar perfil.", "erro");
    }
}

async function salvarPerfil() {
    const dto = {
        nome:      document.getElementById("editNome").value.trim(),
        cpf:       document.getElementById("editCpf").value.trim(),
        rg:        document.getElementById("editRg").value.trim(),
        endereco:  document.getElementById("editEndereco").value.trim(),
        profissao: document.getElementById("editProfissao").value.trim()
    };
    try {
        await fetch(`${API_CLIENTES}/${usuarioAtual.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });
        usuarioAtual.nome = dto.nome;
        document.getElementById("userNameDisplay").innerText = dto.nome;
        showToast("Dados salvos com sucesso!");
    } catch {
        showToast("Erro ao salvar dados.", "erro");
    }
}

async function excluirConta() {
    if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) return;
    try {
        await fetch(`${API_CLIENTES}/${usuarioAtual.id}`, { method: "DELETE" });
        showToast("Conta excluída.");
        setTimeout(() => sairSistema(), 1500);
    } catch {
        showToast("Erro ao excluir conta.", "erro");
    }
}

// ========================
// RENDIMENTOS (persistidos no banco)
// ========================
async function carregarRendimentos() {
    const lista = document.getElementById("lista-rendimentos");
    lista.innerHTML = `<div class="loading">Carregando rendimentos...</div>`;
    try {
        const res  = await fetch(`${API_RENDIMENTOS}/usuario/${usuarioAtual.id}`);
        const rend = await res.json();
        renderizarListaRendimentos(rend);
        // Ocultar botão se já tem 3
        document.getElementById("btn-add-rendimento").style.display =
            rend.length >= 3 ? "none" : "inline-flex";
    } catch {
        lista.innerHTML = `<div class="empty-state error">Erro ao carregar rendimentos.</div>`;
    }
}

function renderizarListaRendimentos(rend) {
    const lista = document.getElementById("lista-rendimentos");
    lista.innerHTML = "";
    if (rend.length === 0) {
        lista.innerHTML = `<div class="empty-state">Nenhum rendimento cadastrado.</div>`;
        return;
    }
    rend.forEach(r => {
        const div = document.createElement("div");
        div.className = "rendimento-card";
        div.innerHTML = `
            <div class="rendimento-dados">
                <div class="rendimento-entidade">${r.entidadeEmpregadora || "—"}</div>
                <div class="rendimento-valor">${formatarMoeda(r.valorAuferido)}</div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removerRendimento(${r.id})">Remover</button>
        `;
        lista.appendChild(div);
    });
}

function mostrarFormRendimento() {
    document.getElementById("form-novo-rendimento").classList.remove("hidden");
    document.getElementById("btn-add-rendimento").classList.add("hidden");
    document.getElementById("novoRendimentoEntidade").value = "";
    document.getElementById("novoRendimentoValor").value    = "";
}

function cancelarNovoRendimento() {
    document.getElementById("form-novo-rendimento").classList.add("hidden");
    document.getElementById("btn-add-rendimento").classList.remove("hidden");
}

async function confirmarNovoRendimento() {
    const entidade = document.getElementById("novoRendimentoEntidade").value.trim();
    const valor    = document.getElementById("novoRendimentoValor").value;

    if (!entidade || !valor) { showToast("Preencha entidade e valor!", "erro"); return; }

    try {
        const res = await fetch(API_RENDIMENTOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                entidadeEmpregadora: entidade,
                valorAuferido: Number(valor),
                usuario: { id: usuarioAtual.id }
            })
        });
        if (!res.ok) throw new Error();
        showToast("Rendimento adicionado!");
        cancelarNovoRendimento();
        await carregarRendimentos();
    } catch {
        showToast("Erro ao adicionar rendimento.", "erro");
    }
}

async function removerRendimento(id) {
    if (!confirm("Deseja remover este rendimento?")) return;
    try {
        await fetch(`${API_RENDIMENTOS}/${id}`, { method: "DELETE" });
        showToast("Rendimento removido.");
        await carregarRendimentos();
    } catch {
        showToast("Erro ao remover rendimento.", "erro");
    }
}

// ========================
// PERFIL — AGENTE
// ========================
async function carregarPerfilAgente() {
    try {
        const res    = await fetch(`${API_AGENTES}/${usuarioAtual.id}`);
        const agente = await res.json();
        document.getElementById("editAgenteNome").value = agente.nome || "";
        document.getElementById("editAgenteCnpj").value = agente.cnpj || "";
    } catch {
        showToast("Erro ao carregar perfil do agente.", "erro");
    }
}

async function salvarPerfilAgente() {
    const nome = document.getElementById("editAgenteNome").value.trim();
    const cnpj = document.getElementById("editAgenteCnpj").value.trim();
    try {
        await fetch(`${API_AGENTES}/${usuarioAtual.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, cnpj })
        });
        usuarioAtual.nome = nome;
        document.getElementById("userNameDisplay").innerText = nome;
        showToast("Dados atualizados!");
    } catch {
        showToast("Erro ao salvar.", "erro");
    }
}