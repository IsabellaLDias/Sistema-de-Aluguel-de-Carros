// ========================
// APIs
// ========================
const API_PEDIDOS = "http://localhost:8080/pedidos";
const API_CLIENTES = "http://localhost:8080/clientes";
const API_AGENTES = "http://localhost:8080/agentes";
const API_AUTH = "http://localhost:8080/auth";
const API_AUTOMOVEIS = "http://localhost:8080/automoveis";
const API_CONTRATOS = "http://localhost:8080/contratos-aluguel";
const API_CONTRATOS_CREDIT = "http://localhost:8080/contratos-credito";
const API_RENDIMENTOS = "http://localhost:8080/rendimentos";

// ========================
// ESTADO GLOBAL
// ========================
let usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual")) || {
    id: null,
    nome: "",
    tipo: null,
    cnpj: null
};

// ========================
// TOAST
// ========================
function showToast(msg, tipo = "sucesso") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = `toast toast-${tipo}`;
    t.classList.remove("hidden");
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(() => t.classList.add("hidden"), 3500);
}

// ========================
// CONFIRMAÇÃO CUSTOMIZADA
// ========================
function confirmar(mensagem, callback) {
    const overlay = document.getElementById("confirm-overlay");
    const msg = document.getElementById("confirm-msg");
    const btnOk = document.getElementById("confirm-ok");
    const btnCan = document.getElementById("confirm-cancel");

    msg.textContent = mensagem;
    overlay.classList.remove("hidden");

    const newOk = btnOk.cloneNode(true);
    const newCan = btnCan.cloneNode(true);
    btnOk.parentNode.replaceChild(newOk, btnOk);
    btnCan.parentNode.replaceChild(newCan, btnCan);

    function fechar() { overlay.classList.add("hidden"); }

    newOk.addEventListener("click", () => { fechar(); callback(true); });
    newCan.addEventListener("click", () => { fechar(); callback(false); });
}

// ========================
// VALIDAÇÕES
// ========================
const Validar = {
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    cpf(v) {
        v = v.replace(/\D/g, '');
        if (v.length !== 11 || /^(\d)\1+$/.test(v)) return false;
        const d = (arr, len) => {
            let s = 0;
            for (let i = 0; i < len; i++) s += +arr[i] * (len + 1 - i);
            const r = (s * 10) % 11; return r >= 10 ? 0 : r;
        };
        return d(v, 9) === +v[9] && d(v, 10) === +v[10];
    },
    cnpj(v) {
        v = v.replace(/\D/g, '');
        if (v.length !== 14 || /^(\d)\1+$/.test(v)) return false;
        const c = (s, l) => {
            let t = 0, p = l - 7;
            for (let i = 0; i < l; i++) { t += +s[i] * p--; if (p < 2) p = 9; }
            const r = t % 11; return r < 2 ? 0 : 11 - r;
        };
        return c(v, 12) === +v[12] && c(v, 13) === +v[13];
    },
    senha: v => v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v),
    rg: v => /^\d{6,9}$/.test(v.replace(/\D/g, '')),
    endereco: v => v.trim().length >= 10,
};

function marcarCampo(id, ok, msg = '') {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('input-error', !ok);
    el.classList.toggle('input-valid', ok);
    const parent = el.closest('.form-group') || el.parentNode;
    let span = parent.querySelector('.field-error-msg');
    if (!ok && msg) {
        if (!span) {
            span = document.createElement('span');
            span.className = 'field-error-msg';
            parent.appendChild(span);
        }
        span.textContent = msg;
    } else if (span) {
        span.remove();
    }
}

function limparCampos(...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('input-error', 'input-valid');
        const parent = el.closest('.form-group') || el.parentNode;
        const span = parent.querySelector('.field-error-msg');
        if (span) span.remove();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const regras = [
        { id: 'regLogin', fn: v => Validar.email(v), msg: 'E-mail inválido (ex: nome@dominio.com)' },
        { id: 'regSenha', fn: v => Validar.senha(v), msg: 'Mín. 8 chars: maiúscula, minúscula, número e símbolo' },
        { id: 'regCpf', fn: v => Validar.cpf(v), msg: 'CPF inválido' },
        { id: 'regCnpj', fn: v => Validar.cnpj(v), msg: 'CNPJ inválido' },
        { id: 'regRg', fn: v => Validar.rg(v), msg: 'RG inválido (6 a 9 dígitos)' },
        { id: 'regEndereco', fn: v => Validar.endereco(v), msg: 'Endereço muito curto (mín. 10 caracteres)' },
    ];
    regras.forEach(({ id, fn, msg }) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', e => {
            const v = e.target.value.trim();
            if (!v) { limparCampos(id); return; }
            marcarCampo(id, fn(v), msg);
        });
        el.addEventListener('input', () => {
            if (el.classList.contains('input-error')) {
                const v = el.value.trim();
                if (fn(v)) marcarCampo(id, true);
            }
        });
    });
});

// ========================
// MODAL
// ========================
function fecharModal(id) { document.getElementById(id).classList.add("hidden"); }
function abrirModal(id) { document.getElementById(id).classList.remove("hidden"); }

// ========================
// TOGGLE SENHA (olhinho)
// ========================
function toggleSenha(inputId, btn) {
    const input = document.getElementById(inputId);
    const mostrar = input.type === "password";
    input.type = mostrar ? "text" : "password";
    btn.querySelector(".eye-on").classList.toggle("hidden", mostrar);
    btn.querySelector(".eye-off").classList.toggle("hidden", !mostrar);
    btn.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
}

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
    limparCampos('regLogin', 'regSenha', 'regNome', 'regCpf', 'regCnpj', 'regRg', 'regEndereco', 'regProfissao');
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
    const login = document.getElementById("regLogin").value.trim();
    const senha = document.getElementById("regSenha").value.trim();
    const nome = document.getElementById("regNome").value.trim();
    const cpf = document.getElementById("regCpf").value.trim();
    const rg = document.getElementById("regRg").value.trim();
    const endereco = document.getElementById("regEndereco").value.trim();
    const profissao = document.getElementById("regProfissao").value.trim();

    let invalidos = [];
    if (!login || !nome || !cpf) {
        showToast("Preencha todos os campos obrigatórios!", "erro"); return;
    }
    if (!Validar.email(login)) { marcarCampo('regLogin', false, 'E-mail inválido (ex: nome@dominio.com)'); invalidos.push('regLogin'); }
    if (!Validar.senha(senha)) { marcarCampo('regSenha', false, 'Mín. 8 chars: maiúscula, minúscula, número e símbolo'); invalidos.push('regSenha'); }
    if (!Validar.cpf(cpf)) { marcarCampo('regCpf', false, 'CPF inválido'); invalidos.push('regCpf'); }
    if (rg && !Validar.rg(rg)) { marcarCampo('regRg', false, 'RG inválido (6 a 9 dígitos)'); invalidos.push('regRg'); }
    if (endereco && !Validar.endereco(endereco)) { marcarCampo('regEndereco', false, 'Endereço muito curto (mín. 10 caracteres)'); invalidos.push('regEndereco'); }
    if (invalidos.length) { showToast('Corrija os campos destacados em vermelho.', 'erro'); document.getElementById(invalidos[0]).focus(); return; }

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
    const nome = document.getElementById("regNome").value.trim();
    const cnpj = document.getElementById("regCnpj").value.trim();

    let invalidos = [];
    if (!login || !senha || !nome || !cnpj) {
        showToast("Preencha todos os campos obrigatórios!", "erro"); return;
    }
    if (!Validar.email(login)) { marcarCampo('regLogin', false, 'E-mail inválido (ex: nome@dominio.com)'); invalidos.push('regLogin'); }
    if (!Validar.senha(senha)) { marcarCampo('regSenha', false, 'Mín. 8 chars: maiúscula, minúscula, número e símbolo'); invalidos.push('regSenha'); }
    if (!Validar.cnpj(cnpj)) { marcarCampo('regCnpj', false, 'CNPJ inválido'); invalidos.push('regCnpj'); }
    if (invalidos.length) { showToast('Corrija os campos destacados em vermelho.', 'erro'); document.getElementById(invalidos[0]).focus(); return; }

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
            id: usuario.id,
            nome: usuario.nome,
            tipo: eAgente ? "agente" : "cliente",
            cnpj: usuario.cnpj || null
        };
        localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtual));

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
    document.body.classList.add("dashboard-ativo");
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
    document.body.classList.remove("dashboard-ativo");
    usuarioAtual = { id: null, nome: "", tipo: null, cnpj: null };
    localStorage.removeItem("usuarioAtual");
    location.reload();
}

// ========================
// NAVEGAÇÃO
// ========================
const abasCliente = [
    { id: "pedidos", label: "Pedidos", init: listarPedidosCliente },
    { id: "contratos", label: "Meus Contratos", init: carregarContratosCliente },
    { id: "perfil", label: "Meu Perfil", init: carregarPerfilCliente }
];

const abasAgente = [
    { id: "pedidos", label: "Pedidos", init: listarPedidosAgente },
    { id: "contratos", label: "Contratos", init: carregarContratos },
    { id: "automoveis", label: "Automóveis", init: carregarAutomoveis },
    { id: "perfil", label: "Perfil", init: carregarPerfilAgente }
];

function montarNavegacao() {
    const nav = document.getElementById("dashboard-nav");
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
    const abas = usuarioAtual.tipo === "cliente" ? abasCliente : abasAgente;

    document.querySelectorAll(".aba-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".nav-tab").forEach(el => el.classList.remove("active"));

    const conteudo = document.getElementById(`aba-${prefixo}-${abaId}`);
    if (conteudo) conteudo.classList.remove("hidden");

    const navBtn = document.getElementById(`nav-${abaId}`);
    if (navBtn) navBtn.classList.add("active");

    const aba = abas.find(a => a.id === abaId);
    if (aba && aba.init) aba.init();
}

// ========================
// PEDIDOS — CLIENTE
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
        const res = await fetch(API_PEDIDOS);
        const todos = await res.json();
        const pedidos = todos.filter(p => {
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

// ========================
// CONTRATOS — CLIENTE
// ========================
async function carregarContratosCliente() {
    const lista = document.getElementById("lista-contratos-cliente");
    lista.innerHTML = `<div class="loading">Carregando contratos...</div>`;
    try {
        const [resPedidos, resContratos] = await Promise.all([
            fetch(API_PEDIDOS),
            fetch(API_CONTRATOS)
        ]);

        const todosPedidos = await resPedidos.json();
        const todosContratos = await resContratos.json();

        const meusPedidos = todosPedidos.filter(p => {
            const cid = p.clienteId ?? p.cliente?.id;
            return cid === usuarioAtual.id;
        });

        const meusPedidoIds = new Set(meusPedidos.map(p => p.id));
        const meusContratos = todosContratos.filter(c => meusPedidoIds.has(c.pedidoId));

        lista.innerHTML = "";
        if (meusContratos.length === 0) {
            lista.innerHTML = `<div class="empty-state">Nenhum contrato formalizado ainda.</div>`;
            return;
        }

        meusContratos.forEach(c => lista.appendChild(criarCardContrato(c)));
    } catch {
        lista.innerHTML = `<div class="empty-state error">Erro ao carregar contratos.</div>`;
    }
}

function criarCardPedidoCliente(p) {
    const div = document.createElement("div");
    div.className = "order-card";
    const status = (p.status || "PENDENTE").toUpperCase();
    const statusClass = status.toLowerCase();
    const cid = p.clienteId ?? p.cliente?.id ?? usuarioAtual.id;
    const isPendente = status === "PENDENTE";

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
    confirmar("Deseja cancelar este pedido?", async (ok) => {
        if (!ok) return;
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
    });
}

// ========================
// PEDIDOS — AGENTE
// ========================
async function listarPedidosAgente() {
    const lista = document.getElementById("lista-pedidos-agente");
    lista.innerHTML = `<div class="loading">Carregando pedidos...</div>`;
    try {
        const res = await fetch(API_PEDIDOS);
        const pedidos = await res.json();

        lista.innerHTML = "";

        const pedidosFiltrados = pedidos.filter(p =>
            (p.status || "PENDENTE").toUpperCase() === "PENDENTE" ||
            p.avaliadorId === usuarioAtual.id
        );

        if (pedidosFiltrados.length === 0) {
            lista.innerHTML = `<div class="empty-state">Nenhum pedido disponível ou avaliado por você.</div>`; return;
        }
        pedidosFiltrados.forEach(p => lista.appendChild(criarCardPedidoAgente(p)));
    } catch {
        lista.innerHTML = `<div class="empty-state error">Erro ao carregar pedidos.</div>`;
    }
}

function criarCardPedidoAgente(p) {
    const div = document.createElement("div");
    div.className = "order-card";
    const status = (p.status || "PENDENTE").toUpperCase();
    const statusClass = status.toLowerCase();
    const cid = p.clienteId ?? p.cliente?.id ?? null;
    const isPendente = status === "PENDENTE";

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
    confirmar(`Deseja ${acao} este pedido?`, async (ok) => {
        if (!ok) return;
        try {
            const res = await fetch(`${API_PEDIDOS}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clienteId,
                    prazoMeses,
                    valorPrevisto,
                    status: novoStatus,
                    agenteId: usuarioAtual.id
                })
            });
            if (!res.ok) throw new Error();
            showToast(`Pedido ${acao === "aprovar" ? "aprovado" : "reprovado"}!`);
            await listarPedidosAgente();
        } catch {
            showToast("Erro ao avaliar pedido.", "erro");
        }
    });
}

// ========================
// EDITAR PEDIDO
// ========================
function abrirEdicaoPedido(id, prazo, valor, clienteId, status) {
    document.getElementById("editPedidoId").value = id;
    document.getElementById("editPedidoClienteId").value = clienteId;
    document.getElementById("editPedidoStatus").value = status || "PENDENTE";
    document.getElementById("editPrazo").value = prazo;
    document.getElementById("editValor").value = valor;
    abrirModal("modal-pedido");
}

async function salvarEdicaoPedido() {
    const id = document.getElementById("editPedidoId").value;
    const clienteId = document.getElementById("editPedidoClienteId").value;
    const status = document.getElementById("editPedidoStatus").value;
    const prazo = document.getElementById("editPrazo").value;
    const valor = document.getElementById("editValor").value;

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
    const elAprovados = document.getElementById("lista-pedidos-aprovados");
    const elContratos = document.getElementById("lista-contratos");
    elAprovados.innerHTML = `<div class="loading">Carregando...</div>`;
    elContratos.innerHTML = `<div class="loading">Carregando...</div>`;

    try {
        const [resPedidos, resContratos] = await Promise.all([
            fetch(API_PEDIDOS),
            fetch(API_CONTRATOS)
        ]);
        const pedidos = await resPedidos.json();
        const contratos = await resContratos.json();

        const pedidosComContrato = new Set(
            contratos.map(c => c.pedidoId).filter(Boolean)
        );

        const aguardando = pedidos.filter(p =>
            (p.status || "").toUpperCase() === "CONCLUIDO" &&
            p.avaliadorId === usuarioAtual.id &&
            !pedidosComContrato.has(p.id)
        );

        elAprovados.innerHTML = "";
        if (aguardando.length === 0) {
            elAprovados.innerHTML = `<div class="empty-state">Nenhum pedido aguardando formalização de contrato.</div>`;
        } else {
            aguardando.forEach(p => elAprovados.appendChild(criarCardPedidoAguardandoContrato(p)));
        }

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
        BANCO: "Propriedade do Banco"
    }[c.tipoContrato] || c.tipoContrato || "—";

    div.innerHTML = `
        <div class="order-header">
            <div class="order-id">Contrato #${c.id}</div>
            <div class="status-badge status-ativo">${tipoLabel}</div>
        </div>
        <div class="order-grid">
            <div class="order-field"><span class="field-label">Pedido</span><span class="field-value">#${c.pedidoId || "—"}</span></div>
            <div class="order-field"><span class="field-label">Agência</span><span class="field-value">${c.agenciaNome || "—"}</span></div>
            <div class="order-field"><span class="field-label">Início</span><span class="field-value">${c.dataInicio || "—"}</span></div>
            <div class="order-field"><span class="field-label">Fim</span><span class="field-value">${c.dataFim || "—"}</span></div>
            ${c.contratoCredito ? `<div class="order-field"><span class="field-label">Crédito</span><span class="field-value">${formatarMoeda(c.contratoCredito.valor)}</span></div>` : ""}
            <div class="order-field" style="grid-column: 1 / -1;">
                <span class="field-label">Automóveis</span>
                <span class="field-value">${c.carros || "Nenhum veículo vinculado."}</span>
            </div>
        </div>
    `;
    return div;
}

async function abrirModalContrato(pedidoId, clienteId) {
    document.getElementById("contratoPedidoId").value = pedidoId;
    document.getElementById("contratoTipo").value = "CLIENTE";
    document.getElementById("contratoDataInicio").value = "";
    document.getElementById("contratoDataFim").value = "";
    document.getElementById("campos-credito").classList.add("hidden");

    const contratanteDiv = document.getElementById("contratante-info");
    contratanteDiv.innerHTML = '<div class="loading">Carregando dados do contratante...</div>';

    if (clienteId && clienteId !== 'null') {
        try {
            const [resC, resR] = await Promise.all([
                fetch(`${API_CLIENTES}/${clienteId}`),
                fetch(`${API_RENDIMENTOS}/usuario/${clienteId}`)
            ]);
            const cliente = resC.ok ? await resC.json() : null;
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

    const lista = document.getElementById("contrato-veiculos-lista");
    lista.innerHTML = `<div class="loading">Carregando veículos...</div>`;

    try {
        const res = await fetch(API_AUTOMOVEIS);
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
    const pedidoId = document.getElementById("contratoPedidoId").value;
    const tipo = document.getElementById("contratoTipo").value;
    const dataInicio = document.getElementById("contratoDataInicio").value;
    const dataFim = document.getElementById("contratoDataFim").value;

    if (!dataInicio || !dataFim) { showToast("Preencha as datas do contrato!", "erro"); return; }
    if (dataFim <= dataInicio) { showToast("A data fim deve ser após a data início.", "erro"); return; }

    const btn = document.getElementById("btn-salvar-contrato");
    btn.disabled = true; btn.innerText = "Salvando...";

    try {
        const checked = document.querySelectorAll(".veiculo-check:checked");
        const automovelIds = Array.from(checked).map(cb => Number(cb.value));

        let contratoCreditoId = null;
        if (tipo === "BANCO") {
            const valor = document.getElementById("creditoValor").value;
            const taxa = document.getElementById("creditoTaxa").value;
            if (valor && taxa) {
                const resC = await fetch(API_CONTRATOS_CREDIT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        valor: Number(valor),
                        taxaJuros: Number(taxa),
                        bancoConcedente: { id: usuarioAtual.id }
                    })
                });
                if (resC.ok) {
                    const credCriado = await resC.json();
                    contratoCreditoId = credCriado.id;
                }
            }
        }

        const body = {
            tipoContrato: tipo,
            dataInicio,
            dataFim,
            pedidoId: Number(pedidoId),
            agenteId: usuarioAtual.id,
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
// AUTOMÓVEIS
// ========================
function abrirModalAutomovel() {
    ["autoMarca", "autoModelo", "autoAno", "autoPlaca", "autoMatricula"]
        .forEach(id => document.getElementById(id).value = "");
    abrirModal("modal-automovel");
}

async function salvarAutomovel() {
    const marca = document.getElementById("autoMarca").value.trim();
    const modelo = document.getElementById("autoModelo").value.trim();
    const ano = document.getElementById("autoAno").value;
    const placa = document.getElementById("autoPlaca").value.trim();
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
        const res = await fetch(API_AUTOMOVEIS);
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
    confirmar("Deseja remover este automóvel da frota?", async (ok) => {
        if (!ok) return;
        try {
            await fetch(`${API_AUTOMOVEIS}/${id}`, { method: "DELETE" });
            showToast("Automóvel removido.");
            await carregarAutomoveis();
        } catch {
            showToast("Erro ao remover automóvel.", "erro");
        }
    });
}

// ========================
// PERFIL — CLIENTE
// ========================
async function carregarPerfilCliente() {
    try {
        const res = await fetch(`${API_CLIENTES}/${usuarioAtual.id}`);
        const cliente = await res.json();
        document.getElementById("editNome").value = cliente.nome || "";
        document.getElementById("editCpf").value = cliente.cpf || "";
        document.getElementById("editRg").value = cliente.rg || "";
        document.getElementById("editEndereco").value = cliente.endereco || "";
        document.getElementById("editProfissao").value = cliente.profissao || "";
        await carregarRendimentos();
    } catch {
        showToast("Erro ao carregar perfil.", "erro");
    }
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
        usuarioAtual.nome = dto.nome;
        document.getElementById("userNameDisplay").innerText = dto.nome;
        showToast("Dados salvos com sucesso!");
    } catch {
        showToast("Erro ao salvar dados.", "erro");
    }
}

async function excluirConta() {
    confirmar("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.", async (ok) => {
        if (!ok) return;
        try {
            await fetch(`${API_CLIENTES}/${usuarioAtual.id}`, { method: "DELETE" });
            showToast("Conta excluída.");
            setTimeout(() => sairSistema(), 1500);
        } catch {
            showToast("Erro ao excluir conta.", "erro");
        }
    });
}

// ========================
// RENDIMENTO
// ========================
async function carregarRendimentos() {
    const lista = document.getElementById("lista-rendimentos");
    lista.innerHTML = `<div class="loading">Carregando rendimentos...</div>`;
    try {
        const res = await fetch(`${API_RENDIMENTOS}/usuario/${usuarioAtual.id}`);
        const rend = await res.json();
        renderizarListaRendimentos(rend);
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
    document.getElementById("novoRendimentoValor").value = "";
}

function cancelarNovoRendimento() {
    document.getElementById("form-novo-rendimento").classList.add("hidden");
    document.getElementById("btn-add-rendimento").classList.remove("hidden");
}

async function confirmarNovoRendimento() {
    const entidade = document.getElementById("novoRendimentoEntidade").value.trim();
    const valor = document.getElementById("novoRendimentoValor").value;

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
    confirmar("Deseja remover este rendimento?", async (ok) => {
        if (!ok) return;
        try {
            await fetch(`${API_RENDIMENTOS}/${id}`, { method: "DELETE" });
            showToast("Rendimento removido.");
            await carregarRendimentos();
        } catch {
            showToast("Erro ao remover rendimento.", "erro");
        }
    });
}

// ========================
// PERFIL — AGENTE
// ========================
async function carregarPerfilAgente() {
    try {
        const res = await fetch(`${API_AGENTES}/${usuarioAtual.id}`);
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

// ========================
// RESTAURAÇÃO DE SESSÃO
// ========================
document.addEventListener("DOMContentLoaded", () => {
    if (usuarioAtual && usuarioAtual.id) {
        entrarSistema();
    }
});