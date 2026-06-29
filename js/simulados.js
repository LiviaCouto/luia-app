// ═══════════════════════════════════════
//  MÓDULO DE SIMULADOS — luia-app
//  Dependências de app.js:
//    SUPA_URL, SUPA_KEY, H, sbPost
//    showToast, todayLocal, fmtDate
//    verificarConquistas, atualizarRevBadge
//    perfilData, authDesbloqueado
//    _visitanteBlocked, comAuth
// ═══════════════════════════════════════

// ── ESTADO ──────────────────────────────
// Cada campo declarado com seu valor inicial.
// resetSimState() volta tudo para cá — é a
// única fonte de verdade para "simulado zerado".
let simConfig     = { materia:'', topico:'', nivel:'fácil', qtd:5, cronometro:true };
let simQuestoes   = [];
let simAtual      = 0;
let simRespostas  = [];
let simFavoritas  = [];
let simComentarios= {};
let simEliminadas = {};
let simConfirmadas= {};
let simTimerSeg   = 0;
let simTimerInterval = null;
let simPausado    = false;

// Persistidos em localStorage
let simHistorico  = JSON.parse(localStorage.getItem('luia_sim_hist') || '[]');
let simFavSalvas  = JSON.parse(localStorage.getItem('luia_sim_favs') || '[]');

// ── RESET DE ESTADO ──────────────────────
// FIX BUG URGENTE: estado do simulado anterior
// jamais deve vazar para o próximo.
// Chamada obrigatória antes de qualquer nova prova.
function resetSimState() {
  clearInterval(simTimerInterval);
  simTimerInterval = null;
  simQuestoes    = [];
  simAtual       = 0;
  simRespostas   = [];
  simFavoritas   = [];
  simComentarios = {};
  simEliminadas  = {};
  simConfirmadas = {};
  simTimerSeg    = 0;
  simPausado     = false;
}

// ── DADOS ────────────────────────────────
// Tópicos do IFPE (fallback quando SSA 1 não está ativo)
const SIM_TOPICOS_IFPE = {
  'Português':         ['Interpretação de texto','Tipos e gêneros textuais','Coerência e coesão','Ortografia e acentuação','Classes de palavras','Sintaxe e pontuação','Figuras de linguagem','Variação linguística','Intenção comunicativa','Fato x opinião'],
  'Matemática':        ['Frações e decimais','Potenciação e radiciação','Razão e proporção','Regra de três','Porcentagem','Equações do 1º grau','Equações do 2º grau','Geometria plana','Geometria espacial','Estatística e probabilidade'],
  'Ciências da Natureza':['Ecologia','Vírus e bactérias','Reinos dos seres vivos','Citologia','Fisiologia humana','Genética','Evolução','Química: misturas','Química: reações','Física: mecânica'],
  'História':          ['2ª Guerra Mundial','Guerra Fria','Descolonização','Era Vargas','Ditadura Civil-Militar','Nova República','Globalização','Movimentos sociais','Constituição de 1988','América Latina contemporânea'],
  'Geografia':         ['Cartografia','Relevo e hidrografia','Clima e vegetação','Geopolítica mundial','Brasil: regiões','Urbanização','Globalização econômica','Problemas ambientais','Fontes de energia','Blocos econômicos'],
  'Misto (todas)':     ['Todos os tópicos']
};

// Retorna os tópicos da prova ativa (config.js) ou IFPE como fallback
function _getSimTopicos() {
  if (typeof getSimTopicosAtivos === 'function') return getSimTopicosAtivos();
  return SIM_TOPICOS_IFPE;
}

// ── CONFIGURAÇÃO ─────────────────────────
function atualizarTopicosSimulado() {
  const topicosAtivos = _getSimTopicos();
  const materias = Object.keys(topicosAtivos).filter(m => m !== 'Misto (todas)');

  // Popula select de matéria se ainda estiver vazio/default
  const selMat = document.getElementById('sim-materia');
  if (selMat && selMat.options.length <= 1) {
    selMat.innerHTML = '<option value="">Selecione a matéria</option>' +
      materias.map(m => '<option value="' + m + '">' + m + '</option>').join('') +
      '<option value="Misto (todas)">Misto (todas as matérias)</option>';
  }

  const mat = selMat ? selMat.value : '';
  const sel = document.getElementById('sim-topico');
  if (!sel) return;
  const topicos = (topicosAtivos[mat] || []).filter(t => !t.startsWith('Todos os tópicos de'));
  sel.innerHTML = mat
    ? '<option value="geral">Todos os tópicos de ' + mat + '</option>' + topicos.map(t => '<option>' + t + '</option>').join('')
    : '<option>Selecione a matéria primeiro</option>';
}

function selecionarNivel(btn, nivel) {
  if (nivel === 'misto') {
    document.querySelectorAll('.sim-nivel-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    simConfig.nivel = 'misto';
    return;
  }
  // Desativa misto
  document.querySelectorAll('.sim-nivel-btn').forEach(b => {
    if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'misto'")) b.classList.remove('on');
  });
  btn.classList.toggle('on');
  const ativos = [];
  document.querySelectorAll('.sim-nivel-btn.on').forEach(b => {
    const txt = b.getAttribute('onclick') || '';
    const m = txt.match(/'(facil|medio|dificil|misto)'/);
    if (m) ativos.push(m[1]);
  });
  // FIX BUG: se nenhum selecionado, mantém o atual clicado (sem contar duplo)
  if (!ativos.length) { btn.classList.add('on'); ativos.push(nivel); }
  simConfig.nivel = ativos.join(',');
}

function selecionarQtd(btn, qtd) {
  document.querySelectorAll('.sim-qtd-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  simConfig.qtd = qtd;
}

// ── INICIAR SIMULADO ─────────────────────
async function iniciarSimulado() {
  const mat = document.getElementById('sim-materia').value;
  const top = document.getElementById('sim-topico').value;
  if (!mat) { showToast('Selecione uma matéria!', 'error'); return; }

  // FIX BUG URGENTE: zera TODO o estado antes de qualquer coisa
  resetSimState();

  simConfig.materia    = mat;
  simConfig.topico     = top === 'geral' ? 'todos os tópicos' : top;
  simConfig.cronometro = document.getElementById('sim-cronometro').checked;

  // Mostra tela de loading — sem botão finalizar, sem questões verdes
  _simShowTela('prova');
  document.getElementById('sim-questao-wrap').innerHTML = `
    <div class="sim-loading">
      <div class="sim-loading-icon" style="animation:simSatelite 2.5s ease-in-out infinite">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="10" fill="#7C3AED" opacity=".9"/>
          <ellipse cx="26" cy="26" rx="22" ry="8" stroke="#A78BFA" stroke-width="2" fill="none" opacity=".5"/>
          <circle cx="26" cy="18" r="3" fill="#F59E0B"/>
          <line x1="10" y1="10" x2="16" y2="16" stroke="#A78BFA" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="42" y1="10" x2="36" y2="16" stroke="#A78BFA" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="sim-loading-txt">Gerando suas questões...</div>
      <div class="sim-loading-sub">${simConfig.qtd} questões · ${simConfig.materia} · ${simConfig.nivel}</div>
    </div>`;

  // Esconde header da prova enquanto carrega
  const header = document.getElementById('sim-prova-header');
  if (header) header.style.display = 'none';

  // Gera questões via Edge Function
  try {
    const nivelMap = {
      facil:  'fácil — conceitos básicos, reconhecimento direto, vocabulário acessível.',
      medio:  'médio — aplicação de conceitos, interpretação, relação entre ideias.',
      dificil:'difícil — análise crítica, inferência, raciocínio complexo.',
      misto:  'variado — mistura equilibrada entre fácil, médio e difícil.'
    };

    const instrPorMateria = {
      'Português': `
INSTRUÇÕES ESPECÍFICAS PARA PORTUGUÊS:
- OBRIGATÓRIO incluir um texto-base antes das questões de interpretação (150 a 250 palavras).
- Os textos devem ser originais, autorais, adequados para jovens brasileiros de 14 a 17 anos.
- Tipos de texto aceitos: crônica, notícia, conto, texto de divulgação científica, poema, ou tirinha.
- Para TIRINHAS/CHARGES/HQ: represente visualmente em texto usando o formato:
  [Quadro 1: descrição da cena]
  Personagem: "texto do balão de fala"
  [Quadro 2: ...] etc.
- Para FUMINHA (pensamento): use Personagem: *pensamento em itálico entre asteriscos*
- Tipos de questões: inferência, intenção do autor, coerência e coesão, vocabulário em contexto, fato x opinião, figuras de linguagem, recursos expressivos.
- Evitar questões puramente gramaticais isoladas; prefira contextualizar no texto-base.`,
      'Matemática': `
INSTRUÇÕES ESPECÍFICAS PARA MATEMÁTICA:
- Sempre contextualizar em situações reais do cotidiano de jovens brasileiros.
- Incluir enunciados com tabelas ou descrições de gráficos quando pertinente.
- Evitar cálculos excessivamente longos; focar no raciocínio.`,
      'Ciências da Natureza': `
INSTRUÇÕES ESPECÍFICAS PARA CIÊNCIAS:
- Contextualizar com situações do cotidiano, saúde, meio ambiente, tecnologia.
- Linguagem científica acessível para Ensino Fundamental II e início do Médio.`,
      'História': `
INSTRUÇÕES ESPECÍFICAS PARA HISTÓRIA:
- Incluir fontes históricas (trechos de documentos, charges descritas) quando possível.
- Questões que exigem compreensão de causas, consequências e relações de poder.`,
      'Geografia': `
INSTRUÇÕES ESPECÍFICAS PARA GEOGRAFIA:
- Usar dados reais (IBGE, clima, mapas descritos) quando possível.
- Contextualizar com problemas contemporâneos.`,
      'Misto (todas)': `
INSTRUÇÕES PARA SIMULADO MISTO:
- Distribuir equilibradamente entre as matérias do edital IFPE.`
    };

    const instrEspecifica = instrPorMateria[simConfig.materia] || '';
    const prompt = `Você é um especialista em elaboração de questões para processos seletivos de Escolas Técnicas Federais brasileiras, especialmente o IFPE — Técnico Integrado — modelo CONUPE.

SEU PERFIL:
- Público-alvo: estudantes de 14 a 17 anos.
- Estilo: questões objetivas com 5 alternativas (A a E), uma única correta.
- Distratores elaborados — não podem ser obviamente errados.
- Base curricular: BNCC + edital IFPE Técnico Integrado.
${instrEspecifica}

TAREFA: Crie EXATAMENTE ${simConfig.qtd} questões de múltipla escolha sobre:
- Matéria: ${simConfig.materia}
- Tópico: ${simConfig.topico}
- Nível de dificuldade: ${nivelMap[simConfig.nivel] || simConfig.nivel}

RETORNE APENAS um JSON válido, sem markdown, sem texto antes ou depois:
{
  "questoes": [
    {
      "materia": "nome da matéria",
      "topico": "tópico específico",
      "enunciado": "enunciado completo com contexto",
      "alternativas": { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." },
      "gabarito": "letra correta (A-E)",
      "explicacao": "explicação didática com tom encorajador"
    }
  ]
}`;

    const resp = await fetch(`${SUPA_URL}/functions/v1/gerar-questoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPA_KEY },
      body: JSON.stringify({ materia: simConfig.materia, topico: simConfig.topico, quantidade: simConfig.qtd, dificuldade: simConfig.nivel, prompt })
    });
    const txt = await resp.text();
    const json = JSON.parse(txt.replace(/```json|```/g, '').trim());
    simQuestoes = json.questoes;
  } catch(e) {
    showToast('Erro ao gerar questões. Tente novamente.', 'error');
    novoSimulado();
    return;
  }

  // Inicializa estado com as novas questões
  simAtual       = 0;
  simRespostas   = new Array(simQuestoes.length).fill(null);
  simFavoritas   = new Array(simQuestoes.length).fill(false);
  simComentarios = {};
  simEliminadas  = {};
  simConfirmadas = {};
  simTimerSeg    = 0;
  simPausado     = false;

  // Mostra header da prova agora que tem questões reais
  if (header) header.style.display = '';

  // FIX BUG TIMER: inicia timer limpo, sem herança do anterior
  if (simConfig.cronometro) {
    clearInterval(simTimerInterval); // garante que não há interval duplo
    simTimerInterval = setInterval(() => {
      if (!simPausado) { simTimerSeg++; atualizarTimer(); }
    }, 1000);
  }

  renderQuestao();
  renderMapa();
}

// ── TIMER ─────────────────────────────────
function atualizarTimer() {
  const m = Math.floor(simTimerSeg / 60).toString().padStart(2, '0');
  const s = (simTimerSeg % 60).toString().padStart(2, '0');
  const el = document.getElementById('sim-timer');
  if (el) el.textContent = m + ':' + s;
}

// FIX BUG TIMER: Page Visibility API — pausa quando aba perde foco
document.addEventListener('visibilitychange', () => {
  if (!simTimerInterval) return; // simulado não está rodando
  if (document.hidden) {
    simPausado = true;
  } else {
    simPausado = false;
  }
});

// ── RENDER QUESTÃO ────────────────────────
function renderQuestao() {
  const q = simQuestoes[simAtual];
  if (!q) return;
  // respondida = usuária já selecionou uma resposta (gabarito visível)
  const resp       = simRespostas[simAtual];
  const respondida = resp !== null;
  const fav        = simFavoritas[simAtual];
  const com        = simComentarios[simAtual] || '';

  document.getElementById('sim-q-num').textContent = (simAtual + 1) + '/' + simQuestoes.length;
  document.getElementById('sim-btn-ant').style.opacity = simAtual === 0 ? '0.3' : '1';
  document.getElementById('sim-btn-ant').disabled = simAtual === 0;

  const isUltima = simAtual === simQuestoes.length - 1;
  // Botão confirmar separado não é mais usado — esconde se existir
  const btnConf = document.getElementById('sim-btn-conf');
  if (btnConf) btnConf.style.display = 'none';
  const btnProx = document.getElementById('sim-btn-prox');
  if (btnProx) btnProx.textContent = isUltima ? 'Encerrar ✓' : 'Próxima →';

  const letras     = ['A','B','C','D','E'];
  const eliminadas = simEliminadas[simAtual] || [];

  // Monta alternativas sem onclick inline (event delegation abaixo)
  const altHtml = letras.slice(0, 5).map(l => {
    const txt = q.alternativas && q.alternativas[l] ? q.alternativas[l] : '';
    if (!txt) return '';
    const isResp   = resp === l;
    const isElim   = eliminadas.includes(l);
    const isCerta  = respondida && l === q.gabarito;
    const isErrada = respondida && isResp && l !== q.gabarito;
    let cls = 'sim-alt';
    if (respondida)  cls += ' bloqueada'; // sem cursor pointer após responder
    if (isResp)      cls += ' selecionada';
    if (isCerta)     cls += ' certa';
    if (isErrada)    cls += ' errada';
    if (isElim)      cls += ' eliminada';
    // data-letra é tudo que precisamos — event delegation trata o clique
    return '<div class="' + cls + '" data-letra="' + l + '">' +
      '<span class="sim-alt-letra">' + l + '</span>' +
      '<span class="sim-alt-txt">' + txt + '</span>' +
      (isElim ? '<button class="sim-elim-btn" data-elim="' + l + '">↩</button>' : '') +
      '</div>';
  }).join('');

  const nivelBg  = simConfig.nivel==='fácil'?'rgba(74,222,128,.15)':simConfig.nivel==='médio'?'rgba(251,191,36,.15)':'rgba(248,113,113,.15)';
  const nivelCor = simConfig.nivel==='fácil'?'#4ADE80':simConfig.nivel==='médio'?'#FBBF24':'#F87171';

  document.getElementById('sim-questao-wrap').innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">' +
      '<div class="sim-materia-tag">' + (q.materia || simConfig.materia) + ' · ' + (q.topico || simConfig.topico) + '</div>' +
      '<div style="font-size:10px;padding:2px 8px;border-radius:99px;background:' + nivelBg + ';color:' + nivelCor + ';font-weight:600;text-transform:uppercase;letter-spacing:.05em">' + simConfig.nivel + '</div>' +
    '</div>' +
    '<div class="sim-enunciado">' + (q.enunciado||'').replace(/\n/g,'<br>').replace(/---+/g,'<hr style="border-color:rgba(255,255,255,.08);margin:10px 0">') + '</div>' +
    '<div class="sim-alts">' + altHtml + '</div>' +
    '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;align-items:center">' +
      '<button class="sim-fav-btn' + (fav?' on':'') + '" onclick="simToggleFav()" title="' + (fav?'Desfavoritar':'Favoritar') + '">' +
        (fav?'⭐':'☆') + ' ' + (fav?'Favoritada':'Favoritar') +
      '</button>' +
      '<button class="sim-com-btn" onclick="simAbrirComentario()" title="Comentar">' +
        '💬 ' + (com?'Ver nota':'Nota') +
      '</button>' +
      (!respondida ? '<button class="sim-elim-toggle" onclick="simToggleEliminar()" title="Eliminar alternativa">✕ Eliminar</button>' : '') +
    '</div>' +
    (com ? '<div class="sim-com-preview">💬 ' + com + '</div>' : '') +
    (respondida && q.explicacao ? '<div class="sim-explicacao">💡 ' + q.explicacao + '</div>' : '');
}

// ── INTERAÇÃO COM ALTERNATIVAS ────────────
function simSelecionarAlt(letra) {
  // Não permite re-selecionar após já ter visto o gabarito (resposta travada)
  if (simRespostas[simAtual] !== null) return;
  simRespostas[simAtual] = letra;
  // Registra como "confirmada" automaticamente — sem botão extra
  simConfirmadas[simAtual] = true;
  renderQuestao();
  renderMapa();
}

function simConfirmar() {
  // Mantido por compatibilidade — lógica migrou para simSelecionarAlt
  if (!simRespostas[simAtual]) return;
  simConfirmadas[simAtual] = true;
  renderQuestao();
  renderMapa();
}

// Event delegation para alternativas — evita onclick inline com aspas aninhadas
document.addEventListener('click', function(e) {
  // Clique em alternativa
  const alt = e.target.closest('.sim-alt');
  if (alt && !e.target.closest('.sim-elim-btn')) {
    const letra = alt.dataset.letra;
    if (letra) simSelecionarAlt(letra);
    return;
  }
  // Clique em botão de eliminar dentro da alternativa
  const elim = e.target.closest('.sim-elim-btn');
  if (elim) {
    e.stopPropagation();
    const letra = elim.dataset.elim;
    if (letra) simEliminar(letra);
  }
});

function simEliminar(letra) {
  if (!simEliminadas[simAtual]) simEliminadas[simAtual] = [];
  const idx = simEliminadas[simAtual].indexOf(letra);
  if (idx >= 0) {
    simEliminadas[simAtual].splice(idx, 1);
  } else {
    if (simRespostas[simAtual] === letra) simRespostas[simAtual] = null;
    simEliminadas[simAtual].push(letra);
  }
  renderQuestao();
}

function simToggleEliminar() {
  // Abre modo de eliminação — handled via renderQuestao
  renderQuestao();
}

function simToggleFav() {
  simFavoritas[simAtual] = !simFavoritas[simAtual];
  renderQuestao();
  renderMapa();
}

function simAbrirComentario() {
  const atual = simComentarios[simAtual] || '';
  const txt = prompt('Sua nota sobre esta questão:', atual);
  if (txt !== null) {
    simComentarios[simAtual] = txt.trim();
    renderQuestao();
  }
}

// ── NAVEGAÇÃO ─────────────────────────────
function simAvancar() {
  const isUltima = simAtual === simQuestoes.length - 1;
  if (isUltima) {
    const naoRespondidas = simQuestoes.reduce((acc, _, i) => (!simConfirmadas[i] ? acc + 1 : acc), 0);
    if (naoRespondidas > 0) {
      if (!confirm(`Você tem ${naoRespondidas} questão(ões) sem confirmar. Encerrar mesmo assim?`)) return;
    }
    encerrarSimulado();
    return;
  }
  if (simAtual < simQuestoes.length - 1) { simAtual++; renderQuestao(); renderMapa(); }
}

function simVoltar() {
  if (simAtual > 0) { simAtual--; renderQuestao(); renderMapa(); }
}

function simIrPara(idx) {
  if (idx < 0 || idx >= simQuestoes.length) return;
  simAtual = idx;
  renderQuestao();
}

// ── MAPA DE QUESTÕES ──────────────────────
function renderMapa() {
  const el = document.getElementById('sim-mapa');
  if (!el) return;
  el.innerHTML = simQuestoes.map((_, i) => {
    const resp = simRespostas[i];
    const conf = simConfirmadas[i];
    const fav  = simFavoritas[i];
    let cls = 'sim-mapa-item';
    if (i === simAtual)  cls += ' atual';
    if (fav)             cls += ' fav';
    if (conf && resp !== null && resp === simQuestoes[i].gabarito) cls += ' certa';
    else if (conf && resp !== null) cls += ' errada';
    else if (resp !== null)         cls += ' respondida';
    return `<button class="${cls}" onclick="simIrPara(${i})">${i+1}</button>`;
  }).join('');
}

// ── PAUSAR ────────────────────────────────
function pausarSimulado() {
  simPausado = !simPausado;
  const btn = document.getElementById('sim-pause-btn');
  if (btn) btn.textContent = simPausado ? '▶ Continuar' : '⏸ Pausar';
  if (simPausado) showToast('Pausado', 'info');
}

// ── ENCERRAR ──────────────────────────────
function encerrarSimulado() {
  clearInterval(simTimerInterval);
  simTimerInterval = null;

  const acertos = simRespostas.filter((r, i) => r && r === (simQuestoes[i]?.gabarito || simQuestoes[i]?.resposta_correta)).length;
  const total   = simQuestoes.length;
  const pct     = total > 0 ? Math.round(acertos / total * 100) : 0;
  const cor     = pct >= 80 ? '#4ADE80' : pct >= 60 ? '#FBBF24' : '#F87171';

  const _agora = new Date();
  const _simProvaId = typeof getProvaAtivaId === 'function' ? getProvaAtivaId() : 'ifpe';
  const registro = {
    data:        todayLocal(),
    hora:        _agora.getHours().toString().padStart(2,'0') + ':' + _agora.getMinutes().toString().padStart(2,'0'),
    materia:     simConfig.materia,
    topico:      simConfig.topico,
    nivel:       simConfig.nivel,
    total, acertos, pct,
    tempo:       simTimerSeg,
    questoes:    simQuestoes,
    respostas:   [...simRespostas],
    favoritas:   [...simFavoritas],
    comentarios: { ...simComentarios },
    arquivado:   false,
    prova_id:    _simProvaId
  };

  simHistorico.unshift(registro);
  if (simHistorico.length > 50) simHistorico = simHistorico.slice(0, 50);
  localStorage.setItem('luia_sim_hist', JSON.stringify(simHistorico));

  // Salva favoritas
  const favs = simQuestoes
    .filter((_, i) => simFavoritas[i])
    .map((q, i) => ({ ...q, comentario: simComentarios[i] || '', data: todayLocal() }));
  // FIX BUG FAVORITOS: deduplicação por enunciado para evitar duplicatas
  const existentes = new Set(simFavSalvas.map(q => q.enunciado));
  const novasFavs  = favs.filter(q => !existentes.has(q.enunciado));
  simFavSalvas = [...novasFavs, ...simFavSalvas].slice(0, 200);
  localStorage.setItem('luia_sim_favs', JSON.stringify(simFavSalvas));

  // Persiste no Supabase
  fetch(`${SUPA_URL}/rest/v1/study_goals?id=eq.1`, {
    method: 'PATCH',
    headers: { ...H, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ sim_favoritas: simFavSalvas })
  }).catch(() => {});

  sbPost('simulados', {
    materia: simConfig.materia, topico: simConfig.topico, nivel: simConfig.nivel,
    total, acertos, tempo_seg: simTimerSeg, prova_id: _simProvaId
  }).then(res => {
    if (res && res[0]) {
      const simId = res[0].id;
      if (simHistorico[0]) simHistorico[0].supabase_id = simId;
      localStorage.setItem('luia_sim_hist', JSON.stringify(simHistorico));
      simQuestoes.forEach((q, i) => {
        sbPost('questoes_respondidas', {
          simulado_id:     simId,
          enunciado:       q.enunciado,
          alternativas:    q.alternativas,
          resposta_correta:q.gabarito,
          resposta_dada:   simRespostas[i],
          favorita:        simFavoritas[i] || false,
          comentario:      simComentarios[i] || '',
          tempo_seg:       0
        }).catch(() => {});
      });
    }
  }).catch(() => {});

  // FIX BUG CONQUISTAS: verifica conquistas depois que simHistorico foi atualizado
  if (typeof verificarConquistas === 'function') verificarConquistas();
  if (typeof verificarRank === 'function') verificarRank();

  // Mostra resultado
  _simShowTela('resultado');
  document.getElementById('sim-res-pct').textContent = pct + '%';
  document.getElementById('sim-res-pct').style.color = cor;
  document.getElementById('sim-res-label').textContent = acertos + ' de ' + total + ' questões corretas';
  const m = Math.floor(simTimerSeg / 60), s = simTimerSeg % 60;
  document.getElementById('sim-res-sub').textContent = 'Tempo: ' + m + 'min ' + s + 's · ' + simConfig.materia + ' · ' + simConfig.nivel;

  // Revisão de respostas
  document.getElementById('sim-revisao-wrap').innerHTML = simQuestoes.map((q, i) => {
    const resp  = simRespostas[i];
    const certa = resp === q.gabarito;
    const fav   = simFavoritas[i];
    return `<div style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,.06)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:11px;font-weight:700;color:${certa?'#4ADE80':'#F87171'}">${certa?'✓ Correto':'✗ Errado'}${fav?' ⭐':''}</span>
        <span style="font-size:10px;color:var(--text-dim)">${q.topico||simConfig.topico}</span>
        ${resp
          ? `<span style="font-size:10px;color:var(--text-dim);margin-left:auto">Você: ${resp} · Gabarito: ${q.gabarito}</span>`
          : '<span style="font-size:10px;color:var(--danger);margin-left:auto">Não respondida</span>'}
      </div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;margin-bottom:6px">${q.enunciado.slice(0,150)}${q.enunciado.length>150?'...':''}</div>
      ${q.explicacao?`<div style="font-size:11px;color:var(--text-dim);font-style:italic;border-left:2px solid rgba(139,92,246,.3);padding-left:8px">${q.explicacao.slice(0,200)}...</div>`:''}
    </div>`;
  }).join('');

  // Favoritas no resultado
  const favqs = simQuestoes.filter((_, i) => simFavoritas[i]);
  const favRes = document.getElementById('sim-favoritas-res');
  if (favqs.length && favRes) {
    favRes.style.display = 'block';
    document.getElementById('sim-favoritas-res-list').innerHTML = favqs.map(q =>
      `<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:12px;color:var(--text-secondary)">${q.enunciado.slice(0,120)}...</div>`
    ).join('');
  }

  const btnRepetir = document.getElementById('sim-btn-repetir');
  if (btnRepetir) btnRepetir.style.display = pct === 100 ? 'none' : 'flex';

  atualizarRevBadge();
  renderSimHistorico();
}

// ── VOLTAR / NOVO ─────────────────────────
function voltarParaSimulados() {
  // FIX BUG: limpa estado ao voltar
  resetSimState();
  _simShowTela('config');
  renderSimHistorico();
  renderSimFavoritas();
}

function novoSimulado() {
  // FIX BUG: limpa estado ao iniciar novo
  resetSimState();
  _simShowTela('config');
  renderSimHistorico();
  renderSimFavoritas();
}

// ── REPETIR ERROS (do simulado ativo) ────
function _authRepetirSimulado() {
  if (_visitanteBlocked('repetir simulado')) return;
  const erradas = simQuestoes.filter((q, i) => simRespostas[i] !== (q.gabarito || q.resposta_correta));
  if (!erradas.length) { showToast('Parabéns! Não há erros para repetir! 🎉', 'success'); return; }

  resetSimState();
  simQuestoes    = erradas;
  simConfig.topico = (simConfig.topico || '') + ' (revisão de erros)';
  simConfig.qtd  = erradas.length;
  simAtual       = 0;
  simRespostas   = new Array(erradas.length).fill(null);
  simFavoritas   = new Array(erradas.length).fill(false);
  simComentarios = {};
  simEliminadas  = {};
  simConfirmadas = {};
  simTimerSeg    = 0;
  simPausado     = false;

  _simShowTela('prova');
  if (simConfig.cronometro) {
    simTimerInterval = setInterval(() => { if (!simPausado) { simTimerSeg++; atualizarTimer(); } }, 1000);
  }
  renderQuestao();
  renderMapa();
  showToast('Repetindo ' + erradas.length + ' questão(ões) com erro! 💪', 'info');
}

// ── REFAZER ERROS (do histórico) ─────────
function _authRefazerErros(idx) { if (_visitanteBlocked('refazer simulado')) return; refazerErros(idx); }

function refazerErros(idx) {
  if (_visitanteBlocked('refazer simulado')) return;
  const s = simHistorico[idx];
  if (!s || !s.questoes) return;
  const erradas = s.questoes.filter((q, i) => s.respostas && s.respostas[i] !== q.gabarito);
  if (!erradas.length) { showToast('Parabéns! Não há erros para refazer! 🎉', 'success'); return; }

  resetSimState();
  simQuestoes      = erradas;
  simConfig.materia= s.materia;
  simConfig.topico = s.topico + ' (revisão de erros)';
  simConfig.nivel  = s.nivel;
  simConfig.qtd    = erradas.length;
  simAtual         = 0;
  simRespostas     = new Array(erradas.length).fill(null);
  simFavoritas     = new Array(erradas.length).fill(false);
  simComentarios   = {};
  simEliminadas    = {};
  simConfirmadas   = {};
  simTimerSeg      = 0;
  simPausado       = false;

  _simShowTela('prova');
  if (simConfig.cronometro) {
    simTimerInterval = setInterval(() => { if (!simPausado) { simTimerSeg++; atualizarTimer(); } }, 1000);
  }
  renderQuestao();
  renderMapa();
  showToast(`Refazendo ${erradas.length} questão(ões) errada(s) de ${s.materia}! 💪`, 'info');
}

// ── HISTÓRICO ─────────────────────────────
function renderSimHistorico(mostrarArquivados = false) {
  const el = document.getElementById('sim-historico-list');
  if (!el) return;
  const lista       = simHistorico.filter(s => mostrarArquivados ? s.arquivado : !s.arquivado);
  const arquivadosN = simHistorico.filter(s => s.arquivado).length;

  // FIX IDEIA: separa incompletos (sem todas confirmadas) de finalizados com erro
  const finalizados  = lista.filter(s => s.pct === 100);
  const comErros     = lista.filter(s => s.pct > 0 && s.pct < 100);
  const incompletos  = lista.filter(s => s.pct === 0 && s.total > 0);

  const tabsHtml = `<div style="display:flex;gap:8px;margin-bottom:12px">
    <button onclick="renderSimHistorico(false)" style="font-size:11px;padding:5px 12px;border-radius:99px;border:1px solid ${!mostrarArquivados?'#7C3AED':'rgba(255,255,255,.12)'};background:${!mostrarArquivados?'rgba(124,58,237,.2)':'transparent'};color:${!mostrarArquivados?'#A78BFA':'var(--text-dim)'};cursor:pointer">Ativos</button>
    ${arquivadosN>0?`<button onclick="renderSimHistorico(true)" style="font-size:11px;padding:5px 12px;border-radius:99px;border:1px solid ${mostrarArquivados?'#7C3AED':'rgba(255,255,255,.12)'};background:${mostrarArquivados?'rgba(124,58,237,.2)':'transparent'};color:${mostrarArquivados?'#A78BFA':'var(--text-dim)'};cursor:pointer">Arquivados (${arquivadosN})</button>`:''}
  </div>`;

  if (!lista.length) {
    el.innerHTML = tabsHtml + '<p style="color:var(--text-dim);font-size:13px">' + (mostrarArquivados ? 'Nenhum simulado arquivado.' : 'Nenhum simulado ainda.') + '</p>';
    return;
  }

  const renderItem = (s) => {
    const cor = s.pct >= 80 ? '#4ADE80' : s.pct >= 60 ? '#FBBF24' : '#F87171';
    const m   = Math.floor((s.tempo || 0) / 60);
    const idx = simHistorico.indexOf(s);
    const temQuestoes = s.questoes && s.questoes.length > 0;
    const dataStr = fmtDate(s.data) + (s.hora ? ' · ' + s.hora : '');
    return `<div style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05)">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:2px">${s.materia}</div>
          <div style="font-size:11px;color:var(--text-secondary);margin-bottom:2px">${s.topico}</div>
          <div style="font-size:10px;color:var(--text-dim)">${dataStr} · ${s.nivel} · ${m}min</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-family:'Poppins',sans-serif;font-size:1.2rem;font-weight:700;color:${cor}">${s.pct}%</div>
          <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px">${s.acertos}/${s.total} certas</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
        ${temQuestoes?`<button onclick="verSimulado(${idx})" style="font-size:11px;padding:5px 12px;background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.3);border-radius:8px;color:#A78BFA;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;gap:5px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Ver questões</button>`:''}
        ${s.pct<100&&temQuestoes&&!s.arquivado?`<button onclick="_authRefazerErros(${idx})" style="font-size:11px;padding:5px 12px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);border-radius:8px;color:#A78BFA;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg> Refazer erros</button>`:''}
        ${!s.arquivado
          ?`<button onclick="_authArquivarSim(${idx})" style="font-size:11px;padding:5px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:var(--text-dim);cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg> Arquivar</button>`
          :`<button onclick="_authDesarquivarSim(${idx})" style="font-size:11px;padding:5px 12px;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.2);border-radius:8px;color:#4ADE80;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg> Restaurar</button>`
        }
      </div>
    </div>`;
  };

  let html = tabsHtml;
  if (!mostrarArquivados) {
    if (incompletos.length > 0) {
      html += `<div style="margin-bottom:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94A3B8;margin-bottom:8px;display:flex;align-items:center;gap:6px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Não finalizados (${incompletos.length})
        </div>${incompletos.map(renderItem).join('')}</div>`;
    }
    if (comErros.length > 0) {
      html += `<div style="margin-bottom:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#FBBF24;margin-bottom:8px;display:flex;align-items:center;gap:6px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Com erros (${comErros.length})
        </div>${comErros.map(renderItem).join('')}</div>`;
    }
    if (finalizados.length > 0) {
      html += `<div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#4ADE80;margin-bottom:8px;display:flex;align-items:center;gap:6px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          100% corretos (${finalizados.length})
        </div>${finalizados.map(renderItem).join('')}</div>`;
    }
  } else {
    html += lista.map(renderItem).join('');
  }

  el.innerHTML = html;
}

// ── ARQUIVAR / DESARQUIVAR ────────────────
function _authArquivarSim(idx)    { if (_visitanteBlocked('arquivar simulado')) return; arquivarSimulado(idx); }
function _authDesarquivarSim(idx) { if (_visitanteBlocked('restaurar simulado')) return; desarquivarSimulado(idx); }

function arquivarSimulado(idx) {
  if (!confirm('Arquivar este simulado? Ele ficará oculto mas não será apagado.')) return;
  simHistorico[idx].arquivado = true;
  localStorage.setItem('luia_sim_hist', JSON.stringify(simHistorico));
  if (simHistorico[idx].supabase_id) {
    fetch(`${SUPA_URL}/rest/v1/simulados?id=eq.${simHistorico[idx].supabase_id}`, {
      method: 'PATCH', headers: { ...H, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ arquivado: true })
    }).catch(() => {});
  }
  renderSimHistorico();
  showToast('Simulado arquivado.', 'info');
}

function desarquivarSimulado(idx) {
  simHistorico[idx].arquivado = false;
  localStorage.setItem('luia_sim_hist', JSON.stringify(simHistorico));
  if (simHistorico[idx].supabase_id) {
    fetch(`${SUPA_URL}/rest/v1/simulados?id=eq.${simHistorico[idx].supabase_id}`, {
      method: 'PATCH', headers: { ...H, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ arquivado: false })
    }).catch(() => {});
  }
  renderSimHistorico(true);
  showToast('Simulado restaurado!', 'success');
}

// ── FAVORITAS ─────────────────────────────
function renderSimFavoritas() {
  const el  = document.getElementById('sim-favoritas-list');
  const sec = document.getElementById('sim-favoritas-section');
  if (!el) return;
  if (!simFavSalvas.length) { if (sec) sec.style.display = 'none'; return; }
  if (sec) sec.style.display = 'block';

  const porMat = {};
  simFavSalvas.forEach(q => {
    const m = q.materia || 'Geral';
    if (!porMat[m]) porMat[m] = [];
    porMat[m].push(q);
  });

  el.innerHTML = Object.entries(porMat).map(([mat, qs]) => `
    <div style="margin-bottom:14px">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:6px">${mat} (${qs.length})</div>
      ${qs.map((q) => {
        const idxGlobal = simFavSalvas.indexOf(q);
        return `<div style="padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.04);border-radius:8px;transition:background .15s" onmouseover="this.style.background='rgba(139,92,246,.08)'" onmouseout="this.style.background='transparent'">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
            <div onclick="verQuestaoFavorita(${idxGlobal})" style="cursor:pointer;flex:1">
              <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">${q.enunciado.slice(0,120)}...</div>
              ${q.comentario?`<div style="font-size:11px;color:var(--info);margin-top:4px">💬 ${q.comentario}</div>`:''}
              <div style="font-size:10px;color:var(--accent);margin-top:4px">Toque para ver questão completa</div>
            </div>
            <button onclick="simDesfavoritar(${idxGlobal})" title="Desfavoritar"
              style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:16px;padding:2px 4px;flex-shrink:0" title="Remover dos favoritos">✕</button>
          </div>
        </div>`;
      }).join('')}
    </div>`
  ).join('');
}

// FIX IDEIA: botão de desfavoritar questão individual
function simDesfavoritar(idx) {
  simFavSalvas.splice(idx, 1);
  localStorage.setItem('luia_sim_favs', JSON.stringify(simFavSalvas));
  fetch(`${SUPA_URL}/rest/v1/study_goals?id=eq.1`, {
    method: 'PATCH', headers: { ...H, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ sim_favoritas: simFavSalvas })
  }).catch(() => {});
  renderSimFavoritas();
  showToast('Questão removida dos favoritos.', 'info');
}

// ── VER QUESTÃO FAVORITA ──────────────────
function verQuestaoFavorita(idx) {
  const q = simFavSalvas[idx];
  if (!q) return;
  const letras  = ['A','B','C','D','E'];
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:#0F172A;z-index:9999;display:flex;flex-direction:column;font-family:Inter,sans-serif';
  const header = document.createElement('div');
  header.style.cssText = 'background:linear-gradient(135deg,#0F172A,#1E1B4B);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;border-bottom:1px solid rgba(124,58,237,.3)';
  header.innerHTML = `<div style="display:flex;align-items:center;gap:12px">
    <button onclick="this.closest('[style*=fixed]').remove()" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:8px;color:#fff;font-size:12px;cursor:pointer;padding:7px 14px;font-weight:600">← Voltar</button>
    <div><div style="font-size:14px;font-weight:700;color:#fff">${q.materia||'Questão favorita'}</div>
    <div style="font-size:11px;color:rgba(167,139,250,.8)">${q.topico||''}</div></div></div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  overlay.appendChild(header);
  const scroll = document.createElement('div');
  scroll.style.cssText = 'flex:1;overflow-y:auto;padding:20px;max-width:720px;width:100%;margin:0 auto;box-sizing:border-box';
  const enuncFmt = (q.enunciado||'').replace(/---+/g,'<div style="border-top:1px solid rgba(255,255,255,.1);margin:12px 0"></div>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  const altsHtml = letras.slice(0,5).map(l => {
    let txt = '';
    if (q.alternativas && typeof q.alternativas==='object' && !Array.isArray(q.alternativas)) txt = q.alternativas[l]||'';
    else if (Array.isArray(q.alternativas)) txt = q.alternativas[letras.indexOf(l)]||'';
    if (!txt) return '';
    const isCorreta = l===(q.gabarito||q.resposta_correta);
    const isResp    = l===q.resposta_dada;
    const bg     = isCorreta?'rgba(74,222,128,.12)':isResp?'rgba(248,113,113,.1)':'rgba(255,255,255,.02)';
    const border = isCorreta?'1px solid rgba(74,222,128,.4)':isResp?'1px solid rgba(248,113,113,.4)':'1px solid rgba(255,255,255,.06)';
    const color  = isCorreta?'#4ADE80':isResp?'#F87171':'rgba(255,255,255,.6)';
    return `<div style="padding:10px 14px;margin:5px 0;border-radius:8px;background:${bg};border:${border};font-size:13px;color:${color};display:flex;gap:10px">
      <span style="font-weight:700;flex-shrink:0">${l})</span><span>${txt}</span>${isCorreta?'<span style="margin-left:auto">✓</span>':isResp?'<span style="margin-left:auto">✗</span>':''}
    </div>`;
  }).join('');
  scroll.innerHTML = `<div style="padding:16px;background:rgba(255,255,255,.03);border-radius:12px;border-left:3px solid #F59E0B;margin-bottom:20px">
    <div style="font-size:13px;color:#E2E8F0;line-height:1.7;margin-bottom:12px">${enuncFmt}</div>
    ${altsHtml}
    ${q.explicacao?`<div style="margin-top:12px;padding:12px;background:rgba(74,222,128,.06);border-radius:8px;font-size:12px;color:#94A3B8;line-height:1.7;border-left:2px solid rgba(74,222,128,.3)"><strong style="color:#4ADE80">Explicação:</strong> ${q.explicacao}</div>`:''}
    ${q.comentario?`<div style="margin-top:10px;padding:10px;background:rgba(56,189,248,.06);border-radius:8px;font-size:12px;color:#38BDF8;border-left:2px solid rgba(56,189,248,.3);display:flex;gap:8px;align-items:flex-start">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${q.comentario}</div>`:''}
  </div>`;
  overlay.appendChild(scroll);
  document.body.appendChild(overlay);
}

// ── VER SIMULADO COMPLETO ─────────────────
function verSimulado(idx) {
  const s = simHistorico[idx];
  if (!s || !s.questoes || !s.questoes.length) { showToast('Questões não disponíveis para este simulado.', 'info'); return; }
  const letras = ['A','B','C','D','E'];
  const cor    = s.pct>=80?'#4ADE80':s.pct>=60?'#FBBF24':'#F87171';
  let html = `<div id="ver-sim-overlay" style="position:fixed;inset:0;background:#0F172A;z-index:9999;display:flex;flex-direction:column" onclick="if(event.target.id==='ver-sim-overlay')this.remove()">
    <div style="background:linear-gradient(135deg,#0F172A,#1E1B4B);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;border-bottom:1px solid rgba(124,58,237,.3)">
      <div style="display:flex;align-items:center;gap:12px">
        <button onclick="document.getElementById('ver-sim-overlay').remove()" style="background:rgba(255,255,255,.08);border:none;border-radius:8px;color:#fff;font-size:13px;cursor:pointer;padding:6px 12px;font-weight:600">← Voltar</button>
        <div><div style="font-size:14px;font-weight:700;color:#fff">${s.materia} · ${s.topico}</div>
        <div style="font-size:11px;color:rgba(255,255,255,.5)">${fmtDate(s.data)}${s.hora?' · '+s.hora:''} · ${s.nivel}</div></div>
      </div>
      <div style="text-align:right">
        <div style="font-family:'Poppins',sans-serif;font-size:1.4rem;font-weight:800;color:${cor}">${s.pct}%</div>
        <div style="font-size:10px;color:rgba(255,255,255,.4)">${s.acertos}/${s.total} certas</div>
      </div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:20px;max-width:760px;width:100%;margin:0 auto">
      ${s.questoes.map((q,qi) => {
        const resp  = s.respostas ? s.respostas[qi] : null;
        const certa = resp === q.gabarito;
        return `<div style="margin-bottom:20px;padding:16px;background:rgba(255,255,255,.03);border-radius:10px;border-left:3px solid ${certa?'#4ADE80':'#F87171'}">
          <div style="font-size:11px;font-weight:700;color:${certa?'#4ADE80':'#F87171'};margin-bottom:8px">${qi+1}. ${certa?'✓ Correto':'✗ Errado'}${s.favoritas&&s.favoritas[qi]?' ⭐':''}</div>
          <div style="font-size:13px;color:var(--text-primary);margin-bottom:10px;line-height:1.6">${q.enunciado.replace(/---+/g,'<hr style="border-color:rgba(255,255,255,.1);margin:8px 0">').replace(/\n/g,'<br>')}</div>
          ${letras.slice(0,5).map(l => {
            const alt      = q.alternativas && q.alternativas[l] ? l+') '+q.alternativas[l] : '';
            const isCorreta= l===q.gabarito;
            const isResp   = l===resp;
            const bg     = isCorreta?'rgba(74,222,128,.12)':isResp?'rgba(248,113,113,.12)':'transparent';
            const border = isCorreta?'rgba(74,222,128,.4)':isResp?'rgba(248,113,113,.4)':'rgba(255,255,255,.06)';
            return `<div style="padding:8px 12px;margin:4px 0;border-radius:8px;background:${bg};border:1px solid ${border};font-size:12px;color:var(--text-secondary)">${alt}</div>`;
          }).join('')}
          ${q.explicacao?`<div style="margin-top:10px;padding:10px;background:rgba(74,222,128,.06);border-radius:8px;font-size:12px;color:var(--text-secondary);line-height:1.6">💡 ${q.explicacao}</div>`:''}
          ${s.comentarios&&s.comentarios[qi]?`<div style="margin-top:6px;font-size:11px;color:var(--info)">💬 ${s.comentarios[qi]}</div>`:''}
        </div>`;
      }).join('')}
    </div>
  </div>`;
  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div.firstElementChild);
}

// ── CARD DO DASHBOARD ─────────────────────
function renderSimDash() {
  const el = document.getElementById('sim-dash-wrap');
  if (!el || !simHistorico.length) return;
  const totalSim   = simHistorico.length;
  const mediaAcertos = Math.round(simHistorico.reduce((a,s) => a+s.pct, 0) / totalSim);
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
      <div style="text-align:center;padding:10px;background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.15);border-radius:10px">
        <div style="font-family:'Poppins',sans-serif;font-size:1.3rem;font-weight:700;color:#A78BFA">${totalSim}</div>
        <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em">Simulados</div>
      </div>
      <div style="text-align:center;padding:10px;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.15);border-radius:10px">
        <div style="font-family:'Poppins',sans-serif;font-size:1.3rem;font-weight:700;color:#4ADE80">${mediaAcertos}%</div>
        <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em">Média de acertos</div>
      </div>
      <div style="text-align:center;padding:10px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.15);border-radius:10px;grid-column:span 2">
        <div style="font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:700;color:#FBBF24">${(()=>{
          const mp={};
          simHistorico.filter(s=>!s.arquivado).forEach(s=>{
            if(!mp[s.materia]) mp[s.materia]={t:0,a:0};
            mp[s.materia].t+=s.total||0; mp[s.materia].a+=s.acertos||0;
          });
          const best=Object.entries(mp).filter(e=>e[1].t>0).sort((a,b)=>(b[1].a/b[1].t)-(a[1].a/a[1].t))[0];
          return best?best[0]:'—';
        })()}</div>
        <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em">Melhor matéria</div>
      </div>
    </div>`;
}

// ── UTILITÁRIO INTERNO ────────────────────
// Centraliza a troca de tela do módulo de simulados
function _simShowTela(tela) {
  document.getElementById('sim-tela-config').style.display    = tela === 'config'    ? 'block' : 'none';
  document.getElementById('sim-tela-prova').style.display     = tela === 'prova'     ? 'block' : 'none';
  document.getElementById('sim-tela-resultado').style.display = tela === 'resultado' ? 'block' : 'none';
}

// ── WRAPPERS DE AUTH ──────────────────────
function _authIniciarSimulado()    { if (_visitanteBlocked('gerar simulado')) return; comAuth(() => iniciarSimulado()); }
function _authNovoSimuladoErros()  { if (_visitanteBlocked('repetir erros')) return; novoSimulado(true); }

// ── ALIASES — compatibilidade com nomes do index.html ────────────
// O index.html usa nomes anteriores; mantemos aqui para não precisar
// alterar o HTML agora. Quando migrar o HTML, estes podem ser removidos.

// Navegação
function irQuestao(idx)    { simIrPara(idx); }
function proximaQuestao()  { simAvancar(); }

// Favoritar
function toggleFavorita()  { simToggleFav(); }

// Confirmar (botão que ainda existe no HTML)
function confirmarResposta() { simConfirmar(); }

// Comentário — usa painel inline do HTML em vez de prompt()
function abrirComentario() {
  const modal = document.getElementById('sim-modal-com');
  if (!modal) { simAbrirComentario(); return; }
  const txt = document.getElementById('sim-comentario-txt');
  if (txt) txt.value = simComentarios[simAtual] || '';
  modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

function salvarComentario() {
  const txt = document.getElementById('sim-comentario-txt');
  if (txt) simComentarios[simAtual] = txt.value.trim();
  const modal = document.getElementById('sim-modal-com');
  if (modal) modal.style.display = 'none';
  renderQuestao();
  showToast('Anotação salva!', 'success');
}
