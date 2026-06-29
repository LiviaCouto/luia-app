// ═══════════════════════════════════════════════════════
//  NOVA-PROVA.JS — Luia App
//  Fluxo completo: upload de edital → IA extrai → plano
//  Dependências: config.js, app.js (SUPA_URL, SUPA_KEY, H, showToast)
// ═══════════════════════════════════════════════════════

// ── ESTADO DO FLUXO ────────────────────────────────────
let _np = {
  passo:       1,          // 1 | 2 | 3 | 4 | 5
  nome:        '',
  subtitulo:   '',
  icone:       '🎓',
  dataProva:   '',
  dataProva2:  '',
  horasSemana: 10,
  linguaExt:   'ingles',
  pdfBase64:   null,
  pdfNome:     '',
  editalJson:  null,       // resultado da extração da IA
  planoJson:   null,       // cronograma gerado pela IA
  provaId:     ''          // slug gerado do nome
};

// ── ABRIR / FECHAR MODAL ───────────────────────────────
function abrirNovaProva() {
  // Reset
  _np = { passo:1, nome:'', subtitulo:'', icone:'🎓', dataProva:'', dataProva2:'',
    horasSemana:10, linguaExt:'ingles', pdfBase64:null, pdfNome:'', editalJson:null,
    planoJson:null, provaId:'' };

  let overlay = document.getElementById('np-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'np-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9000;background:rgba(10,7,20,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  _npRenderPasso();
}

function fecharNovaProva() {
  const overlay = document.getElementById('np-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ── RENDER DO MODAL ────────────────────────────────────
function _npRenderPasso() {
  const overlay = document.getElementById('np-overlay');
  if (!overlay) return;

  const passos = ['Identificação', 'Edital', 'Confirmar assuntos', 'Gerar plano', 'Pronto!'];
  const progressBar = passos.map((p, i) => {
    const done  = i + 1 < _np.passo;
    const atual = i + 1 === _np.passo;
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1">' +
      '<div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;' +
        (done  ? 'background:#8B5CF6;color:#fff' :
         atual ? 'background:#A78BFA;color:#fff;box-shadow:0 0 0 3px rgba(139,92,246,.3)' :
                 'background:rgba(255,255,255,.08);color:rgba(255,255,255,.3)') + '">' +
        (done ? '✓' : (i+1)) +
      '</div>' +
      '<div style="font-size:9px;font-weight:600;text-align:center;' +
        (atual ? 'color:#A78BFA' : done ? 'color:#8B5CF6' : 'color:rgba(255,255,255,.25)') + '">' + p + '</div>' +
    '</div>' +
    (i < passos.length - 1 ? '<div style="flex:1;height:1px;background:' + (done ? '#8B5CF6' : 'rgba(255,255,255,.08)') + ';margin-top:14px"></div>' : '');
  }).join('');

  let conteudo = '';
  if (_np.passo === 1) conteudo = _npPasso1();
  if (_np.passo === 2) conteudo = _npPasso2();
  if (_np.passo === 3) conteudo = _npPasso3();
  if (_np.passo === 4) conteudo = _npPasso4();
  if (_np.passo === 5) conteudo = _npPasso5();

  overlay.innerHTML =
    '<div style="background:linear-gradient(145deg,#110D25,#1A1435);border:1px solid rgba(139,92,246,.25);border-radius:20px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column">' +
      // Header
      '<div style="padding:22px 24px 16px;border-bottom:1px solid rgba(139,92,246,.15);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">' +
        '<div>' +
          '<div style="font-size:10px;font-weight:700;color:#8B5CF6;letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px">✦ Nova prova</div>' +
          '<div style="font-size:17px;font-weight:700;color:#F8F5FF">' + passos[_np.passo - 1] + '</div>' +
        '</div>' +
        '<button onclick="fecharNovaProva()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:rgba(255,255,255,.5);cursor:pointer;padding:6px 11px;font-size:13px">✕</button>' +
      '</div>' +
      // Progress
      '<div style="padding:16px 24px;display:flex;align-items:flex-start;gap:0;border-bottom:1px solid rgba(139,92,246,.1)">' +
        progressBar +
      '</div>' +
      // Conteúdo
      '<div style="padding:24px;flex:1">' + conteudo + '</div>' +
    '</div>';
}

// ── PASSO 1 — Identificação ────────────────────────────
function _npPasso1() {
  return '<div style="display:flex;flex-direction:column;gap:14px">' +
    _npField('Nome da prova', 'text', 'np-nome', _np.nome, 'Ex: SSA 1 · UPE, ENEM 2027, NCE Ciências...') +
    _npField('Instituição / subtítulo', 'text', 'np-subtitulo', _np.subtitulo, 'Ex: Universidade de Pernambuco · 1ª Fase') +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      _npField('Data da prova (1º dia)', 'date', 'np-data1', _np.dataProva, '') +
      _npField('Data da prova (2º dia)', 'date', 'np-data2', _np.dataProva2, 'opcional') +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      _npField('Horas de estudo por semana', 'number', 'np-horas', _np.horasSemana, '10') +
      '<div>' +
        '<div style="font-size:10px;font-weight:700;color:#8B5CF6;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Língua estrangeira</div>' +
        '<select id="np-lingua" style="width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(139,92,246,.22);border-radius:8px;padding:10px 12px;color:#F8F5FF;font-size:13px;font-family:inherit">' +
          '<option value="ingles"' + (_np.linguaExt === 'ingles' ? ' selected' : '') + '>Inglês</option>' +
          '<option value="espanhol"' + (_np.linguaExt === 'espanhol' ? ' selected' : '') + '>Espanhol</option>' +
        '</select>' +
      '</div>' +
    '</div>' +
    '<div style="margin-top:8px;display:flex;justify-content:flex-end">' +
      '<button onclick="_npProximo()" style="background:#8B5CF6;color:#fff;border:none;border-radius:8px;padding:11px 28px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">Próximo →</button>' +
    '</div>' +
  '</div>';
}

// ── PASSO 2 — Upload do edital ─────────────────────────
function _npPasso2() {
  return '<div style="display:flex;flex-direction:column;gap:16px">' +
    '<div style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.7">' +
      'Suba o edital em PDF. A IA vai ler, extrair as matérias, tópicos e leituras obrigatórias automaticamente.' +
    '</div>' +

    // Drop zone
    '<div id="np-dropzone" onclick="document.getElementById(\'np-file-input\').click()" ' +
      'ondragover="event.preventDefault();this.style.borderColor=\'#8B5CF6\'" ' +
      'ondragleave="this.style.borderColor=\'rgba(139,92,246,.25)\'" ' +
      'ondrop="_npOnDrop(event)" ' +
      'style="border:2px dashed rgba(139,92,246,.3);border-radius:14px;padding:36px 20px;text-align:center;cursor:pointer;transition:all .2s">' +
      '<div style="font-size:2.2rem;margin-bottom:12px">📄</div>' +
      '<div style="font-size:14px;font-weight:600;color:#A78BFA;margin-bottom:6px">' +
        (_np.pdfNome || 'Clique ou arraste o PDF aqui') +
      '</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,.3)">' +
        (_np.pdfNome ? '✓ Arquivo carregado — clique para trocar' : 'Somente arquivos .pdf') +
      '</div>' +
    '</div>' +
    '<input type="file" id="np-file-input" accept=".pdf" style="display:none" onchange="_npOnFileSelect(event)">' +

    (_np.pdfBase64 ?
      '<div style="background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2);border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:1.4rem">✅</span>' +
        '<div><div style="font-size:13px;font-weight:600;color:#A78BFA">' + _np.pdfNome + '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,.4)">Pronto para enviar à IA</div></div>' +
      '</div>' : '') +

    '<div style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);border-radius:10px;padding:12px 14px;font-size:12px;color:rgba(245,158,11,.8);line-height:1.6">' +
      '⚡ <strong>Dica:</strong> Não tem o PDF? Você pode pular e cadastrar os assuntos manualmente no próximo passo.' +
    '</div>' +

    '<div style="display:flex;gap:10px;justify-content:space-between">' +
      '<button onclick="_np.passo=1;_npRenderPasso()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 20px;color:rgba(255,255,255,.6);cursor:pointer;font-size:13px;font-family:inherit">← Voltar</button>' +
      '<div style="display:flex;gap:8px">' +
        '<button onclick="_npPularEdital()" style="background:transparent;border:1px solid rgba(139,92,246,.3);border-radius:8px;padding:10px 18px;color:#A78BFA;cursor:pointer;font-size:13px;font-family:inherit">Pular →</button>' +
        '<button onclick="_npExtrairEdital()" ' +
          (!_np.pdfBase64 ? 'disabled style="opacity:.4;cursor:not-allowed;' : 'style="') +
          'background:#8B5CF6;color:#fff;border:none;border-radius:8px;padding:11px 22px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">✦ Extrair com IA</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ── PASSO 3 — Confirmar assuntos ───────────────────────
function _npPasso3() {
  if (!_np.editalJson) {
    return '<div style="text-align:center;padding:32px 0;color:rgba(255,255,255,.4)">' +
      'Nenhum edital extraído. Use os campos abaixo para cadastrar manualmente.' +
      '</div>' + _npFormManual();
  }

  const ed = _np.editalJson;
  const areas = ed.areas || [];

  return '<div style="display:flex;flex-direction:column;gap:16px">' +
    '<div style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.6">' +
      'A IA extraiu os seguintes assuntos do seu edital. Revise, remova o que não quiser e confirme.' +
    '</div>' +

    areas.map((area, ai) =>
      '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(139,92,246,.15);border-radius:12px;padding:14px 16px;margin-bottom:4px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
          '<div style="font-size:12px;font-weight:700;color:#A78BFA;text-transform:uppercase;letter-spacing:.06em">' +
            (area.icone || '📚') + ' ' + (area.nome || 'Área ' + (ai+1)) +
          '</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,.3)">' + (area.questoes ? area.questoes + ' questões' : '') + '</div>' +
        '</div>' +
        (area.topicos || []).map((t, ti) =>
          '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">' +
            '<input type="checkbox" id="np-t-' + ai + '-' + ti + '" checked ' +
              'onchange="_npToggleTopico(' + ai + ',' + ti + ',this.checked)" ' +
              'style="accent-color:#8B5CF6;width:15px;height:15px;flex-shrink:0">' +
            '<label for="np-t-' + ai + '-' + ti + '" style="font-size:12.5px;color:rgba(255,255,255,.75);cursor:pointer;line-height:1.5">' +
              (t.materia ? '<span style="font-size:10px;color:#8B5CF6;font-weight:600;margin-right:6px">' + t.materia + '</span>' : '') +
              (t.titulo || t) +
            '</label>' +
          '</div>'
        ).join('') +
      '</div>'
    ).join('') +

    (ed.leituras && ed.leituras.length ?
      '<div style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);border-radius:10px;padding:12px 16px">' +
        '<div style="font-size:11px;font-weight:700;color:#F59E0B;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">📚 Leituras obrigatórias</div>' +
        ed.leituras.map(l => '<div style="font-size:12px;color:rgba(255,255,255,.6);padding:3px 0">· ' + (l.autor || '') + ' — <em>' + (l.titulo || l) + '</em></div>').join('') +
      '</div>' : '') +

    '<div style="display:flex;gap:10px;justify-content:space-between;margin-top:8px">' +
      '<button onclick="_np.passo=2;_npRenderPasso()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 20px;color:rgba(255,255,255,.6);cursor:pointer;font-size:13px;font-family:inherit">← Voltar</button>' +
      '<button onclick="_npGerarPlano()" style="background:#8B5CF6;color:#fff;border:none;border-radius:8px;padding:11px 28px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">✦ Gerar plano →</button>' +
    '</div>' +
  '</div>';
}

// ── PASSO 4 — Gerando plano (loading) ─────────────────
function _npPasso4() {
  return '<div style="text-align:center;padding:32px 16px;display:flex;flex-direction:column;align-items:center;gap:20px">' +
    '<div style="font-size:3rem;animation:spin 2s linear infinite">⚙️</div>' +
    '<div>' +
      '<div style="font-size:16px;font-weight:700;color:#F8F5FF;margin-bottom:8px" id="np-loading-txt">Criando seu plano de estudos...</div>' +
      '<div style="font-size:13px;color:rgba(255,255,255,.4)" id="np-loading-sub">A IA está distribuindo os conteúdos pelos seus dias disponíveis.</div>' +
    '</div>' +
    '<div style="width:200px;height:4px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden">' +
      '<div id="np-loading-bar" style="height:100%;background:linear-gradient(90deg,#8B5CF6,#A78BFA);border-radius:99px;width:0%;transition:width .4s"></div>' +
    '</div>' +
  '</div>' +
  '<style>@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style>';
}

// ── PASSO 5 — Pronto! ──────────────────────────────────
function _npPasso5() {
  const prova = _np;
  return '<div style="text-align:center;padding:24px 16px;display:flex;flex-direction:column;align-items:center;gap:20px">' +
    '<div style="font-size:4rem">🎓</div>' +
    '<div>' +
      '<div style="font-size:20px;font-weight:700;color:#F8F5FF;margin-bottom:8px">' + prova.nome + ' configurada!</div>' +
      '<div style="font-size:13.5px;color:rgba(255,255,255,.5);line-height:1.7">' +
        'Seu plano de estudos está pronto.<br>A Luísa pode começar agora.' +
      '</div>' +
    '</div>' +

    (_np.planoJson ?
      '<div style="background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2);border-radius:12px;padding:16px 20px;text-align:left;width:100%">' +
        '<div style="font-size:11px;font-weight:700;color:#A78BFA;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">📅 Resumo do plano</div>' +
        '<div style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.9">' +
          '📆 ' + (_np.planoJson.totalDias || '—') + ' dias de estudo planejados<br>' +
          '📚 ' + (_np.planoJson.totalTopicos || '—') + ' tópicos distribuídos<br>' +
          '⏱️ ' + (_np.horasSemana) + 'h por semana<br>' +
          '🎯 Prova em ' + (_np.dataProva ? new Date(_np.dataProva + 'T12:00').toLocaleDateString('pt-BR') : '—') +
        '</div>' +
      '</div>' : '') +

    '<button onclick="_npFinalizar()" style="background:linear-gradient(135deg,#7C3AED,#A78BFA);color:#fff;border:none;border-radius:10px;padding:14px 36px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;width:100%">✦ Começar a estudar!</button>' +
  '</div>';
}

// ── HELPERS DE CAMPO ───────────────────────────────────
function _npField(label, type, id, value, placeholder) {
  return '<div>' +
    '<div style="font-size:10px;font-weight:700;color:#8B5CF6;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">' + label + '</div>' +
    '<input type="' + type + '" id="' + id + '" value="' + (value || '') + '" placeholder="' + (placeholder || '') + '" ' +
      'style="width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(139,92,246,.22);border-radius:8px;padding:10px 12px;color:#F8F5FF;font-size:13px;font-family:inherit;outline:none" ' +
      'onfocus="this.style.borderColor=\'#8B5CF6\'" onblur="this.style.borderColor=\'rgba(139,92,246,.22)\'">' +
  '</div>';
}

function _npFormManual() {
  return '<div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">' +
    '<div style="font-size:12px;color:rgba(255,255,255,.4)">Cadastre as matérias manualmente:</div>' +
    '<textarea id="np-materias-manual" rows="6" placeholder="Uma matéria por linha. Ex:\nPortuguês\nMatemática\nHistória" ' +
      'style="width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(139,92,246,.22);border-radius:8px;padding:12px;color:#F8F5FF;font-size:13px;font-family:inherit;resize:vertical"></textarea>' +
    '<div style="display:flex;gap:10px;justify-content:space-between">' +
      '<button onclick="_np.passo=2;_npRenderPasso()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 20px;color:rgba(255,255,255,.6);cursor:pointer;font-size:13px;font-family:inherit">← Voltar</button>' +
      '<button onclick="_npSalvarManual()" style="background:#8B5CF6;color:#fff;border:none;border-radius:8px;padding:11px 28px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">Confirmar →</button>' +
    '</div>' +
  '</div>';
}

// ── AÇÕES ──────────────────────────────────────────────
function _npProximo() {
  const nome = document.getElementById('np-nome')?.value.trim();
  if (!nome) { showToast('Digite o nome da prova!', 'error'); return; }
  const data1 = document.getElementById('np-data1')?.value;
  if (!data1) { showToast('Informe a data da prova!', 'error'); return; }

  _np.nome        = nome;
  _np.subtitulo   = document.getElementById('np-subtitulo')?.value.trim() || '';
  _np.dataProva   = data1;
  _np.dataProva2  = document.getElementById('np-data2')?.value || '';
  _np.horasSemana = parseInt(document.getElementById('np-horas')?.value) || 10;
  _np.linguaExt   = document.getElementById('np-lingua')?.value || 'ingles';
  _np.provaId     = nome.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    .substring(0, 30);

  _np.passo = 2;
  _npRenderPasso();
}

function _npOnFileSelect(e) {
  const file = e.target.files[0];
  if (!file || !file.name.endsWith('.pdf')) { showToast('Selecione um arquivo PDF!', 'error'); return; }
  _npLerPDF(file);
}

function _npOnDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file || !file.name.endsWith('.pdf')) { showToast('Selecione um arquivo PDF!', 'error'); return; }
  _npLerPDF(file);
}

function _npLerPDF(file) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    _np.pdfBase64 = ev.target.result.split(',')[1];
    _np.pdfNome   = file.name;
    _npRenderPasso();
  };
  reader.readAsDataURL(file);
}

function _npPularEdital() {
  _np.editalJson = null;
  _np.passo = 3;
  _npRenderPasso();
}

async function _npExtrairEdital() {
  if (!_np.pdfBase64) return;

  // Mostra loading inline
  const btn = document.querySelector('[onclick="_npExtrairEdital()"]');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Lendo edital...'; }

  try {
    const prompt = `Você é um especialista em currículos escolares brasileiros e editais de vestibulares.

Analise o edital/manual do candidato em PDF enviado e extraia estruturadamente:

1. Nome completo da prova e instituição
2. Todas as ÁREAS de conhecimento com número de questões (se mencionado)
3. Todos os TÓPICOS e subtópicos de cada área/matéria
4. LEITURAS obrigatórias ou recomendadas (título, autor, estilo literário)
5. Quais conteúdos/tópicos aparecem com MAIOR frequência ou destaque (peso alto)

RETORNE APENAS um JSON válido neste formato, sem markdown, sem texto antes ou depois:
{
  "nome": "nome completo da prova",
  "instituicao": "nome da instituição",
  "areas": [
    {
      "id": "slug_da_area",
      "nome": "Nome da Área",
      "icone": "emoji relevante",
      "questoes": 23,
      "topicos": [
        {
          "materia": "Nome da Matéria",
          "titulo": "Título do Tópico",
          "peso": "alto|medio|baixo",
          "subtopicos": ["subtópico 1", "subtópico 2"]
        }
      ]
    }
  ],
  "leituras": [
    {
      "titulo": "Título do livro",
      "autor": "Nome do autor",
      "estilo": "período/estilo literário",
      "prioridade": "alta|media"
    }
  ]
}`;

    const resp = await fetch(`${SUPA_URL}/functions/v1/gerar-questoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPA_KEY },
      body: JSON.stringify({
        prompt,
        pdf_base64: _np.pdfBase64,
        tipo: 'extrair_edital'
      })
    });

    const txt  = await resp.text();
    const json = JSON.parse(txt.replace(/```json|```/g, '').trim());

    _np.editalJson = json;
    _np.passo = 3;
    _npRenderPasso();

  } catch(e) {
    console.error('Erro ao extrair edital:', e);
    showToast('Erro ao ler o edital. Você pode cadastrar manualmente.', 'error');
    _np.editalJson = null;
    _np.passo = 3;
    _npRenderPasso();
  }
}

function _npToggleTopico(areaIdx, topicoIdx, checked) {
  if (!_np.editalJson?.areas?.[areaIdx]?.topicos?.[topicoIdx]) return;
  _np.editalJson.areas[areaIdx].topicos[topicoIdx]._ativo = checked !== false;
}

function _npSalvarManual() {
  const txt = document.getElementById('np-materias-manual')?.value.trim();
  if (!txt) { showToast('Digite pelo menos uma matéria!', 'error'); return; }
  const materias = txt.split('\n').map(m => m.trim()).filter(Boolean);
  _np.editalJson = {
    nome: _np.nome,
    areas: [{ id: 'geral', nome: 'Conteúdo da prova', icone: '📚', questoes: null,
      topicos: materias.map(m => ({ materia: m, titulo: m, peso: 'medio', subtopicos: [] })) }],
    leituras: []
  };
  _npGerarPlano();
}

async function _npGerarPlano() {
  // Filtra tópicos desmarcados
  if (_np.editalJson?.areas) {
    _np.editalJson.areas = _np.editalJson.areas.map(area => ({
      ...area,
      topicos: (area.topicos || []).filter(t => t._ativo !== false)
    }));
  }

  _np.passo = 4;
  _npRenderPasso();

  // Anima a barra de progresso
  let prog = 0;
  const barInterval = setInterval(() => {
    prog = Math.min(prog + 3, 85);
    const bar = document.getElementById('np-loading-bar');
    if (bar) bar.style.width = prog + '%';
  }, 200);

  const msgs = [
    { t: 800,  txt: 'Calculando os dias disponíveis...', sub: 'Da data de hoje até a prova.' },
    { t: 3000, txt: 'Distribuindo os tópicos...', sub: 'Priorizando os conteúdos de maior peso.' },
    { t: 6000, txt: 'Criando revisões espaçadas...', sub: 'Ciclos de 1d, 7d, 15d e 30d.' },
    { t: 9000, txt: 'Finalizando o plano...', sub: 'Quase lá!' }
  ];
  msgs.forEach(m => setTimeout(() => {
    const el = document.getElementById('np-loading-txt');
    const sub = document.getElementById('np-loading-sub');
    if (el) el.textContent = m.txt;
    if (sub) sub.textContent = m.sub;
  }, m.t));

  try {
    const diasDisponiveis = Math.ceil(
      (new Date(_np.dataProva + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24)
    );
    const sessoesSemanais = Math.round(_np.horasSemana / 1.5);
    const totalSessoes    = Math.round((diasDisponiveis / 7) * sessoesSemanais);

    const prompt = `Você é um especialista em planejamento de estudos para vestibulares brasileiros.

PROVA: ${_np.nome}
DATA DA PROVA: ${_np.dataProva}
DIAS DISPONÍVEIS: ${diasDisponiveis} dias (de hoje até a prova)
HORAS DE ESTUDO POR SEMANA: ${_np.horasSemana}h
SESSÕES POSSÍVEIS: ~${totalSessoes} sessões no total
LÍNGUA ESTRANGEIRA: ${_np.linguaExt}

EDITAL / CONTEÚDO:
${JSON.stringify(_np.editalJson, null, 2)}

Crie um cronograma de estudos COMPLETO e DETALHADO.

REGRAS:
- Distribua todos os tópicos do edital ao longo dos ${diasDisponiveis} dias
- Priorize tópicos com maior peso/frequência na prova
- Intercale matérias ao longo da semana (não coloque a mesma matéria em dias consecutivos)
- Reserve 20% do tempo final para revisões gerais
- Inclua simulados nos últimos 30 dias
- Cada sessão deve ter um conteúdo específico e acionável

RETORNE APENAS um JSON válido neste formato:
{
  "totalDias": 160,
  "totalTopicos": 44,
  "semanas": [
    {
      "semana": 1,
      "periodo": "06/07–12/07",
      "foco": "Introdução + Bases",
      "dias": [
        {
          "data": "2026-07-06",
          "dia": "Seg",
          "materia": "Nome da matéria",
          "topico": "Tópico específico",
          "conteudo": "Descrição detalhada do que estudar nesse dia",
          "tipo": "teoria|exercicios|simulado|revisao",
          "duracao_min": 90
        }
      ]
    }
  ]
}`;

    const resp = await fetch(`${SUPA_URL}/functions/v1/gerar-questoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPA_KEY },
      body: JSON.stringify({ prompt, tipo: 'gerar_plano' })
    });

    const txt  = await resp.text();
    const json = JSON.parse(txt.replace(/```json|```/g, '').trim());

    clearInterval(barInterval);
    const bar = document.getElementById('np-loading-bar');
    if (bar) bar.style.width = '100%';

    _np.planoJson = json;

    // Salva no Supabase
    await _npSalvarSupabase();

  } catch(e) {
    clearInterval(barInterval);
    console.error('Erro ao gerar plano:', e);
    showToast('Erro ao gerar o plano. Tente novamente.', 'error');
    _np.passo = 3;
    _npRenderPasso();
  }
}

// ── SALVAR NO SUPABASE ─────────────────────────────────
async function _npSalvarSupabase() {
  try {
    // 1. Insere/atualiza a prova
    const provaBody = {
      id:           _np.provaId,
      nome:         _np.nome,
      subtitulo:    _np.subtitulo,
      icone:        _np.icone,
      data_prova:   _np.dataProva,
      data_prova2:  _np.dataProva2 || null,
      status:       'ativa',
      lingua_ext:   _np.linguaExt,
      horas_semana: _np.horasSemana,
      edital_json:  _np.editalJson,
      plano_json:   _np.planoJson
    };

    const rProva = await fetch(`${SUPA_URL}/rest/v1/provas`, {
      method: 'POST',
      headers: { ...H, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(provaBody)
    });
    if (!rProva.ok) throw new Error(await rProva.text());

    // 2. Arquiva todas as provas ativas anteriores
    await fetch(`${SUPA_URL}/rest/v1/provas?status=eq.ativa&id=neq.${_np.provaId}`, {
      method: 'PATCH',
      headers: { ...H, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ status: 'arquivada' })
    });

    // 3. Insere os dias do plano
    if (_np.planoJson?.semanas) {
      const dias = [];
      _np.planoJson.semanas.forEach(sem => {
        (sem.dias || []).forEach(d => {
          dias.push({
            prova_id: _np.provaId,
            data:     d.data,
            materia:  d.materia,
            topico:   d.topico,
            conteudo: d.conteudo,
            feito:    false
          });
        });
      });
      if (dias.length) {
        // Insere em lotes de 50
        for (let i = 0; i < dias.length; i += 50) {
          await fetch(`${SUPA_URL}/rest/v1/plano_dias`, {
            method: 'POST',
            headers: { ...H, 'Prefer': 'return=minimal' },
            body: JSON.stringify(dias.slice(i, i + 50))
          });
        }
      }
    }

    // 4. Atualiza prova ativa no config
    if (typeof setProvaAtiva === 'function') setProvaAtiva(_np.provaId);

    // 5. Vai para o passo final
    _np.passo = 5;
    _npRenderPasso();

  } catch(e) {
    console.error('Erro ao salvar no Supabase:', e);
    showToast('Erro ao salvar. Verifique a conexão.', 'error');
    _np.passo = 3;
    _npRenderPasso();
  }
}

// ── FINALIZAR ──────────────────────────────────────────
function _npFinalizar() {
  fecharNovaProva();
  // Recarrega o app com a nova prova ativa
  if (typeof loadFromSupabase === 'function') loadFromSupabase();
  if (typeof renderDashboard  === 'function') renderDashboard();
  showToast('✦ ' + _np.nome + ' ativada! Bora estudar!', 'success');
}

// ═══════════════════════════════════════════════════════
//  GERENCIAMENTO DE PROVAS — excluir edital
//  Acessível via Configurações ou menu de provas.
// ═══════════════════════════════════════════════════════

function abrirGerenciarProvas() {
  let overlay = document.getElementById('gp-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gp-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9000;background:rgba(10,7,20,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  _gpRender();
}

function fecharGerenciarProvas() {
  const o = document.getElementById('gp-overlay');
  if (o) o.style.display = 'none';
}

function _gpRender() {
  const overlay = document.getElementById('gp-overlay');
  if (!overlay) return;
  const provas = typeof PROVAS_DISPONIVEIS !== 'undefined' ? Object.values(PROVAS_DISPONIVEIS) : [];
  const ativaId = typeof getProvaAtivaId === 'function' ? getProvaAtivaId() : '';

  overlay.innerHTML =
    '<div style="background:linear-gradient(145deg,#110D25,#1A1435);border:1px solid rgba(139,92,246,.25);border-radius:20px;width:100%;max-width:480px;max-height:85vh;overflow-y:auto">' +
      '<div style="padding:20px 24px 14px;border-bottom:1px solid rgba(139,92,246,.15);display:flex;align-items:center;justify-content:space-between">' +
        '<div>' +
          '<div style="font-size:10px;font-weight:700;color:#8B5CF6;letter-spacing:.14em;text-transform:uppercase;margin-bottom:3px">⚙️ Gerenciar provas</div>' +
          '<div style="font-size:15px;font-weight:700;color:#F8F5FF">Seus editais cadastrados</div>' +
        '</div>' +
        '<button onclick="fecharGerenciarProvas()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:rgba(255,255,255,.5);cursor:pointer;padding:6px 11px">✕</button>' +
      '</div>' +
      '<div style="padding:20px 24px">' +
        (provas.length === 0 ? '<p style="color:rgba(255,255,255,.4);font-size:13px">Nenhuma prova cadastrada.</p>' :
          provas.map(p => {
            const isAtiva = p.id === ativaId;
            const d = new Date((p.dataProva || '2099-01-01') + 'T00:00:00');
            const dias = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
            return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(139,92,246,.15);border-radius:12px;padding:14px 16px;margin-bottom:10px">' +
              '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">' +
                '<div style="display:flex;align-items:center;gap:10px">' +
                  '<span style="font-size:1.6rem">' + (p.icone || '🎓') + '</span>' +
                  '<div>' +
                    '<div style="font-size:13px;font-weight:700;color:#F8F5FF">' + p.nome + '</div>' +
                    '<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:2px">' +
                      (dias > 0 ? dias + ' dias restantes' : 'Prova encerrada') +
                      (isAtiva ? ' · <span style="color:#A78BFA;font-weight:600">✦ Ativa</span>' : '') +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div style="display:flex;gap:8px">' +
                  (!isAtiva ? '<button onclick="setProvaAtiva(\'' + p.id + '\');fecharGerenciarProvas()" style="font-size:11px;padding:5px 12px;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.25);border-radius:7px;color:#A78BFA;cursor:pointer;font-family:inherit">Ativar</button>' : '') +
                  '<button onclick="_gpConfirmarExcluir(\'' + p.id + '\',\'' + p.nome.replace(/'/g, "\\'") + '\')" style="font-size:11px;padding:5px 12px;background:rgba(244,63,94,.08);border:1px solid rgba(244,63,94,.25);border-radius:7px;color:#F43F5E;cursor:pointer;font-family:inherit">🗑 Excluir</button>' +
                '</div>' +
              '</div>' +
            '</div>';
          }).join('')) +
        '<button onclick="abrirNovaProva();fecharGerenciarProvas()" style="width:100%;margin-top:8px;background:rgba(139,92,246,.1);border:1.5px dashed rgba(139,92,246,.3);border-radius:10px;padding:12px;color:#A78BFA;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">＋ Adicionar novo edital</button>' +
      '</div>' +
    '</div>';
}

// ── CONFIRMAR EXCLUSÃO — modal com palavra-chave ───────
function _gpConfirmarExcluir(provaId, provaNome) {
  const overlay = document.getElementById('gp-overlay');
  if (!overlay) return;

  overlay.innerHTML =
    '<div style="background:linear-gradient(145deg,#110D25,#1A1435);border:1px solid rgba(244,63,94,.3);border-radius:20px;width:100%;max-width:440px;padding:28px 28px 24px">' +
      '<div style="text-align:center;margin-bottom:20px">' +
        '<div style="font-size:2.5rem;margin-bottom:12px">⚠️</div>' +
        '<div style="font-size:16px;font-weight:700;color:#F8F5FF;margin-bottom:8px">Excluir "' + provaNome + '"?</div>' +
        '<div style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.7">' +
          'Isso vai apagar <strong style="color:#F43F5E">permanentemente</strong> todas as sessões, revisões e simulados desta prova.<br>' +
          '<strong style="color:#F8F5FF">Essa ação não pode ser desfeita.</strong>' +
        '</div>' +
      '</div>' +
      '<div style="background:rgba(244,63,94,.06);border:1px solid rgba(244,63,94,.15);border-radius:10px;padding:14px 16px;margin-bottom:16px">' +
        '<div style="font-size:10px;font-weight:700;color:#F43F5E;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Digite sua palavra-chave para confirmar</div>' +
        '<input id="gp-chave-input" type="password" placeholder="Palavra-chave..." ' +
          'style="width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(244,63,94,.3);border-radius:8px;padding:10px 12px;color:#F8F5FF;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box" ' +
          'onfocus="this.style.borderColor=\'#F43F5E\'" onblur="this.style.borderColor=\'rgba(244,63,94,.3)\'">' +
        '<div id="gp-chave-erro" style="display:none;font-size:11px;color:#F43F5E;margin-top:6px">Palavra-chave incorreta.</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
        '<button onclick="_gpRender()" style="flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:11px;color:rgba(255,255,255,.6);cursor:pointer;font-size:13px;font-family:inherit">← Voltar</button>' +
        '<button onclick="_gpExecutarExcluir(\'' + provaId + '\')" style="flex:1;background:rgba(244,63,94,.15);border:1.5px solid rgba(244,63,94,.4);border-radius:8px;padding:11px;color:#F43F5E;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit">🗑 Excluir definitivamente</button>' +
      '</div>' +
    '</div>';
}

// ── EXECUTAR EXCLUSÃO ──────────────────────────────────
async function _gpExecutarExcluir(provaId) {
  const input = document.getElementById('gp-chave-input');
  const erro  = document.getElementById('gp-chave-erro');
  const chave = input?.value.trim();

  // Valida palavra-chave
  const chaveCorreta = typeof perfilData !== 'undefined' ? perfilData.chave : null;
  if (!chaveCorreta || chave !== chaveCorreta) {
    if (erro) erro.style.display = 'block';
    if (input) input.style.borderColor = '#F43F5E';
    return;
  }

  // Botão loading
  const btn = document.querySelector('[onclick*="_gpExecutarExcluir"]');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Excluindo...'; }

  try {
    // 1. Busca session IDs da prova
    const sesss = await fetch(`${SUPA_URL}/rest/v1/sessions?prova_id=eq.${provaId}&select=id`, { headers: H });
    const sessRows = await sesss.json();
    const sessIds = (sessRows || []).map(s => s.id).filter(Boolean);

    // 2. Deleta reviews (FK) antes das sessions
    if (sessIds.length) {
      for (const id of sessIds) {
        await fetch(`${SUPA_URL}/rest/v1/reviews?session_id=eq.${id}`, { method: 'DELETE', headers: H }).catch(()=>{});
      }
      // Deleta sessions
      await fetch(`${SUPA_URL}/rest/v1/sessions?prova_id=eq.${provaId}`, { method: 'DELETE', headers: H }).catch(()=>{});
    }

    // 3. Deleta simulados e questões respondidas
    const sims = await fetch(`${SUPA_URL}/rest/v1/simulados?prova_id=eq.${provaId}&select=id`, { headers: H });
    const simRows = await sims.json();
    const simIds = (simRows || []).map(s => s.id).filter(Boolean);
    for (const id of simIds) {
      await fetch(`${SUPA_URL}/rest/v1/questoes_respondidas?simulado_id=eq.${id}`, { method: 'DELETE', headers: H }).catch(()=>{});
    }
    if (simIds.length) {
      await fetch(`${SUPA_URL}/rest/v1/simulados?prova_id=eq.${provaId}`, { method: 'DELETE', headers: H }).catch(()=>{});
    }

    // 4. Deleta plano_dias da prova
    await fetch(`${SUPA_URL}/rest/v1/plano_dias?prova_id=eq.${provaId}`, { method: 'DELETE', headers: H }).catch(()=>{});

    // 5. Deleta a prova
    await fetch(`${SUPA_URL}/rest/v1/provas?id=eq.${provaId}`, { method: 'DELETE', headers: H });

    // 6. Remove do PROVAS_DISPONIVEIS local
    if (typeof PROVAS_DISPONIVEIS !== 'undefined') delete PROVAS_DISPONIVEIS[provaId];

    // 7. Limpa localStorage dessa prova
    ['luia_sim_hist','luia_sim_favs','luisa_sess','luisa_rev'].forEach(k => {
      try {
        const data = JSON.parse(localStorage.getItem(k) || '[]');
        const filtered = data.filter(i => (i.prova_id || 'ifpe') !== provaId);
        localStorage.setItem(k, JSON.stringify(filtered));
      } catch(e) {}
    });

    // 8. Se era a prova ativa, muda para a primeira disponível
    if (typeof getProvaAtivaId === 'function' && getProvaAtivaId() === provaId) {
      const restantes = Object.keys(PROVAS_DISPONIVEIS);
      if (restantes.length && typeof setProvaAtiva === 'function') setProvaAtiva(restantes[0]);
    }

    fecharGerenciarProvas();
    if (typeof loadFromSupabase === 'function') loadFromSupabase();
    if (typeof showToast === 'function') showToast('Prova excluída com sucesso.', 'info');

  } catch(e) {
    console.error('Erro ao excluir prova:', e);
    if (typeof showToast === 'function') showToast('Erro ao excluir. Tente novamente.', 'error');
    _gpRender();
  }
}
