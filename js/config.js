// ═══════════════════════════════════════════════════════
//  CONFIG.JS — Luia App · Módulo central multi-prova
//  Gerencia qual prova está ativa e expõe os dados
//  corretos para todos os outros módulos.
// ═══════════════════════════════════════════════════════

// ── REGISTRO DE PROVAS DISPONÍVEIS ────────────────────
// Provas cadastradas — todas ativas, nenhuma arquivada ou em breve.
// Novas provas são adicionadas dinamicamente via fluxo "Adicionar novo edital".
const PROVAS_DISPONIVEIS = {
  ifpe: {
    id: 'ifpe',
    nome: 'IFPE 2027',
    subtitulo: 'Técnico Integrado · CONUPE',
    icone: '🏛️',
    dataProva: '2027-12-20',
    cor: '#8B5CF6'
  },
  ssa1: {
    id: 'ssa1',
    nome: 'SSA 1 · UPE',
    subtitulo: 'Sistema Seriado de Avaliação · 1ª Fase',
    icone: '🎓',
    dataProva1: '2026-12-06',
    dataProva2: '2026-12-13',
    dataProva: '2026-12-06',
    cor: '#7C3AED'
  }
};

// ── PROVA ATIVA ────────────────────────────────────────
// Persiste no localStorage para sobreviver ao refresh.
// Muda via setProvaAtiva(id).
let _provaAtiva = localStorage.getItem('luia_prova_ativa') || 'ssa1';

function getProvaAtiva() {
  return PROVAS_DISPONIVEIS[_provaAtiva] || PROVAS_DISPONIVEIS['ssa1'];
}

function getProvaAtivaId() {
  return _provaAtiva;
}

function setProvaAtiva(id) {
  if (!PROVAS_DISPONIVEIS[id]) return;
  _provaAtiva = id;
  localStorage.setItem('luia_prova_ativa', id);
  // Notifica o app para re-renderizar tudo
  if (typeof onProvaChanged === 'function') onProvaChanged(id);
}

// ── DADOS DO EDITAL DA PROVA ATIVA ────────────────────
// Retorna o objeto de edital correspondente à prova ativa.
// edital-ssa1.js precisa estar carregado antes.
function getEditalAtivo() {
  if (_provaAtiva === 'ssa1' && typeof EDITAL_SSA1 !== 'undefined') {
    return EDITAL_SSA1;
  }
  // Fallback: retorna estrutura mínima do IFPE (dados já hardcoded em app.js)
  return {
    id: 'ifpe',
    nome: 'IFPE 2027',
    dataProva: '2027-12-20',
    areas: [
      { id: 'portugues',  nome: 'Português',              questoes: null, cor: '#C084FC' },
      { id: 'matematica', nome: 'Matemática',              questoes: null, cor: '#FBBF24' },
      { id: 'ciencias',   nome: 'Ciências da Natureza',   questoes: null, cor: '#4ADE80' },
      { id: 'historia',   nome: 'História',                questoes: null, cor: '#FB923C' },
      { id: 'geografia',  nome: 'Geografia',               questoes: null, cor: '#38BDF8' }
    ],
    leituras: []
  };
}

// ── DIAS ATÉ A PROVA ───────────────────────────────────
function diasAteProva() {
  const prova = getProvaAtiva();
  const dataRef = prova.dataProva || prova.dataProva1;
  if (!dataRef) return null;
  const hoje = new Date();
  const dt = new Date(dataRef + 'T00:00:00');
  return Math.ceil((dt - hoje) / (1000 * 60 * 60 * 24));
}

// ── SIM_TOPICOS DINÂMICO ───────────────────────────────
// Os simulados usam SIM_TOPICOS para popular o select de matérias.
// Esta função retorna o objeto correto para a prova ativa.
function getSimTopicosAtivos() {
  if (_provaAtiva === 'ssa1' && typeof getSIMTopicosSSA1 === 'function') {
    return getSIMTopicosSSA1();
  }
  // Fallback: SIM_TOPICOS do IFPE (definido em simulados.js)
  if (typeof SIM_TOPICOS !== 'undefined') return SIM_TOPICOS;
  return {};
}

// ── CORES DAS MATÉRIAS ─────────────────────────────────
// Centraliza as cores para dashboard, gráficos e badges.
function getCoresMateriasAtivas() {
  if (_provaAtiva === 'ssa1') {
    return {
      'Língua Portuguesa':      '#C084FC',
      'Literatura':             '#A855F7',
      'Língua Inglesa':         '#818CF8',
      'Língua Espanhola':       '#6366F1',
      'Arte':                   '#EC4899',
      'Educação Física':        '#F472B6',
      'História':               '#FB923C',
      'Geografia':              '#38BDF8',
      'Filosofia':              '#F59E0B',
      'Matemática':             '#FBBF24',
      'Biologia':               '#4ADE80',
      'Química':                '#34D399',
      'Física':                 '#2DD4BF'
    };
  }
  // IFPE
  return {
    'Português':             '#C084FC',
    'Matemática':            '#FBBF24',
    'Ciências da Natureza':  '#4ADE80',
    'História':              '#FB923C',
    'Geografia':             '#38BDF8'
  };
}

// ── MATÉRIAS ATIVAS ────────────────────────────────────
function getMateriasAtivas() {
  if (_provaAtiva === 'ssa1' && typeof getMateriasSSA1 === 'function') {
    return getMateriasSSA1();
  }
  return ['Português', 'Matemática', 'Ciências da Natureza', 'História', 'Geografia'];
}

// ── RENDER DO SELETOR DE PROVAS (header/menu) ──────────
function renderSeletorProvas() {
  const wrap = document.getElementById('prova-seletor-wrap');
  if (!wrap) return;

  wrap.innerHTML = Object.values(PROVAS_DISPONIVEIS).map(p => {
    const isAtiva = p.id === _provaAtiva;
    const d = new Date((p.dataProva || '2099-01-01') + 'T00:00:00');
    const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
    const diasLabel = diff > 0 ? diff + ' dias' : 'Prova encerrada';

    return '<div class="prova-option' + (isAtiva ? ' ativa' : '') + '" onclick="setProvaAtiva(\'' + p.id + '\')">' +
      '<span class="prova-option-icone">' + p.icone + '</span>' +
      '<div class="prova-option-info">' +
        '<div class="prova-option-nome">' + p.nome + '</div>' +
        '<div class="prova-option-sub">' + diasLabel + ' · ' + (p.subtitulo || '') + '</div>' +
      '</div>' +
      (isAtiva ? '<span style="color:var(--accent);font-size:14px">✦</span>' : '') +
    '</div>';
  }).join('') +
  '<div class="prova-option nova" onclick="abrirNovaProva()">' +
    '<span class="prova-option-icone">＋</span>' +
    '<div class="prova-option-info">' +
      '<div class="prova-option-nome">Adicionar novo edital</div>' +
      '<div class="prova-option-sub">Suba o PDF · a IA monta o plano</div>' +
    '</div>' +
  '</div>';
}

// ── NOVA PROVA ─────────────────────────────────────────
// Implementação completa em nova-prova.js (carregado antes do app.js)

// ── CALLBACK AO MUDAR DE PROVA ─────────────────────────
function onProvaChanged(novaProvaId) {
  const p = PROVAS_DISPONIVEIS[novaProvaId];
  if (!p) return;

  // Atualiza todos os elementos visuais com o nome da nova prova
  const nome = p.nome || 'Luia';
  const els = {
    'plan-label':       nome,
    'menu-prova-nome':  nome,
    'countdown-objetivo': nome,
  };
  Object.entries(els).forEach(([id, txt]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  });

  renderSeletorProvas();
  if (typeof atualizarContador === 'function') atualizarContador();
  if (typeof renderDashboard  === 'function') renderDashboard();
  if (typeof renderRevisoes   === 'function') renderRevisoes();
  if (typeof renderSimHistorico === 'function') renderSimHistorico();
  if (typeof showToast === 'function') showToast('Prova alterada para ' + nome + ' ✦', 'success');
}

// ── INIT ───────────────────────────────────────────────
// Chamado no boot do app para garantir consistência.
function initConfig() {
  // Garante que a prova ativa existe no registro — SSA 1 é o padrão
  if (!PROVAS_DISPONIVEIS[_provaAtiva]) {
    _provaAtiva = 'ssa1';
    localStorage.setItem('luia_prova_ativa', 'ssa1');
  }
  renderSeletorProvas();
}
