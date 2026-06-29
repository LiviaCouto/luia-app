// ═══════════════════════════════════════
//  CONFIG SUPABASE
// ═══════════════════════════════════════
const SUPA_URL = 'https://aqrwxqhgkfhcylndjpit.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnd4cWhna2ZoY3lsbmRqcGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTM2ODAsImV4cCI6MjA5NzcyOTY4MH0.agfPFyc3hsD0X6yrnm2KwZXh-RqK5NsnzxPCXt7JGUU';
const H = {'Content-Type':'application/json','apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY};

async function sbGet(table, params='') {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, {headers:H});
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function sbPost(table, body) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {method:'POST',headers:{...H,'Prefer':'return=representation'},body:JSON.stringify(body)});
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function sbPatch(table, id, body) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {method:'PATCH',headers:{...H,'Prefer':'return=representation'},body:JSON.stringify(body)});
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function sbDelete(table, id) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {
    method:'DELETE',
    headers:{...H,'Prefer':'return=minimal'}
  });
  if (!r.ok) { const txt=await r.text(); throw new Error(txt); }
}
async function sbUpsert(table, body, onConflict) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {method:'POST',headers:{...H,'Prefer':'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body)});
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// ═══════════════════════════════════════
//  EDITAL DATA
// ═══════════════════════════════════════
const EDITAL = {
  'Português':{'Leitura e Interpretação':['Compreensão textual','Contexto de produção e circulação','Construção de sentidos','Intenção comunicativa','Efeitos das escolhas lexicais','Tipologia: Argumentação','Tipologia: Narração','Tipologia: Descrição','Tipologia: Explicação','Tipologia: Injunção','Gêneros literários','Gêneros científicos','Gêneros jornalísticos','Gêneros pessoais','Informações explícitas','Informações implícitas','Intertextualidade','Fato × Opinião','Figuras de linguagem','Outro'],'Coerência e Coesão':['Coerência: relação entre partes','Ideias principais e secundárias','Causa e consequência','Semelhança e contraste','Coesão: pronomes','Coesão: artigos','Coesão: preposições','Coesão: conjunções','Coesão: advérbios','Coesão: numerais','Anáfora','Catáfora','Marcadores temporais','Marcadores espaciais','Sinonímia','Antonímia','Polissemia','Ambiguidade','Hiperonímia','Hiponímia','Elipses e substituições','Outro'],'Conhecimentos Gramaticais':['Letras e fonemas','Ortografia e normas','Prosódia e ortoépia','Acentuação tônica','Substantivo','Adjetivo','Artigo','Pronome','Verbo','Advérbio','Preposição','Conjunção','Numeral','Flexão nominal','Flexão verbal','Formação: composição','Formação: derivação','Pontuação e efeitos','Sintaxe: ordem dos termos','Sintagmas','Coordenação','Subordinação','Concordância','Regência','Outro']},
  'Matemática':{'Números e Operações':['Adição, subtração, multiplicação, divisão','Frações','Números decimais','Potenciação','Raiz quadrada exata','Raiz quadrada com aproximação','Expressões com números reais','MMC e MDC','Outro'],'Grandezas e Proporcionalidade':['Sistemas de medidas: comprimento','Sistemas de medidas: superfície','Sistemas de medidas: capacidade','Sistemas de medidas: volume','Razão','Proporção','Divisão proporcional direta','Divisão proporcional inversa','Regra de três simples','Regra de três composta','Porcentagem e juros simples','Média aritmética','Média ponderada','Média geométrica','Média harmônica','Outro'],'Álgebra':['Polinômios: valor numérico','Polinômios: operações','Produtos notáveis','Fatoração','Radiciação','Equações 1º grau','Equações 2º grau','Sistemas lineares','Sistemas do 2º grau','Outro'],'Geometria':['Ângulos: conceitos e classificação','Problemas com ângulos','Polígonos: classificação e ângulos','Triângulos: classificação','Lei angular de Tales','Semelhança de triângulos','Bissetrizes internas e externas','Cevianas','Mediatrizes e medianas','Relações métricas no triângulo retângulo','Trigonometria: seno, cosseno, tangente','Polígonos regulares inscritos','Área: retângulo e quadrado','Área: triângulo','Área: paralelogramo e losango','Área: trapézio','Área: círculo','Circunferência: arcos e ângulos','Outro']},
  'Ciências da Natureza':{'Ecologia':['Componentes do ecossistema','Cadeias alimentares','Teias alimentares','Relações ecológicas','Ecossistemas brasileiros','Poluição do ar','Poluição da água','Poluição do solo','Poluição sonora e visual','Outro'],'Diversidade Biológica':['Vírus: estrutura e doenças virais','Vacinas','Reino Monera','Doenças bacterianas','Reino Protista','Protozooses','Reino Fungi','Reino Animalia','Reino Plantae','Outro'],'Citologia':['Bioquímica celular: compostos inorgânicos','Bioquímica celular: compostos orgânicos','Envoltórios celulares','Organelas celulares','Mitose','Meiose','Outro'],'Histologia Animal':['Tecido epitelial','Tecido conjuntivo','Tecido muscular','Tecido nervoso','Outro'],'Fisiologia Humana':['Sistema respiratório','Sistema circulatório','Sistema urinário','Sistema digestório','Sistema nervoso','Sistema reprodutor','ISTs e métodos contraceptivos','Outro'],'Genética e Evolução':['Leis de Mendel','Hereditariedade','Teorias de Lamarck','Teorias de Darwin','Seleção natural','Outro']},
  'História':{'Mundo Contemporâneo':['Fascismo e Nazismo','Holocausto','Segunda Guerra Mundial: causas','Segunda Guerra Mundial: etapas','ONU e Direitos Humanos','Guerra Fria','Corrida armamentista e espacial','Revolução Chinesa','Revolução Cubana','Descolonização da África','Descolonização da Ásia','Questão da Palestina','América Latina pós-guerra','Ditaduras na América Latina','Movimentos de resistência','Globalização e neoliberalismo','Fim da Guerra Fria','Ascensão da China','Outro'],'Brasil Contemporâneo':['República Oligárquica (1889–1930)','Era Vargas (1930–1945)','República Liberal (1946–1964)','Ditadura Civil-Militar (1964–1985)','Nova República (1985–)','Constituição de 1988','Lutas por igualdade racial e de gênero','Outro']},
  'Geografia':{'Cartografia e Astronomia':['Elementos do mapa: escala','Elementos do mapa: coordenadas','Orientação e legenda','Projeções cartográficas','Movimentos da Terra','Outro'],'Geologia e Relevo':['Estrutura interna da Terra','Minerais e rochas','Dinâmica tectônica','Estrutura geológica brasileira','Relevo mundial','Relevo do Brasil','Outro'],'Pedologia e Clima':['Formação e classificação dos solos','Degradação dos solos','Dinâmica climática mundial','Dinâmica climática brasileira','Outro'],'Hidrografia e Vegetação':['Águas do planeta','Águas brasileiras','Formação vegetal no mundo','Formação vegetal no Brasil','Outro'],'Meio Ambiente e Geopolítica':['Questão ambiental e sustentabilidade','Mudanças climáticas','População mundial e brasileira','Urbanização no mundo e no Brasil','Energia no mundo e no Brasil','Espaço agrário no mundo','Questão agrária no Brasil','Globalização da economia','Industrialização mundial e brasileira','Geopolítica mundial','Dinâmica regional brasileira','Outro']}
};

const CRONOGRAMA_DATA = [
  {dia:'Segunda-feira',livre:'Após 18h30',blocos:[{horario:'18h30–19h30',materia:'Português',badge:'badge-port',tipo:'Fixação rápida · questões objetivas'}]},
  {dia:'Terça-feira',livre:'Tarde e noite livres',blocos:[{horario:'16h–17h',materia:'Conteúdo novo',badge:'badge-port',tipo:'Português ou Matemática'},{horario:'18h30–19h30',materia:'Questões',badge:'badge-mat',tipo:'10–15 questões do assunto estudado'}]},
  {dia:'Quarta-feira',livre:'Após 16h10 (pós-reforço)',blocos:[{horario:'18h30–19h30',materia:'Conhecimentos Gerais',badge:'badge-bio',tipo:'Ciências · História · Geografia'}]},
  {dia:'Quinta-feira',livre:'Após 16h (pós-prova)',blocos:[{horario:'18h30–19h30',materia:'Revisão leve',badge:'badge-rev',tipo:'Corrigir erros · sem conteúdo novo'}]},
  {dia:'Sexta-feira',livre:'Tarde inteira',blocos:[{horario:'16h–17h',materia:'Matemática / Português',badge:'badge-mat',tipo:'Exercícios e prática — dia forte'}]},
  {dia:'Sábado',livre:'Dia livre',blocos:[{horario:'9h–11h',materia:'Simulado parcial',badge:'badge-rev',tipo:'10 questões cronometradas (QConcursos)'},{horario:'11h–12h',materia:'Correção',badge:'badge-rev',tipo:'Rever todos os erros'}]},
  {dia:'Domingo',livre:'Dia livre',blocos:[{horario:'9h–10h30',materia:'Revisão geral',badge:'badge-rev',tipo:'Fechar a semana · organizar a próxima'}]}
];

const CICLOS = [
  {nome:'Ciclo 1',subtitulo:'Diagnóstico',periodo:'23/06–06/07',semanas:[{num:1,periodo:'23/06–29/06',topics:['Diagnóstico Português','Diagnóstico Matemática','Mapeamento Ciências/História/Geo']},{num:2,periodo:'30/06–06/07',topics:['Questões mistas','Identificar lacunas','Montar lista de prioridades']}]},
  {nome:'Ciclo 2',subtitulo:'Construção',periodo:'07/07–31/08',semanas:[{num:1,periodo:'07/07–13/07',topics:['Port: leitura e interpretação','Ciências: corpo humano e ecologia']},{num:2,periodo:'14/07–20/07',topics:['Mat: frações, decimais, MMC/MDC','História: Brasil colonial']},{num:3,periodo:'21/07–27/07',topics:['Port: gêneros textuais, coesão','Geo: relevo e clima']},{num:4,periodo:'28/07–03/08',topics:['Mat: equações e álgebra','Ciências: energia e matéria']},{num:5,periodo:'04/08–10/08',topics:['Port: figuras de linguagem','História: Independência e Império']},{num:6,periodo:'11/08–17/08',topics:['Mat: geometria — áreas e ângulos','Geo: urbanização e globalização']},{num:7,periodo:'18/08–24/08',topics:['Port: gramática contextualizada','Ciências: meio ambiente']},{num:8,periodo:'25/08–31/08',topics:['Mat: médias e proporcionalidade','Geo/Hist: Pernambuco']}]},
  {nome:'Ciclo 3',subtitulo:'Aprofundamento',periodo:'01/09–31/10',semanas:[{num:1,periodo:'01/09–07/09',topics:['Port: interpretação avançada','Ciências: revisão corpo humano']},{num:2,periodo:'08/09–14/09',topics:['Mat: porcentagem e regra de três','História: República Oligárquica']},{num:3,periodo:'15/09–21/09',topics:['Port: coesão e conectivos','Geo: hidrografia e vegetação']},{num:4,periodo:'22/09–28/09',topics:['Mat: sistemas de equações','Ciências: genética básica']},{num:5,periodo:'29/09–05/10',topics:['Port: pontuação e efeitos','História: Era Vargas']},{num:6,periodo:'06/10–12/10',topics:['Mat: trigonometria básica','Geo: questão agrária e energia']},{num:7,periodo:'13/10–19/10',topics:['Port: ortografia e prosódia','Ciências: evolução e ecologia']},{num:8,periodo:'20/10–31/10',topics:['Mat: geometria avançada','História: Ditadura e Nova República']}]},
  {nome:'Ciclo 4',subtitulo:'Simulados',periodo:'01/11–06/12',semanas:[{num:1,periodo:'01/11–09/11',topics:['Simulado parcial Port + Mat (15q)','Correção detalhada']},{num:2,periodo:'10/11–16/11',topics:['Simulado parcial Conhecimentos Gerais','Revisão dirigida']},{num:3,periodo:'17/11–23/11',topics:['Simulado completo 30q cronometrado','Análise de desempenho']},{num:4,periodo:'24/11–30/11',topics:['Revisão intensiva','Simulado completo #2']},{num:5,periodo:'01/12–06/12',topics:['Revisão leve','Descanso','Documentos para a prova']}]}
];

const MATS = ['Português','Matemática','Ciências da Natureza','História','Geografia'];
const MCOLOR = {'Português':'#C084FC','Matemática':'#FBBF24','Ciências da Natureza':'#4ADE80','História':'#FB923C','Geografia':'#38BDF8'};
const DIAS_SEMANA = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

// ═══════════════════════════════════════
//  STATE
// ═══════════════════════════════════════
let sessions = JSON.parse(localStorage.getItem('luisa_sess')||'[]');
let semanasFeitas = JSON.parse(localStorage.getItem('luisa_sem')||'[]');
let reviews = JSON.parse(localStorage.getItem('luisa_rev')||'[]');
let goals = JSON.parse(localStorage.getItem('luisa_goals')||'{"weekly_hours":0,"weekly_sessions":0,"weekly_questions":0}');
let currentTags = [];
let filterMode = 'ativas';
let revFilter = 'pendente';
let currentCiclo = 0;
let charts = {};
let toastTimer = null;

function saveLocal() {
  localStorage.setItem('luisa_sess', JSON.stringify(sessions));
  localStorage.setItem('luisa_sem', JSON.stringify(semanasFeitas));
  localStorage.setItem('luisa_rev', JSON.stringify(reviews));
  localStorage.setItem('luisa_goals', JSON.stringify(goals));
}

// ═══════════════════════════════════════
//  SYNC STATUS
// ═══════════════════════════════════════
function setSyncStatus(status, msg) {
  const dot = document.getElementById('sync-dot');
  const txt = document.getElementById('sync-msg');
  dot.className = 'sync-dot ' + status;
  txt.textContent = msg;
}

// ═══════════════════════════════════════
//  SUPABASE SYNC
// ═══════════════════════════════════════
async function loadFromSupabase() {
  setSyncStatus('loading','Carregando dados...');
  try {
    const [sess, revs, cics, goalRows, simRows] = await Promise.all([
      sbGet('sessions','order=created_at.desc'),
      sbGet('reviews','order=review_date.asc'),
      sbGet('ciclos_feitos','select=ciclo_key'),
      sbGet('study_goals','id=eq.1').catch(()=>[]),
      sbGet('simulados','order=created_at.desc&limit=50').catch(()=>[])
    ]);
    sessions = sess.map(s => ({...s, tags: s.tags || []}));
    reviews = revs;
    semanasFeitas = cics.map(c => c.ciclo_key);

    // FIX REVISÕES: cria revisões para sessões que ainda não têm nenhuma
    // Isso garante que sessões antigas ou com falha de rede ganhem revisões
    await repararRevisoesFaltantes();

    // Carrega simulados do Supabase com questões respondidas
    if(simRows && simRows.length){
      try{
        const simIds=simRows.map(s=>s.id).join(',');
        let questoesPorSim={};
        const qRows=await sbGet('questoes_respondidas',`simulado_id=in.(${simIds})&order=simulado_id.asc`).catch(()=>[]);
        qRows.forEach(q=>{
          if(!questoesPorSim[q.simulado_id]) questoesPorSim[q.simulado_id]=[];
          questoesPorSim[q.simulado_id].push(q);
        });
        simHistorico = simRows.map(s=>{
          const qs=questoesPorSim[s.id]||[];
          const questoes=qs.map(q=>({
            enunciado:q.enunciado||'',
            alternativas:q.alternativas||{},
            gabarito:q.resposta_correta||'',
            explicacao:''
          }));
          const respostas=qs.map(q=>q.resposta_dada||null);
          const favoritas=qs.map(q=>q.favorita||false);
          return{
            supabase_id:s.id,
            data:(s.created_at||'').substring(0,10),
            materia:s.materia||'',topico:s.topico||'',nivel:s.nivel||'',
            total:s.total||0,acertos:s.acertos||0,
            pct:s.total>0?Math.round(s.acertos/s.total*100):0,
            tempo:s.tempo_seg||0,arquivado:s.arquivado||false,
            questoes,respostas,favoritas
          };
        });
        localStorage.setItem('luia_sim_hist',JSON.stringify(simHistorico));
      }catch(e){ console.log('sim load error',e); }
    }

    // Carrega plano do banco — não perde em aba anônima
    if(goalRows && goalRows[0] && goalRows[0].plano_feitos){
      const planoDB = goalRows[0].plano_feitos;
      // Banco sempre vence — mais confiável que local
      planoFeitos = [...new Set([...planoDB, ...planoFeitos])];
      localStorage.setItem('luia_plano', JSON.stringify(planoFeitos));
    }

    // Carrega conquistas do Supabase — banco sempre vence
    if(goalRows && goalRows[0] && goalRows[0].conquistas_json && goalRows[0].conquistas_json.length){
      const conquDB = goalRows[0].conquistas_json;
      // Merge: une banco + local sem duplicatas
      conquistasDesbloqueadas = [...new Set([...conquDB, ...conquistasDesbloqueadas])];
      localStorage.setItem('luisa_conquistas', JSON.stringify(conquistasDesbloqueadas));
    }

    // Carrega favoritas de simulados do banco
    if(goalRows && goalRows[0] && goalRows[0].sim_favoritas){
      const favDB = goalRows[0].sim_favoritas;
      simFavSalvas = favDB;
      localStorage.setItem('luia_sim_favs', JSON.stringify(simFavSalvas));
    }

    // Carrega chave e perfil completo do banco — funciona em qualquer navegador
    if(goalRows && goalRows[0] && goalRows[0].access_key){
      perfilData.chave = goalRows[0].access_key;
      if(goalRows[0].access_pergunta) perfilData.pergunta = goalRows[0].access_pergunta;
      if(goalRows[0].access_resposta) perfilData.resposta = goalRows[0].access_resposta;
      if(goalRows[0].perfil_json){
        const pj = goalRows[0].perfil_json;
        // Sobrescreve sempre com dados do Supabase (fonte da verdade)
        if(pj.nome) perfilData.nome = pj.nome;
        if(pj.apelido) perfilData.apelido = pj.apelido;
        if(pj.idade) perfilData.idade = pj.idade;
        if(pj.signo) perfilData.signo = pj.signo;
        if(pj.musica) perfilData.musica = pj.musica;
        if(pj.cor) perfilData.cor = pj.cor;
        if(pj.sonho) perfilData.sonho = pj.sonho;
        if(pj.motivacao) perfilData.motivacao = pj.motivacao;
        if(pj.avatarId) perfilData.avatarId = pj.avatarId;
        if(pj.avatarSvg) perfilData.avatarSvg = pj.avatarSvg;
      }
      localStorage.setItem('luia_perfil', JSON.stringify(perfilData));
    }

    saveLocal();
    setSyncStatus('ok','Sincronizado com o banco de dados');
    renderAll();
    atualizarBanner();
  } catch(e) {
    setSyncStatus('error','Sem conexão — usando dados locais');
    renderAll();
    atualizarBanner();
  }
}

async function syncSession(localId) {
  const idx = sessions.findIndex(s => s.localId === localId);
  if(idx < 0) return;
  const sess = sessions[idx];
  try {
    const {localId:_lid, id:_id, ...body} = sess;
    const res = await sbPost('sessions', body);
    const newId = res[0]?.id;
    if (newId) {
      sessions[idx].id = newId;
      saveLocal();
      setSyncStatus('ok','Sincronizado');
      await createReviews(newId, sess.data, sess.assunto);
    }
  } catch(e) {
    setSyncStatus('error','Erro ao sincronizar — dados salvos localmente');
    console.error('syncSession error:', e);
  }
}

async function repararRevisoesFaltantes() {
  // Sessões que já têm pelo menos uma revisão
  const sessionsComRevisao = new Set(reviews.map(r => r.session_id));
  // Sessões com id real (sincronizadas) sem nenhuma revisão
  const sessoesSemRevisao = sessions.filter(s => s.id && !sessionsComRevisao.has(s.id) && !s.archived);
  if (!sessoesSemRevisao.length) return;
  for (const s of sessoesSemRevisao) {
    try {
      await createReviews(s.id, s.data, s.assunto);
    } catch(e) { console.error('repararRevisoes error', s.id, e); }
  }
}

async function createReviews(sessionId, dataStr, assunto) {
  const base = new Date(dataStr + 'T12:00:00');
  const ciclos = [
    {dias:1,  tipo:'1d',  label:'24h'},
    {dias:7,  tipo:'7d',  label:'7 dias'},
    {dias:15, tipo:'15d', label:'15 dias'},
    {dias:30, tipo:'30d', label:'30 dias'},
  ];
  try {
    for (const c of ciclos) {
      const dt = new Date(base); dt.setDate(dt.getDate() + c.dias);
      const rd = dateToLocal(dt);
      const rev = await sbPost('reviews', {session_id: sessionId, review_date: rd, status: 'pendente', tipo: c.tipo});
      if(rev && rev[0]) reviews.push(rev[0]);
    }
    saveLocal();
    renderRevisoes();
  } catch(e) { console.error('createReviews error:', e); }
}

// ═══════════════════════════════════════
//  DATE UTILS — usa fuso local (evita UTC -3 virar dia anterior)
// ═══════════════════════════════════════
function todayLocal(){
  const d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function dateToLocal(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function initStars() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shooters = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    // Muitas estrelas pequenas, piscar lento e suave
    for (let i=0;i<220;i++) stars.push({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      r:Math.random()*.9+.15,
      alpha:Math.random()*.45+.08,
      speed:Math.random()*.0015+.0004,
      offset:Math.random()*Math.PI*2
    });
    // Poucas estrelas um pouco maiores, igualmente discretas
    for (let i=0;i<35;i++) stars.push({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      r:Math.random()*1.4+.8,
      alpha:Math.random()*.35+.12,
      speed:Math.random()*.001+.0003,
      offset:Math.random()*Math.PI*2
    });
  }

  function spawnShooter() {
    shooters.push({
      x: Math.random()*canvas.width*0.6,
      y: Math.random()*canvas.height*0.35,
      vx: Math.random()*3+2.5,
      vy: Math.random()*1.2+0.4,
      len: Math.random()*90+60,
      life: 1
    });
    setTimeout(spawnShooter, Math.random()*9000+6000);
  }

  function draw(t) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const isLight = document.documentElement.getAttribute('data-theme')==='light';
    const rgb = isLight ? '192,132,252' : '255,255,255';

    stars.forEach(s=>{
      const a = s.alpha * (0.5 + 0.5*Math.sin(t*s.speed + s.offset));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba('+rgb+','+a+')';
      ctx.fill();
    });

    shooters = shooters.filter(sh=>{
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.012;
      if(sh.life <= 0) return false;
      const tail = sh.len/4;
      const grad = ctx.createLinearGradient(sh.x,sh.y, sh.x-sh.vx*tail, sh.y-sh.vy*tail);
      grad.addColorStop(0,'rgba('+rgb+','+sh.life+')');
      grad.addColorStop(1,'rgba('+rgb+',0)');
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x-sh.vx*tail, sh.y-sh.vy*tail);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      return true;
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
  setTimeout(spawnShooter, 4000);
}

// ═══════════════════════════════════════
//  THEME
// ═══════════════════════════════════════
function setTheme(t, btn) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('luisa_theme', t);
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderChartMateria(); renderChartEvolucao(); renderChartTempo();
}

// ═══════════════════════════════════════
//  NAV
// ═══════════════════════════════════════
function showSection(id, btn, isMobile=false) {
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById('sec-'+id).classList.add('active');
  if (isMobile) {
    document.querySelectorAll('.bnav-btn').forEach(b=>b.classList.remove('active'));
  } else {
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  }
  if (btn) btn.classList.add('active');
  if (id==='dashboard') renderDashboard();
  if (id==='historico') renderHistorico();
  if (id==='revisoes') renderRevisoes();
  if (id==='metas') renderMetas();
  if (id==='plano') renderPlano();
  if (id==='perfil') carregarPerfil();
  if (id==='lancar' && timerSec>0){
    const th=Math.floor(timerSec/3600);
    const tm=Math.round((timerSec%3600)/60);
    const elH=document.getElementById('f-horas');
    const elM=document.getElementById('f-mins');
    if(elH&&!elH.value) elH.value=th||'';
    if(elM&&!elM.value) elM.value=tm||'';
  }
}

// ═══════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════
function showToast(msg, type='info') {
  const t = document.getElementById('toast');
  clearTimeout(toastTimer);
  t.className = 'toast ' + type;
  t.textContent = msg;
  requestAnimationFrame(()=>{ t.classList.add('show'); });
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2800);
}

// ═══════════════════════════════════════
//  TIMER
// ═══════════════════════════════════════
let timerSec=0,timerInterval=null,timerRunning=false;
function pad(n){return String(n).padStart(2,'0')}
function fmtTimer(s){return pad(Math.floor(s/3600))+':'+pad(Math.floor((s%3600)/60))+':'+pad(s%60)}
function updateTimerDisplays(){
  const t=fmtTimer(timerSec);
  const el=document.getElementById('timer-display');
  const fl=document.getElementById('float-time');
  if(el) el.textContent=t;
  if(fl) fl.textContent=t;
}
function showFloatTimer(){
  const ft=document.getElementById('float-timer');
  if(ft) ft.classList.remove('hidden');
}
function floatTimerToggle(){
  if(timerRunning) timerStop();
  else timerStart();
}
function irParaLancar(){
  timerStop();
  const m=Math.round(timerSec/60);
  if(m>0){
    document.getElementById('f-horas').value=Math.floor(m/60);
    document.getElementById('f-mins').value=m%60;
    document.getElementById('timer-badge').style.display='inline';
  }
  showSection('lancar', document.querySelector('.nav-btn:nth-child(4)'));
  document.querySelectorAll('.bnav-btn').forEach((b,i)=>{b.classList.remove('active');if(i===2)b.classList.add('active');});
}
function timerStart(){if(timerRunning)return;timerRunning=true;showFloatTimer();timerInterval=setInterval(()=>{timerSec++;updateTimerDisplays();document.getElementById('float-play').textContent='■';},1000);document.getElementById('btn-start').style.display='none';document.getElementById('btn-stop').style.display='';showToast('Cronômetro iniciado!','info')}
function timerStop(){if(!timerRunning)return;clearInterval(timerInterval);timerRunning=false;document.getElementById('float-play').textContent='▶';document.getElementById('btn-start').style.display='';document.getElementById('btn-stop').style.display='none';showToast('Pausado · '+fmtTimer(timerSec),'info')}
function timerReset(){timerStop();timerSec=0;updateTimerDisplays();document.getElementById('float-timer').classList.add('hidden');}
function cancelarTimer(){
  if(timerSec>0 && !confirm('Cancelar e zerar o cronômetro?')) return;
  timerReset();
  showToast('Cronômetro cancelado.','info');
}
function usarCronometro(){
  if(timerSec===0){showToast('Cronômetro está zerado!','error');return;}
  const totalMin=Math.round(timerSec/60);
  document.getElementById('f-horas').value=Math.floor(totalMin/60);
  document.getElementById('f-mins').value=totalMin%60;
  document.getElementById('timer-badge').style.display='inline';
  showToast('Tempo preenchido: '+Math.floor(totalMin/60)+'h'+totalMin%60+'min ✦','success');
}

function toggleTagFixa(btn, tag) {
  btn.classList.toggle('selected');
}
function getTagsFixasSelecionadas() {
  return [...document.querySelectorAll('.tag-fixa.selected')].map(b => b.getAttribute('onclick').match(/'([^']+)'\)/)?.[1]).filter(Boolean);
}

// ═══════════════════════════════════════
//  FORM CASCADE
// ═══════════════════════════════════════
function updateTopicos(){const mat=document.getElementById('f-materia').value;const tSel=document.getElementById('f-topico');const sSel=document.getElementById('f-subtopico');tSel.innerHTML='<option value="">Selecione o tópico...</option>';sSel.innerHTML='<option value="">Selecione o tópico primeiro</option>';tSel.disabled=!mat;sSel.disabled=true;document.getElementById('outro-group').style.display='none';if(!mat)return;Object.keys(EDITAL[mat]||{}).forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;tSel.appendChild(o)});}
function updateSubtopicos(){const mat=document.getElementById('f-materia').value;const top=document.getElementById('f-topico').value;const sSel=document.getElementById('f-subtopico');sSel.innerHTML='<option value="">Selecione o subtópico...</option>';sSel.disabled=!top;document.getElementById('outro-group').style.display='none';if(!mat||!top)return;(EDITAL[mat][top]||[]).forEach(sub=>{const o=document.createElement('option');o.value=sub;o.textContent=sub;sSel.appendChild(o)});}
function checkOutro(){const val=document.getElementById('f-subtopico').value;document.getElementById('outro-group').style.display=val==='Outro'?'block':'none';}

// ═══════════════════════════════════════
//  LANÇAR SESSÃO
// ═══════════════════════════════════════
async function lancarSessao(){
  const materia=document.getElementById('f-materia').value;
  const topico=document.getElementById('f-topico').value;
  const sub=document.getElementById('f-subtopico').value;
  const outro=document.getElementById('f-outro').value.trim();
  const data=document.getElementById('f-data').value;
  const acertos=parseInt(document.getElementById('f-acertos').value)||0;
  const erros=parseInt(document.getElementById('f-erros').value)||0;
  const horas=parseInt(document.getElementById('f-horas').value)||0;
  const mins=parseInt(document.getElementById('f-mins').value)||0;
  // Se campos vazios e cronômetro tem tempo, usa o cronômetro
  const tempoForm=horas*60+mins;
  const minutos=tempoForm>0?tempoForm:(timerSec>0?Math.round(timerSec/60):0);
  const obs=document.getElementById('f-obs').value.trim();
  const tags=getTagsFixasSelecionadas();

  if(!materia){showToast('Selecione a matéria!','error');return}
  if(!topico){showToast('Selecione o tópico!','error');return}
  if(!sub){showToast('Selecione o subtópico!','error');return}
  if(sub==='Outro'&&!outro){showToast('Descreva o assunto!','error');return}
  if(tags.length===0){showToast('Selecione pelo menos um tipo de estudo!','error');return}

  const assunto=sub==='Outro'?outro:sub;
  const localId='local_'+Date.now();
  const sess={localId,id:null,materia,topico,assunto,data:data||todayLocal(),acertos,erros,minutos,obs,banca:'',tags,archived:false};
  sessions.unshift(sess);
  saveLocal();

  // Reset form
  ['f-materia','f-obs'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('f-horas').value='';
  document.getElementById('f-mins').value='';
  document.getElementById('f-acertos').value='';
  document.getElementById('f-erros').value='';
  document.getElementById('f-topico').innerHTML='<option>Selecione a matéria primeiro</option>';
  document.getElementById('f-topico').disabled=true;
  document.getElementById('f-subtopico').innerHTML='<option>Selecione o tópico primeiro</option>';
  document.getElementById('f-subtopico').disabled=true;
  document.getElementById('outro-group').style.display='none';
  document.getElementById('timer-badge').style.display='none';
  document.querySelectorAll('.tag-fixa').forEach(b=>b.classList.remove('selected'));
  timerReset();

  showToast('Sessão registrada! ✦','success');

  // Restaura última aba ou vai pro dashboard
  setTimeout(()=>{
    sincronizarPlanoComSessoes();
    const abaAnterior = sessionStorage.getItem('luia_aba') || 'dashboard';
    // Abas que precisam de auth não restauram automaticamente — vai pro dashboard
    const abasAuth = ['sobre','perfil'];
    const abaFinal = abasAuth.includes(abaAnterior) ? 'dashboard' : abaAnterior;
    showLuia(abaFinal, null);
    document.querySelectorAll('.bnav-btn').forEach((b,i)=>{b.classList.remove('active');if(i===0)b.classList.add('active');});
    verificarConquistas();
  }, 800);

  await syncSession(localId);
  sincronizarPlanoComSessoes();
}

// ═══════════════════════════════════════
//  EDITAR SESSÃO
// ═══════════════════════════════════════
function openEdit(uid) {
  const s = sessions.find(x=>(x.id==uid||x.localId==uid));
  if(!s||s.archived) return;
  document.getElementById('edit-id').value=uid;
  document.getElementById('edit-materia').value=s.materia;
  document.getElementById('edit-data').value=s.data;
  document.getElementById('edit-assunto').value=s.assunto;
  document.getElementById('edit-min').value=s.minutos||0;
  document.getElementById('edit-acertos').value=s.acertos||0;
  document.getElementById('edit-erros').value=s.erros||0;
  document.getElementById('edit-obs').value=s.obs||'';
  document.getElementById('edit-banca').value=s.banca||'';
  document.getElementById('modal-edit').style.display='flex';
}
function closeModal(){document.getElementById('modal-edit').style.display='none'}
async function salvarEdicao(){
  const uid=document.getElementById('edit-id').value;
  const idx=sessions.findIndex(s=>s.id==uid||s.localId==uid);
  if(idx<0) return;
  const upd={
    materia:document.getElementById('edit-materia').value,
    data:document.getElementById('edit-data').value,
    assunto:document.getElementById('edit-assunto').value,
    minutos:parseInt(document.getElementById('edit-min').value)||0,
    acertos:parseInt(document.getElementById('edit-acertos').value)||0,
    erros:parseInt(document.getElementById('edit-erros').value)||0,
    obs:document.getElementById('edit-obs').value,
    banca:document.getElementById('edit-banca').value
  };
  sessions[idx]={...sessions[idx],...upd};
  saveLocal();closeModal();renderHistorico();renderDashboard();
  showToast('Sessão atualizada!','success');
  const dbId=sessions[idx].id;
  if(dbId) try{await sbPatch('sessions',dbId,upd);}catch(e){setSyncStatus('error','Erro ao sincronizar edição')}
}

async function arquivar(uid){
  const idx=sessions.findIndex(s=>s.id==uid||s.localId==uid);
  if(idx<0)return;
  sessions[idx].archived=!sessions[idx].archived;
  const isArq=sessions[idx].archived;
  saveLocal();renderHistorico();renderDashboard();
  showToast(isArq?'Sessão arquivada.':'Sessão restaurada.','info');
  const dbId=sessions[idx].id;
  if(dbId) try{await sbPatch('sessions',dbId,{archived:isArq});}catch(e){}
}

// ═══════════════════════════════════════
//  HISTÓRICO
// ═══════════════════════════════════════
let filterMode2='ativas';
function setFilter(m,btn){filterMode2=m;document.querySelectorAll('.filter-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderHistorico();}
function renderHistorico(){
  const q=(document.getElementById('search-input')?.value||'').toLowerCase();
  const wrap=document.getElementById('historico-list');
  let list=sessions.filter(s=>{
    if(filterMode2==='ativas') return !s.archived;
    if(filterMode2==='arquivadas') return s.archived;
    return true;
  }).filter(s=>{
    if(!q) return true;
    return [s.materia,s.topico,s.assunto,s.obs,s.banca,...(s.tags||[])].some(x=>(x||'').toLowerCase().includes(q));
  });
  if(!list.length){wrap.innerHTML='<p style="color:var(--text-dim);font-size:13px">Nenhuma sessão encontrada.</p>';return;}
  const uid = s => s.id || s.localId;
  wrap.innerHTML=list.map(s=>{
    const id=uid(s);
    const isArq=s.archived;
    return '<div class="log-item" style="'+(isArq?'opacity:.6':'')+'">'+
      '<div class="log-mat-dot" style="background:'+(MCOLOR[s.materia]||'#888')+'"></div>'+
      '<div class="log-info">'+
        '<div class="log-title">'+s.assunto+(isArq?' <span style="font-size:9px;color:var(--text-dim)">[arquivada]</span>':'')+'</div>'+
        '<div class="log-sub">'+s.materia+' · '+s.topico+' · '+fmtDate(s.data)+(s.banca?' · '+s.banca:'')+(s.obs?' · '+s.obs:'')+'</div>'+
        (s.tags&&s.tags.length?'<div class="log-tags">'+s.tags.map(t=>'<span class="log-tag">'+t+'</span>').join('')+'</div>':'')+
      '</div>'+
      '<div class="log-scores">'+
        '<span class="score-acerto">+'+s.acertos+'</span>'+
        '<span class="score-erro">−'+s.erros+'</span>'+
        (s.minutos?'<span class="score-time">'+s.minutos+'min</span>':'')+
      '</div>'+
      '<div class="log-actions">'+
        (!isArq?'<button class="action-btn" onclick="_authOpenEdit(\''+id+'\')" title="Editar">✏️</button>':'')+
        '<button class="action-btn archive" onclick="_authArquivar(\''+id+'\')" title="'+(isArq?'Restaurar':'Arquivar')+'">'+(isArq?'↩':'📦')+'</button>'+
      '</div>'+
    '</div>';
  }).join('');
}
function fmtDate(d){if(!d)return'';const[y,m,day]=d.split('-');return`${day}/${m}/${y}`}

// ═══════════════════════════════════════
//  REVISÕES
// ═══════════════════════════════════════
let revFilter2='hoje';
function setRevFilter(m,btn){revFilter2=m;document.querySelectorAll('#sec-revisoes .filter-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderRevisoes();}

function renderRevisoes(){
  const wrap=document.getElementById('revisoes-list');
  const today=todayLocal();

  function infereTipo(r){
    if(r.tipo) return r.tipo;
    const sess=sessions.find(s=>s.id===r.session_id);
    if(!sess) return '?';
    const base=new Date(sess.data+'T12:00:00');
    const rev=new Date(r.review_date+'T12:00:00');
    const diff=Math.round((rev-base)/(1000*60*60*24));
    if(diff<=1) return '1d';
    if(diff<=7) return '7d';
    if(diff<=15) return '15d';
    return '30d';
  }
  function tipoLabel(tipo){
    return {'1d':'24h','7d':'7 dias','15d':'15 dias','30d':'30 dias'}[tipo]||'Revisão';
  }
  function tipoColor(tipo){
    return {'1d':'var(--info)','7d':'var(--accent-light)','15d':'var(--warning)','30d':'var(--success)'}[tipo]||'var(--text-dim)';
  }
  function tipoBadge(tipo){
    const cor=tipoColor(tipo);
    return `<span style="font-size:9px;font-weight:700;color:${cor};background:${cor}22;border:1px solid ${cor}44;border-radius:99px;padding:2px 8px;white-space:nowrap">🔁 ${tipoLabel(tipo)}</span>`;
  }
  function diasRestantes(data){
    const diff=Math.ceil((new Date(data+'T12:00:00')-new Date())/(1000*60*60*24));
    if(diff===0) return 'Hoje';
    if(diff===1) return 'Amanhã';
    if(diff<0) return Math.abs(diff)+'d atrasada';
    return 'Em '+diff+' dias';
  }

  function cardRevisao(r){
    const sess=sessions.find(s=>s.id===r.session_id);
    const isToday=r.review_date===today;
    const isPast=r.review_date<today&&r.status==='pendente';
    const tipo=infereTipo(r);
    const borda=isPast?'border-color:rgba(248,113,113,.4)':isToday?'border-color:rgba(245,158,11,.4)':'';
    return`<div class="review-item" style="${borda};margin-bottom:8px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
          ${tipoBadge(tipo)}
          <span style="font-size:11px;color:${isPast?'var(--danger)':isToday?'var(--warning)':'var(--text-dim)'};font-weight:600">${isToday?'📌 Hoje':isPast?'⚠️ '+diasRestantes(r.review_date):diasRestantes(r.review_date)} · ${fmtDate(r.review_date)}</span>
        </div>
        <div style="font-size:13px;font-weight:500;color:var(--text-primary)">${sess?.assunto||'Sessão removida'}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${sess?.materia||''} · ${sess?.topico||''}</div>
      </div>
      ${r.status==='pendente'
        ?`<button class="review-btn" onclick="_authConcluir(${r.id})">✓ Feita</button>`
        :`<button class="review-btn" style="color:var(--warning);border-color:var(--warning)" onclick="_authReabrir(${r.id})">↩ Reabrir</button>`}
    </div>`;
  }

  // ── ABA HOJE ──
  if(revFilter2==='hoje'){
    const atrasadas=reviews.filter(r=>r.review_date<today&&r.status==='pendente').sort((a,b)=>a.review_date.localeCompare(b.review_date));
    const deHoje=reviews.filter(r=>r.review_date===today&&r.status==='pendente');
    if(!atrasadas.length&&!deHoje.length){
      wrap.innerHTML=`<div style="text-align:center;padding:40px 20px">
        <div style="font-size:2.5rem;margin-bottom:12px">🎉</div>
        <div style="font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:6px">Nenhuma revisão para hoje!</div>
        <div style="font-size:12px;color:var(--text-dim)">Aproveite para avançar no plano de estudos.</div>
      </div>`;
      return;
    }
    let html='';
    if(atrasadas.length){
      html+=`<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--danger);margin-bottom:8px;margin-top:4px">⚠️ Atrasadas (${atrasadas.length})</div>`;
      html+=atrasadas.map(cardRevisao).join('');
    }
    if(deHoje.length){
      html+=`<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--warning);margin-bottom:8px;${atrasadas.length?'margin-top:16px':''}">📌 Para hoje (${deHoje.length})</div>`;
      html+=deHoje.map(cardRevisao).join('');
    }
    wrap.innerHTML=html;
    return;
  }

  // ── ABA PRÓXIMAS ──
  if(revFilter2==='proximas'){
    const proximas=reviews.filter(r=>r.review_date>today&&r.status==='pendente').sort((a,b)=>a.review_date.localeCompare(b.review_date));
    if(!proximas.length){
      wrap.innerHTML='<p style="color:var(--text-dim);font-size:13px;padding:1rem 0">Nenhuma revisão futura agendada.</p>';
      return;
    }
    // Agrupa por data
    const porData={};
    proximas.forEach(r=>{if(!porData[r.review_date])porData[r.review_date]=[];porData[r.review_date].push(r);});
    wrap.innerHTML=Object.entries(porData).map(([data,revs])=>{
      const diff=Math.ceil((new Date(data+'T12:00:00')-new Date())/(1000*60*60*24));
      const label=diff===1?'Amanhã':'Em '+diff+' dias';
      return`<div style="margin-bottom:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--accent-light);margin-bottom:8px">${label} · ${fmtDate(data)}</div>
        ${revs.map(cardRevisao).join('')}
      </div>`;
    }).join('');
    return;
  }

  // ── ABA CONCLUÍDAS ──
  const concluidas=reviews.filter(r=>r.status==='concluida').sort((a,b)=>b.review_date.localeCompare(a.review_date));
  if(!concluidas.length){
    wrap.innerHTML='<p style="color:var(--text-dim);font-size:13px;padding:1rem 0">Nenhuma revisão concluída ainda.</p>';
    return;
  }
  wrap.innerHTML=concluidas.map(cardRevisao).join('');
}
function atualizarRevDash(){
  const today=todayLocal();
  function infereTipo(r){
    if(r.tipo) return r.tipo;
    const sess=sessions.find(s=>s.id===r.session_id);
    if(!sess) return '?';
    const base=new Date(sess.data+'T12:00:00');
    const rev=new Date(r.review_date+'T12:00:00');
    const diff=Math.round((rev-base)/(1000*60*60*24));
    if(diff<=1) return '1d';if(diff<=7) return '7d';if(diff<=15) return '15d';return '30d';
  }
  function tipoLabel(tipo){return {'1d':'24h','7d':'7 dias','15d':'15 dias','30d':'30 dias'}[tipo]||'Revisão';}
  function tipoColor(tipo){return {'1d':'var(--info)','7d':'var(--accent-light)','15d':'var(--warning)','30d':'var(--success)'}[tipo]||'var(--text-dim)';}
  function tipoBadge(tipo){const cor=tipoColor(tipo);return `<span style="font-size:9px;font-weight:700;color:${cor};background:${cor}22;border:1px solid ${cor}44;border-radius:99px;padding:2px 8px;white-space:nowrap">🔁 ${tipoLabel(tipo)}</span>`;}

  const pendHoje=reviews.filter(r=>r.review_date===today&&r.status==='pendente');
  const card=document.getElementById('rev-dash-card');
  const list2=document.getElementById('rev-dash-list');
  if(!card) return;
  if(pendHoje.length){
    card.style.display='block';
    list2.innerHTML=pendHoje.map(r=>{
      const s=sessions.find(x=>x.id===r.session_id);
      const tipo=infereTipo(r);
      return`<div style="font-size:12px;padding:7px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:8px">
        <span style="color:var(--text-primary);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s?.assunto||'—'} <span style="color:var(--text-secondary)">· ${s?.materia||''}</span></span>
        ${tipoBadge(tipo)}
      </div>`;
    }).join('');
  } else card.style.display='none';
}

async function concluirRevisao(id){
  const idx=reviews.findIndex(r=>r.id===id);
  if(idx<0) return;
  reviews[idx].status='concluida';
  saveLocal();renderRevisoes();atualizarRevDash();atualizarRevBadge();showToast('Revisão concluída! ✦','success');
  try{await sbPatch('reviews',id,{status:'concluida'});}catch(e){}
}
async function reabrirRevisao(id){
  const idx=reviews.findIndex(r=>r.id===id);
  if(idx<0) return;
  reviews[idx].status='pendente';
  saveLocal();renderRevisoes();showToast('Revisão reaberta.','info');
  try{await sbPatch('reviews',id,{status:'pendente'});}catch(e){}
}

// ═══════════════════════════════════════
//  ZERAR MATÉRIA
// ═══════════════════════════════════════
async function zerarMateria(mat){
  const toDelete=sessions.filter(s=>s.materia===mat);
  if(toDelete.length===0){showToast('Nenhuma sessão de '+mat+' para zerar.','info');return;}
  if(!confirm('Zerar '+mat+'?\n\nIsso vai deletar '+toDelete.length+' sessão(ões) permanentemente.\nEssa ação não pode ser desfeita!')) return;

  setSyncStatus('loading','Zerando '+mat+'...');

  const dbIds=toDelete.filter(s=>s.id).map(s=>s.id);

  // 1. Deleta REVISÕES primeiro (evita conflict de foreign key)
  for(const id of dbIds){
    try{
      await fetch(SUPA_URL+'/rest/v1/reviews?session_id=eq.'+id,{
        method:'DELETE',headers:{...H,'Prefer':'return=minimal'}
      });
    }catch(e){console.error('rev del err',id,e);}
  }

  // 2. Deleta SESSÕES depois
  for(const id of dbIds){
    try{ await sbDelete('sessions', id); }
    catch(e){ console.error('sess del err',id,e); }
  }

  // 3. Limpa localStorage
  localStorage.removeItem('luisa_sess');
  localStorage.removeItem('luisa_rev');
  sessions=[];
  reviews=[];

  // 4. Recarrega do banco
  await loadFromSupabase();
  showToast(mat+' zerada! ✦','success');
}

// ═══════════════════════════════════════
//  CONQUISTAS
// ═══════════════════════════════════════
const CONQUISTAS = [
  // Streak
  {id:'streak_1',   icon:'🔥', nome:'Primeiro passo',    desc:'1 dia seguido estudando',      cat:'streak',  check:s=>s.streak>=1||s.diasPlano>=1},
  {id:'streak_7',   icon:'💪', nome:'Uma semana de fogo', desc:'7 dias seguidos no plano',     cat:'streak',  check:s=>s.streak>=7||s.record>=7},
  {id:'streak_14',  icon:'⚡', nome:'Invicta',            desc:'14 dias seguidos no plano',    cat:'streak',  check:s=>s.streak>=14||s.record>=14},
  {id:'streak_30',  icon:'👑', nome:'Mês de ouro',        desc:'30 dias seguidos no plano',    cat:'streak',  check:s=>s.streak>=30||s.record>=30},
  // Plano
  {id:'plano_7',    icon:'📆', nome:'Semana completa',    desc:'7 dias do plano marcados',     cat:'plano',   check:s=>s.diasPlano>=7},
  {id:'plano_30',   icon:'🗓️', nome:'No ritmo',           desc:'30 dias do plano marcados',    cat:'plano',   check:s=>s.diasPlano>=30},
  {id:'plano_100',  icon:'🌟', nome:'Dedicada',           desc:'100 dias do plano marcados',   cat:'plano',   check:s=>s.diasPlano>=100},
  // Questões
  {id:'q_1',        icon:'❓', nome:'Primeira questão',   desc:'Primeira questão resolvida',   cat:'questoes',check:s=>s.totalQ>=1},
  {id:'q_100',      icon:'🎯', nome:'Centena',            desc:'100 questões resolvidas',      cat:'questoes',check:s=>s.totalQ>=100},
  {id:'q_500',      icon:'🏹', nome:'Atirador',           desc:'500 questões resolvidas',      cat:'questoes',check:s=>s.totalQ>=500},
  {id:'q_1000',     icon:'💎', nome:'Mil questões',       desc:'1.000 questões resolvidas',    cat:'questoes',check:s=>s.totalQ>=1000},
  // Acertos
  {id:'ace_100',    icon:'✨', nome:'Sniper',             desc:'Sessão com 100% de acertos (mín. 5q)',cat:'acertos',check:s=>s.temSessao100pct},
  {id:'ace_80',     icon:'🎖️', nome:'Consistente',        desc:'Média geral acima de 80%',     cat:'acertos', check:s=>s.mediaGeral>=80},
  // Tempo
  {id:'min_60',     icon:'⏱️', nome:'Primeira hora',      desc:'60 minutos estudados',         cat:'tempo',   check:s=>s.totalMin>=60},
  {id:'min_600',    icon:'🕙', nome:'Maratonista',        desc:'10 horas estudadas',           cat:'tempo',   check:s=>s.totalMin>=600},
  {id:'min_3000',   icon:'🏆', nome:'Campeã',             desc:'50 horas estudadas',           cat:'tempo',   check:s=>s.totalMin>=3000},
];

let conquistasDesbloqueadas = JSON.parse(localStorage.getItem('luisa_conquistas')||'[]');

function saveConquistas(){
  localStorage.setItem('luisa_conquistas',JSON.stringify(conquistasDesbloqueadas));
  fetch(`${SUPA_URL}/rest/v1/study_goals?id=eq.1`,{
    method:'PATCH',
    headers:{...H,'Prefer':'return=minimal'},
    body:JSON.stringify({conquistas_json:conquistasDesbloqueadas})
  }).catch(()=>{});
}

function calcStatsConquistas(){
  const ativas=sessions.filter(s=>!s.archived);
  const totalQSess=ativas.reduce((a,s)=>a+s.acertos+s.erros,0);
  const totalASess=ativas.reduce((a,s)=>a+s.acertos,0);
  const totalMin=ativas.reduce((a,s)=>a+(s.minutos||0),0);
  // Soma questões dos simulados
  const simAtivos=(simHistorico||[]).filter(s=>!s.arquivado);
  const totalQSim=simAtivos.reduce((a,s)=>a+(s.total||0),0);
  const totalASim=simAtivos.reduce((a,s)=>a+(s.acertos||0),0);
  const totalQ=totalQSess+totalQSim;
  const totalA=totalASess+totalASim;
  const mediaGeral=totalQ>0?Math.round(totalA/totalQ*100):0;
  const temSessao100pct=ativas.some(s=>s.erros===0&&s.acertos>=5)||simAtivos.some(s=>s.pct===100&&s.total>=5);
  const {streak,record}=calcStreak();
  const diasPlano=planoFeitos.length;
  return{totalQ,totalA,totalMin,mediaGeral,temSessao100pct,streak,record,diasPlano};
}

let notifTimer=null;
function mostrarNotifConquista(c){
  const el=document.getElementById('conquista-notif');
  document.getElementById('cn-icon').textContent=c.icon;
  document.getElementById('cn-nome').textContent=c.nome;
  document.getElementById('cn-desc').textContent=c.desc;
  el.classList.add('show');
  el.onclick=()=>{el.classList.remove('show');clearTimeout(notifTimer);};
  clearTimeout(notifTimer);
  notifTimer=setTimeout(()=>el.classList.remove('show'),3500);
}

function verificarConquistas(silent=false){
  const stats=calcStatsConquistas();
  let novas=[];
  CONQUISTAS.forEach(c=>{
    if(!conquistasDesbloqueadas.includes(c.id) && c.check(stats)){
      conquistasDesbloqueadas.push(c.id);
      novas.push(c);
    }
  });
  if(novas.length){
    saveConquistas();
    if(!silent){
      // Mostra notificação da primeira nova conquista
      mostrarNotifConquista(novas[0]);
      // Se mais de uma, enfileira
      novas.slice(1).forEach((c,i)=>setTimeout(()=>mostrarNotifConquista(c),(i+1)*4500));
    }
  }
  renderConquistas(stats);
}

function renderConquistas(stats){
  if(!stats) stats=calcStatsConquistas();
  const grid=document.getElementById('conquistas-grid');
  if(!grid) return;

  grid.innerHTML=CONQUISTAS.map(c=>{
    const done=conquistasDesbloqueadas.includes(c.id);
    // Calcula progresso para tooltip
    let prog='';
    const s=stats;
    if(c.id.startsWith('streak_')){
      const meta=parseInt(c.id.split('_')[1]);
      prog=done?'Concluída!':'Streak atual: '+s.streak+'/'+meta+' dias';
    } else if(c.id.startsWith('plano_')){
      const meta=parseInt(c.id.split('_')[1]);
      prog=done?'Concluída!':s.diasPlano+'/'+meta+' dias';
    } else if(c.id.startsWith('q_')){
      const meta=parseInt(c.id.split('_')[1]);
      prog=done?'Concluída!':s.totalQ+'/'+meta+' questões';
    } else if(c.id==='ace_100'){
      prog=done?'Concluída!':'Faça uma sessão com 100% (mín. 5q)';
    } else if(c.id==='ace_80'){
      prog=done?'Concluída!':'Média atual: '+s.mediaGeral+'%';
    } else if(c.id.startsWith('min_')){
      const meta=parseInt(c.id.split('_')[1]);
      prog=done?'Concluída!':s.totalMin+'/'+meta+' min';
    }

    return '<div class="conquista-card '+(done?'desbloqueada':'bloqueada')+'" title="'+prog+'" onclick="abrirConquista(\''+c.id+'\')" style="cursor:pointer">'
      +(done?'<div class="conquista-badge">✦</div>':'<div class="conquista-badge">🔒</div>')
      +'<span class="conquista-icon">'+c.icon+'</span>'
      +'<div class="conquista-nome">'+c.nome+'</div>'
      +'<div class="conquista-desc">'+prog+'</div>'
    +'</div>';
  }).join('');
}

function abrirConquista(id){
  const c=CONQUISTAS.find(x=>x.id===id);
  if(!c) return;
  const done=conquistasDesbloqueadas.includes(id);
  const stats=calcStatsConquistas();
  let prog='';
  if(id.startsWith('streak_')){const m=parseInt(id.split('_')[1]);prog=done?'Streak conquistado! 🔥':'Progresso: '+stats.streak+'/'+m+' dias seguidos';}
  else if(id.startsWith('plano_')){const m=parseInt(id.split('_')[1]);prog=done?'Plano concluído! 📅':'Progresso: '+stats.diasPlano+'/'+m+' dias';}
  else if(id.startsWith('q_')){const m=parseInt(id.split('_')[1]);prog=done?'Meta atingida! 🎯':'Progresso: '+stats.totalQ+'/'+m+' questões';}
  else if(id==='ace_100'){prog=done?'Sessão perfeita! ✨':'Faça uma sessão com 100% de acertos (mínimo 5 questões)';}
  else if(id==='ace_80'){prog=done?'Média incrível! 🎖️':'Média atual: '+stats.mediaGeral+'% (meta: 80%)';}
  else if(id.startsWith('min_')){const m=parseInt(id.split('_')[1]);prog=done?'Tempo conquistado! ⏱️':'Progresso: '+stats.totalMin+'/'+m+' minutos';}

  document.getElementById('mc-icon').textContent=c.icon;
  document.getElementById('mc-nome').textContent=c.nome;
  document.getElementById('mc-desc').textContent=c.desc;
  document.getElementById('mc-prog').textContent=prog;
  document.getElementById('mc-desbloq').textContent=done?'✦ Conquista desbloqueada!':'🔒 Conquista bloqueada';
  document.getElementById('modal-conquista').style.display='flex';
  if(done) setTimeout(dispararFogos,200);
}

function closeModalConquista(){
  document.getElementById('modal-conquista').style.display='none';
  const canvas=document.getElementById('conquista-canvas');
  canvas.width=0;
}

function dispararFogos(){
  const canvas=document.getElementById('conquista-canvas');
  if(!document.getElementById('modal-conquista') || document.getElementById('modal-conquista').style.display==='none') return;
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const ctx=canvas.getContext('2d');
  const particles=[];
  const colors=['#C084FC','#FBBF24','#4ADE80','#F87171','#67E8F9','#F0E8FF','#A855F7','#FB923C'];

  function explode(x,y){
    for(let i=0;i<60;i++){
      const angle=Math.random()*Math.PI*2;
      const speed=Math.random()*6+2;
      particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,decay:Math.random()*.02+.012,size:Math.random()*3+1.5,color:colors[Math.floor(Math.random()*colors.length)],gravity:.12});
    }
  }

  const W=canvas.width,H=canvas.height;
  [[W*.2,H*.3],[W*.8,H*.25],[W*.5,H*.2],[W*.15,H*.6],[W*.85,H*.55],[W*.5,H*.5],[W*.35,H*.35],[W*.65,H*.4]]
    .forEach(([x,y],i)=>setTimeout(()=>explode(x,y),i*200));

  let frame;
  function draw(){
    if(canvas.width===0){cancelAnimationFrame(frame);return;}
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.98;p.life-=p.decay;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);
      ctx.fillStyle=p.color;ctx.globalAlpha=p.life;ctx.fill();ctx.globalAlpha=1;
    }
    if(canvas.width>0) frame=requestAnimationFrame(draw);
  }
  draw();
}

const PLANO_DATA = [
  {semana:'1',periodo:'22/06–28/06',dias:[
    {data:'2026-06-22',dia:'Seg',conteudo:'PORT · Leitura e interpretação: informações explícitas e implícitas — 10 questões IFPE',mat:'Português'},
    {data:'2026-06-23',dia:'Ter',conteudo:'MAT · Números: frações (operações, simplificação e problemas) — teoria + 10 questões',mat:'Matemática'},
    {data:'2026-06-24',dia:'Qua',conteudo:'CIÊ · Ecologia: componentes do ecossistema, cadeias e teias alimentares',mat:'Ciências da Natureza'},
    {data:'2026-06-25',dia:'Qui',conteudo:'PORT · Intenção comunicativa e fato × opinião — 10 questões',mat:'Português'},
    {data:'2026-06-26',dia:'Sex',conteudo:'MAT · Números decimais: operações, conversão e problemas contextualizados — 10 questões',mat:'Matemática'},
    {data:'2026-06-27',dia:'Sáb',conteudo:'HIST · Segunda Guerra Mundial: fascismo, nazismo, Holocausto e causas do conflito',mat:'História'},
    {data:'2026-06-28',dia:'Dom',conteudo:'Simulado misto: 5 Port + 5 Mat + 5 CG — corrigir e anotar erros',mat:'Geral'},
  ]},
  {semana:'2',periodo:'29/06–05/07',dias:[
    {data:'2026-06-29',dia:'Seg',conteudo:'PORT · Tipologia textual: narração e descrição — reconhecer estrutura e características',mat:'Português'},
    {data:'2026-06-30',dia:'Ter',conteudo:'MAT · Potenciação: propriedades, operações e expressões — teoria + exercícios',mat:'Matemática'},
    {data:'2026-07-01',dia:'Qua',conteudo:'CIÊ · Ecologia: relações ecológicas (harmônicas e desarmônicas) e ecossistemas brasileiros',mat:'Ciências da Natureza'},
    {data:'2026-07-02',dia:'Qui',conteudo:'PORT · Tipologia: argumentação e exposição — identificar tese e argumentos',mat:'Português'},
    {data:'2026-07-03',dia:'Sex',conteudo:'MAT · Raiz quadrada: exata, aproximação decimal e resolução de problemas',mat:'Matemática'},
    {data:'2026-07-04',dia:'Sáb',conteudo:'GEO · Cartografia: elementos do mapa, escala, coordenadas, orientação e legenda',mat:'Geografia'},
    {data:'2026-07-05',dia:'Dom',conteudo:'Simulado: 10 questões Port + revisão dos erros da semana',mat:'Geral'},
  ]},
  {semana:'3',periodo:'06/07–12/07',dias:[
    {data:'2026-07-06',dia:'Seg',conteudo:'PORT · Gêneros textuais: jornalístico (notícia, editorial, crônica) — 10 questões',mat:'Português'},
    {data:'2026-07-07',dia:'Ter',conteudo:'MAT · Expressões com números reais: MMC, MDC e operações mistas — 10 questões',mat:'Matemática'},
    {data:'2026-07-08',dia:'Qua',conteudo:'CIÊ · Poluição: do ar, água, solo, sonora e visual — causas e consequências',mat:'Ciências da Natureza'},
    {data:'2026-07-09',dia:'Qui',conteudo:'PORT · Gêneros: literário e científico — diferenciar linguagem e estrutura',mat:'Português'},
    {data:'2026-07-10',dia:'Sex',conteudo:'MAT · Sistemas de medidas: comprimento, superfície, capacidade e volume — conversões',mat:'Matemática'},
    {data:'2026-07-11',dia:'Sáb',conteudo:'HIST · Segunda Guerra Mundial: etapas, alianças, impactos globais, ONU e Direitos Humanos',mat:'História'},
    {data:'2026-07-12',dia:'Dom',conteudo:'Simulado: 10 questões Mat + revisão dos erros',mat:'Geral'},
  ]},
  {semana:'4',periodo:'13/07–19/07',dias:[
    {data:'2026-07-13',dia:'Seg',conteudo:'PORT · Coerência: relação entre partes, causa/consequência, semelhança/contraste',mat:'Português'},
    {data:'2026-07-14',dia:'Ter',conteudo:'MAT · Razão e proporção: conceitos, propriedades e problemas — 10 questões',mat:'Matemática'},
    {data:'2026-07-15',dia:'Qua',conteudo:'CIÊ · Vírus: estrutura, doenças virais (dengue, COVID, gripe) e vacinas',mat:'Ciências da Natureza'},
    {data:'2026-07-16',dia:'Qui',conteudo:'PORT · Coesão: pronomes, artigos, preposições e conjunções como elementos coesivos',mat:'Português'},
    {data:'2026-07-17',dia:'Sex',conteudo:'MAT · Divisão proporcional direta e inversa — teoria + 10 questões',mat:'Matemática'},
    {data:'2026-07-18',dia:'Sáb',conteudo:'GEO · Projeções cartográficas e movimentos da Terra: rotação e translação e suas consequências',mat:'Geografia'},
    {data:'2026-07-19',dia:'Dom',conteudo:'Simulado misto: 5 Port + 5 Mat + 5 CG — corrigir e anotar',mat:'Geral'},
  ]},
  {semana:'5',periodo:'20/07–26/07',dias:[
    {data:'2026-07-20',dia:'Seg',conteudo:'PORT · Coesão: advérbios, numerais, anáfora e catáfora — 10 questões',mat:'Português'},
    {data:'2026-07-21',dia:'Ter',conteudo:'MAT · Regra de três simples: direta e inversa — teoria + 10 questões',mat:'Matemática'},
    {data:'2026-07-22',dia:'Qua',conteudo:'CIÊ · Reino Monera: bactérias, importância biotecnológica e doenças bacterianas',mat:'Ciências da Natureza'},
    {data:'2026-07-23',dia:'Qui',conteudo:'PORT · Sinonímia, antonímia e polissemia — efeitos de sentido em textos',mat:'Português'},
    {data:'2026-07-24',dia:'Sex',conteudo:'MAT · Regra de três composta — teoria + 10 questões',mat:'Matemática'},
    {data:'2026-07-25',dia:'Sáb',conteudo:'HIST · Guerra Fria: conflito EUA × URSS, corrida armamentista e espacial',mat:'História'},
    {data:'2026-07-26',dia:'Dom',conteudo:'Simulado: 10 questões Port + revisão',mat:'Geral'},
  ]},
  {semana:'6',periodo:'27/07–02/08',dias:[
    {data:'2026-07-27',dia:'Seg',conteudo:'PORT · Ambiguidade, hiperonímia, hiponímia — 10 questões de semântica',mat:'Português'},
    {data:'2026-07-28',dia:'Ter',conteudo:'MAT · Porcentagem: cálculo, aumento, desconto e juros simples — 10 questões',mat:'Matemática'},
    {data:'2026-07-29',dia:'Qua',conteudo:'CIÊ · Reino Protista: protozoários e protozooses (malária, doença de Chagas, amebíase)',mat:'Ciências da Natureza'},
    {data:'2026-07-30',dia:'Qui',conteudo:'PORT · Figuras de linguagem: metáfora, metonímia, ironia, hipérbole — 10 questões',mat:'Português'},
    {data:'2026-07-31',dia:'Sex',conteudo:'MAT · Médias: aritmética, ponderada, geométrica e harmônica — teoria + 10 questões',mat:'Matemática'},
    {data:'2026-08-01',dia:'Sáb',conteudo:'GEO · Estrutura interna da Terra: crosta, manto, núcleo — tectônica de placas',mat:'Geografia'},
    {data:'2026-08-02',dia:'Dom',conteudo:'Simulado misto: 5 Port + 5 Mat + 5 CG — corrigir erros',mat:'Geral'},
  ]},
  {semana:'7',periodo:'03/08–09/08',dias:[
    {data:'2026-08-03',dia:'Seg',conteudo:'PORT · Elipses, substituições e sinônimos como recursos coesivos — 10 questões',mat:'Português'},
    {data:'2026-08-04',dia:'Ter',conteudo:'MAT · Polinômios: valor numérico, adição e subtração — teoria + exercícios',mat:'Matemática'},
    {data:'2026-08-05',dia:'Qua',conteudo:'CIÊ · Reino Fungi e Reino Plantae: características gerais e importância',mat:'Ciências da Natureza'},
    {data:'2026-08-06',dia:'Qui',conteudo:'PORT · Marcadores temporais e espaciais em textos — 10 questões',mat:'Português'},
    {data:'2026-08-07',dia:'Sex',conteudo:'MAT · Produtos notáveis: quadrado da soma, diferença e produto da soma/diferença',mat:'Matemática'},
    {data:'2026-08-08',dia:'Sáb',conteudo:'HIST · Revolução Cubana e Revolução Chinesa — contexto e repercussões',mat:'História'},
    {data:'2026-08-09',dia:'Dom',conteudo:'Simulado: 10 questões Mat + revisão da semana',mat:'Geral'},
  ]},
  {semana:'8',periodo:'10/08–16/08',dias:[
    {data:'2026-08-10',dia:'Seg',conteudo:'PORT · Fonologia: letras × fonemas, dígrafos e encontros consonantais — 10 questões',mat:'Português'},
    {data:'2026-08-11',dia:'Ter',conteudo:'MAT · Fatoração: fator comum, agrupamento e diferença de quadrados — 10 exercícios',mat:'Matemática'},
    {data:'2026-08-12',dia:'Qua',conteudo:'CIÊ · Bioquímica celular: água, sais minerais, carboidratos, proteínas e lipídios',mat:'Ciências da Natureza'},
    {data:'2026-08-13',dia:'Qui',conteudo:'PORT · Ortografia: uso do S/Z, X/CH, G/J e outros casos — 10 questões',mat:'Português'},
    {data:'2026-08-14',dia:'Sex',conteudo:'MAT · Equações do 1º grau: resolução e problemas contextualizados — 10 questões',mat:'Matemática'},
    {data:'2026-08-15',dia:'Sáb',conteudo:'GEO · Relevo mundial e brasileiro: tipos, classificação e dinâmica',mat:'Geografia'},
    {data:'2026-08-16',dia:'Dom',conteudo:'Simulado misto: 10 Port + 10 Mat + 10 CG — análise de desempenho',mat:'Geral'},
  ]},
  {semana:'9',periodo:'17/08–23/08',dias:[
    {data:'2026-08-17',dia:'Seg',conteudo:'PORT · Acentuação: oxítonas, paroxítonas, proparoxítonas e hiatos — 10 questões',mat:'Português'},
    {data:'2026-08-18',dia:'Ter',conteudo:'MAT · Equações do 2º grau: fórmula de Bhaskara e problemas — 10 questões',mat:'Matemática'},
    {data:'2026-08-19',dia:'Qua',conteudo:'CIÊ · Envoltórios e organelas celulares: membrana, núcleo, mitocôndria, ribossomo',mat:'Ciências da Natureza'},
    {data:'2026-08-20',dia:'Qui',conteudo:'PORT · Pontuação: vírgula, ponto e vírgula, dois-pontos e travessão — 10 questões',mat:'Português'},
    {data:'2026-08-21',dia:'Sex',conteudo:'MAT · Sistemas lineares do 1º grau: substituição e adição — 10 questões',mat:'Matemática'},
    {data:'2026-08-22',dia:'Sáb',conteudo:'HIST · Descolonização da África e Ásia: independências, questão da Palestina',mat:'História'},
    {data:'2026-08-23',dia:'Dom',conteudo:'Simulado: 10 questões Port + 10 Mat — revisão de erros',mat:'Geral'},
  ]},
  {semana:'10',periodo:'24/08–30/08',dias:[
    {data:'2026-08-24',dia:'Seg',conteudo:'PORT · Classes gramaticais: substantivo, adjetivo, artigo e numeral — 10 questões',mat:'Português'},
    {data:'2026-08-25',dia:'Ter',conteudo:'MAT · Ângulos: conceitos, classificação, bissetriz e problemas — 10 questões',mat:'Matemática'},
    {data:'2026-08-26',dia:'Qua',conteudo:'CIÊ · Mitose e meiose: etapas, diferenças e importância biológica',mat:'Ciências da Natureza'},
    {data:'2026-08-27',dia:'Qui',conteudo:'PORT · Classes: pronome, verbo (modos e tempos), advérbio — 10 questões',mat:'Português'},
    {data:'2026-08-28',dia:'Sex',conteudo:'MAT · Polígonos: classificação, ângulos internos/externos, diagonais — 10 questões',mat:'Matemática'},
    {data:'2026-08-29',dia:'Sáb',conteudo:'GEO · Solos: formação, classificação e degradação ambiental',mat:'Geografia'},
    {data:'2026-08-30',dia:'Dom',conteudo:'Simulado misto: 10 Port + 10 Mat + 10 CG — análise',mat:'Geral'},
  ]},
  {semana:'11',periodo:'31/08–06/09',dias:[
    {data:'2026-08-31',dia:'Seg',conteudo:'PORT · Preposição, conjunção e interjeição: funções e usos — 10 questões',mat:'Português'},
    {data:'2026-09-01',dia:'Ter',conteudo:'MAT · Triângulos: classificação, lei angular de Tales, relações — 10 questões',mat:'Matemática'},
    {data:'2026-09-02',dia:'Qua',conteudo:'CIÊ · Tecidos animal: epitelial, conjuntivo, muscular e nervoso',mat:'Ciências da Natureza'},
    {data:'2026-09-03',dia:'Qui',conteudo:'PORT · Flexão nominal: gênero e número — plural dos compostos — 10 questões',mat:'Português'},
    {data:'2026-09-04',dia:'Sex',conteudo:'MAT · Semelhança de triângulos, bissetrizes e medianas — 10 questões',mat:'Matemática'},
    {data:'2026-09-05',dia:'Sáb',conteudo:'HIST · América Latina pós-guerra: ditaduras e movimentos sociais',mat:'História'},
    {data:'2026-09-06',dia:'Dom',conteudo:'Simulado: 10 Port + 10 Mat — revisão de erros',mat:'Geral'},
  ]},
  {semana:'12',periodo:'07/09–13/09',dias:[
    {data:'2026-09-07',dia:'Seg',conteudo:'PORT · Flexão verbal: modo, tempo, pessoa e número — conjugação — 10 questões',mat:'Português'},
    {data:'2026-09-08',dia:'Ter',conteudo:'MAT · Relações métricas no triângulo retângulo: Pitágoras e altura — 10 questões',mat:'Matemática'},
    {data:'2026-09-09',dia:'Qua',conteudo:'CIÊ · Sistema respiratório e circulatório: órgãos, funções e doenças',mat:'Ciências da Natureza'},
    {data:'2026-09-10',dia:'Qui',conteudo:'PORT · Formação de palavras: derivação e composição — prefixos e sufixos — 10 questões',mat:'Português'},
    {data:'2026-09-11',dia:'Sex',conteudo:'MAT · Trigonometria básica: seno, cosseno, tangente e aplicações — 10 questões',mat:'Matemática'},
    {data:'2026-09-12',dia:'Sáb',conteudo:'GEO · Clima: elementos e fatores climáticos — climas do Brasil e do mundo',mat:'Geografia'},
    {data:'2026-09-13',dia:'Dom',conteudo:'Simulado misto: 10 Port + 10 Mat + 10 CG',mat:'Geral'},
  ]},
  {semana:'13',periodo:'14/09–20/09',dias:[
    {data:'2026-09-14',dia:'Seg',conteudo:'PORT · Sintaxe: ordem dos termos, sujeito, predicado e complementos — 10 questões',mat:'Português'},
    {data:'2026-09-15',dia:'Ter',conteudo:'MAT · Áreas: retângulo, quadrado, triângulo, paralelogramo e losango — 10 questões',mat:'Matemática'},
    {data:'2026-09-16',dia:'Qua',conteudo:'CIÊ · Sistema digestório e urinário: órgãos, funções e doenças principais',mat:'Ciências da Natureza'},
    {data:'2026-09-17',dia:'Qui',conteudo:'PORT · Concordância nominal e verbal: regras e exceções — 10 questões',mat:'Português'},
    {data:'2026-09-18',dia:'Sex',conteudo:'MAT · Áreas: trapézio, círculo e polígonos regulares — 10 questões',mat:'Matemática'},
    {data:'2026-09-19',dia:'Sáb',conteudo:'HIST · Globalização e neoliberalismo: transformações econômicas e fim da Guerra Fria',mat:'História'},
    {data:'2026-09-20',dia:'Dom',conteudo:'Simulado: 10 Port + 10 Mat — revisão de erros',mat:'Geral'},
  ]},
  {semana:'14',periodo:'21/09–27/09',dias:[
    {data:'2026-09-21',dia:'Seg',conteudo:'PORT · Regência verbal e nominal: verbos de regência especial — 10 questões',mat:'Português'},
    {data:'2026-09-22',dia:'Ter',conteudo:'MAT · Circunferência e círculo: arcos, ângulos centrais e inscritos — 10 questões',mat:'Matemática'},
    {data:'2026-09-23',dia:'Qua',conteudo:'CIÊ · Sistema nervoso e reprodutor: órgãos, ISTs e métodos contraceptivos',mat:'Ciências da Natureza'},
    {data:'2026-09-24',dia:'Qui',conteudo:'PORT · Coordenação: orações coordenadas assindéticas e sindéticas — 10 questões',mat:'Português'},
    {data:'2026-09-25',dia:'Sex',conteudo:'MAT · Revisão: porcentagem, regra de três e médias — 15 questões',mat:'Matemática'},
    {data:'2026-09-26',dia:'Sáb',conteudo:'GEO · Hidrografia: bacias hidrográficas brasileiras e aspectos ambientais',mat:'Geografia'},
    {data:'2026-09-27',dia:'Dom',conteudo:'Simulado misto: 10 Port + 10 Mat + 10 CG',mat:'Geral'},
  ]},
  {semana:'15',periodo:'28/09–04/10',dias:[
    {data:'2026-09-28',dia:'Seg',conteudo:'PORT · Subordinação: orações subordinadas substantivas e adjetivas — 10 questões',mat:'Português'},
    {data:'2026-09-29',dia:'Ter',conteudo:'MAT · Revisão: equações, sistemas lineares e fatoração — 15 questões',mat:'Matemática'},
    {data:'2026-09-30',dia:'Qua',conteudo:'CIÊ · Leis de Mendel: hereditariedade, 1ª e 2ª lei, dominância — problemas',mat:'Ciências da Natureza'},
    {data:'2026-10-01',dia:'Qui',conteudo:'PORT · Subordinação: orações adverbiais (causal, condicional, temporal) — 10 questões',mat:'Português'},
    {data:'2026-10-02',dia:'Sex',conteudo:'MAT · Revisão geral de geometria: ângulos, triângulos e semelhança — 15 questões',mat:'Matemática'},
    {data:'2026-10-03',dia:'Sáb',conteudo:'HIST · República Oligárquica (1889–1930): política do café com leite e coronelismo',mat:'História'},
    {data:'2026-10-04',dia:'Dom',conteudo:'Simulado: 15 Port + 15 Mat — análise de desempenho',mat:'Geral'},
  ]},
  {semana:'16',periodo:'05/10–11/10',dias:[
    {data:'2026-10-05',dia:'Seg',conteudo:'PORT · Revisão Port I: interpretação + tipologia + gêneros — 15 questões IFPE antigas',mat:'Português'},
    {data:'2026-10-06',dia:'Ter',conteudo:'MAT · Revisão Mat I: números, proporcionalidade, porcentagem — 15 questões IFPE antigas',mat:'Matemática'},
    {data:'2026-10-07',dia:'Qua',conteudo:'CIÊ · Evolução: Lamarck, Darwin e seleção natural — 10 questões',mat:'Ciências da Natureza'},
    {data:'2026-10-08',dia:'Qui',conteudo:'PORT · Revisão Port II: coesão, coerência, semântica — 15 questões',mat:'Português'},
    {data:'2026-10-09',dia:'Sex',conteudo:'MAT · Revisão Mat II: álgebra, equações e sistemas — 15 questões',mat:'Matemática'},
    {data:'2026-10-10',dia:'Sáb',conteudo:'GEO · Vegetação: biomas mundiais e brasileiros (Caatinga, Cerrado, Mata Atlântica)',mat:'Geografia'},
    {data:'2026-10-11',dia:'Dom',conteudo:'Simulado completo: 30 questões cronometrado — análise',mat:'Geral'},
  ]},
  {semana:'17',periodo:'12/10–18/10',dias:[
    {data:'2026-10-12',dia:'Seg',conteudo:'PORT · Revisão Port III: gramática — classes e flexões — 15 questões',mat:'Português'},
    {data:'2026-10-13',dia:'Ter',conteudo:'MAT · Revisão Mat III: geometria plana — áreas e trigonometria — 15 questões',mat:'Matemática'},
    {data:'2026-10-14',dia:'Qua',conteudo:'HIST · Era Vargas (1930–1945): getulismo, trabalhismo e Estado Novo',mat:'História'},
    {data:'2026-10-15',dia:'Qui',conteudo:'PORT · Revisão Port IV: sintaxe — concordância, regência, pontuação — 15 questões',mat:'Português'},
    {data:'2026-10-16',dia:'Sex',conteudo:'MAT · Revisão Mat IV: circunferência, polígonos regulares e problemas — 15 questões',mat:'Matemática'},
    {data:'2026-10-17',dia:'Sáb',conteudo:'GEO · Meio ambiente: sustentabilidade, mudanças climáticas e questão ambiental',mat:'Geografia'},
    {data:'2026-10-18',dia:'Dom',conteudo:'Simulado completo: 30 questões cronometrado — análise',mat:'Geral'},
  ]},
  {semana:'18',periodo:'19/10–25/10',dias:[
    {data:'2026-10-19',dia:'Seg',conteudo:'CIÊ · Revisão CG I: ecologia, vírus, reinos — 15 questões',mat:'Ciências da Natureza'},
    {data:'2026-10-20',dia:'Ter',conteudo:'HIST · República Liberal (1946–1964): democracia, JK e Jango',mat:'História'},
    {data:'2026-10-21',dia:'Qua',conteudo:'GEO · Urbanização: êxodo rural, metrópoles e problemas urbanos no Brasil',mat:'Geografia'},
    {data:'2026-10-22',dia:'Qui',conteudo:'CIÊ · Revisão CG II: citologia, histologia, fisiologia — 15 questões',mat:'Ciências da Natureza'},
    {data:'2026-10-23',dia:'Sex',conteudo:'HIST · Ditadura Civil-Militar (1964–1985): AI-5, repressão e abertura',mat:'História'},
    {data:'2026-10-24',dia:'Sáb',conteudo:'GEO · Globalização, industrialização e geopolítica mundial atual',mat:'Geografia'},
    {data:'2026-10-25',dia:'Dom',conteudo:'Simulado completo: 30 questões cronometrado — análise detalhada',mat:'Geral'},
  ]},
  {semana:'19',periodo:'26/10–01/11',dias:[
    {data:'2026-10-26',dia:'Seg',conteudo:'HIST · Nova República (1985–): redemocratização, Constituição de 1988',mat:'História'},
    {data:'2026-10-27',dia:'Ter',conteudo:'GEO · Energia no Brasil e no mundo: fontes renováveis e não-renováveis',mat:'Geografia'},
    {data:'2026-10-28',dia:'Qua',conteudo:'CIÊ · Revisão CG III: genética, evolução e saúde — 15 questões',mat:'Ciências da Natureza'},
    {data:'2026-10-29',dia:'Qui',conteudo:'HIST · Revisão Hist I: mundo contemporâneo — 15 questões IFPE antigas',mat:'História'},
    {data:'2026-10-30',dia:'Sex',conteudo:'GEO · Questão agrária, espaço rural e Reforma Agrária no Brasil',mat:'Geografia'},
    {data:'2026-10-31',dia:'Sáb',conteudo:'HIST · Revisão Hist II: Brasil contemporâneo — 15 questões',mat:'História'},
    {data:'2026-11-01',dia:'Dom',conteudo:'Simulado completo #3: 30 questões — foco nos pontos fracos',mat:'Geral'},
  ]},
  {semana:'20',periodo:'02/11–08/11',dias:[
    {data:'2026-11-02',dia:'Seg',conteudo:'PORT · Simulado específico Port: 20 questões estilo IFPE — análise',mat:'Português'},
    {data:'2026-11-03',dia:'Ter',conteudo:'MAT · Simulado específico Mat: 20 questões estilo IFPE — análise',mat:'Matemática'},
    {data:'2026-11-04',dia:'Qua',conteudo:'GEO · Revisão Geo I: cartografia, estrutura da Terra, relevo — 15 questões',mat:'Geografia'},
    {data:'2026-11-05',dia:'Qui',conteudo:'CIÊ · Simulado específico CG: 20 questões estilo IFPE — análise',mat:'Ciências da Natureza'},
    {data:'2026-11-06',dia:'Sex',conteudo:'GEO · Revisão Geo II: clima, vegetação, hidrografia — 15 questões',mat:'Geografia'},
    {data:'2026-11-07',dia:'Sáb',conteudo:'Simulado completo #4: 30 questões cronometrado',mat:'Geral'},
    {data:'2026-11-08',dia:'Dom',conteudo:'Análise aprofundada: mapear matérias com maior % de erro',mat:'Geral'},
  ]},
  {semana:'21',periodo:'09/11–15/11',dias:[
    {data:'2026-11-09',dia:'Seg',conteudo:'PORT · Revisão intensiva: tópicos com maior % de erro — 20 questões',mat:'Português'},
    {data:'2026-11-10',dia:'Ter',conteudo:'MAT · Revisão intensiva: tópicos com maior % de erro — 20 questões',mat:'Matemática'},
    {data:'2026-11-11',dia:'Qua',conteudo:'CIÊ · Revisão intensiva: tópicos com maior % de erro — 20 questões',mat:'Ciências da Natureza'},
    {data:'2026-11-12',dia:'Qui',conteudo:'HIST/GEO · Revisão intensiva: tópicos com maior % de erro — 20 questões',mat:'História'},
    {data:'2026-11-13',dia:'Sex',conteudo:'Simulado completo #5: 30 questões — meta: acima de 70%',mat:'Geral'},
    {data:'2026-11-14',dia:'Sáb',conteudo:'Revisão dos erros do simulado + caderno de erros final',mat:'Geral'},
    {data:'2026-11-15',dia:'Dom',conteudo:'Descanso ativo: reler resumos sem fazer questões',mat:'Geral'},
  ]},
  {semana:'22',periodo:'16/11–22/11',dias:[
    {data:'2026-11-16',dia:'Seg',conteudo:'PORT · Revisão final Port: 15 questões das mais cobradas no IFPE',mat:'Português'},
    {data:'2026-11-17',dia:'Ter',conteudo:'MAT · Revisão final Mat: 15 questões das mais cobradas no IFPE',mat:'Matemática'},
    {data:'2026-11-18',dia:'Qua',conteudo:'CIÊ · Revisão final CG: 15 questões das mais cobradas no IFPE',mat:'Ciências da Natureza'},
    {data:'2026-11-19',dia:'Qui',conteudo:'HIST/GEO · Revisão final: 15 questões das mais cobradas no IFPE',mat:'História'},
    {data:'2026-11-20',dia:'Sex',conteudo:'Simulado completo #6: 30 questões — condições reais de prova',mat:'Geral'},
    {data:'2026-11-21',dia:'Sáb',conteudo:'Revisão leve dos erros do simulado',mat:'Geral'},
    {data:'2026-11-22',dia:'Dom',conteudo:'Descanso total — sem estudos',mat:'Geral'},
  ]},
  {semana:'23',periodo:'23/11–29/11',dias:[
    {data:'2026-11-23',dia:'Seg',conteudo:'PORT · Reler resumos e mapas mentais — sem fazer questões',mat:'Português'},
    {data:'2026-11-24',dia:'Ter',conteudo:'MAT · Reler resumos e mapas mentais — sem fazer questões',mat:'Matemática'},
    {data:'2026-11-25',dia:'Qua',conteudo:'CIÊ · Reler resumos e mapas mentais — sem fazer questões',mat:'Ciências da Natureza'},
    {data:'2026-11-26',dia:'Qui',conteudo:'HIST/GEO · Reler resumos e mapas mentais',mat:'História'},
    {data:'2026-11-27',dia:'Sex',conteudo:'Simulado final: 30 questões — registrar desempenho final',mat:'Geral'},
    {data:'2026-11-28',dia:'Sáb',conteudo:'Revisão levíssima dos erros mais recorrentes',mat:'Geral'},
    {data:'2026-11-29',dia:'Dom',conteudo:'Descanso total — cuidar do sono e alimentação',mat:'Geral'},
  ]},
  {semana:'24',periodo:'30/11–06/12',dias:[
    {data:'2026-11-30',dia:'Seg',conteudo:'Revisão rápida: 5 questões de cada matéria (20 total)',mat:'Geral'},
    {data:'2026-12-01',dia:'Ter',conteudo:'Reler caderno de erros — sem novos conteúdos',mat:'Geral'},
    {data:'2026-12-02',dia:'Qua',conteudo:'Revisão rápida: pontos que ainda geram dúvida',mat:'Geral'},
    {data:'2026-12-03',dia:'Qui',conteudo:'Descanso — dormir bem é parte do preparo',mat:'Geral'},
    {data:'2026-12-04',dia:'Sex',conteudo:'Revisão levíssima: 10 questões do que mais errou',mat:'Geral'},
    {data:'2026-12-05',dia:'Sáb',conteudo:'Organizar documentos e material para a prova',mat:'Geral'},
    {data:'2026-12-06',dia:'Dom',conteudo:'Descanso total — sem estudos',mat:'Geral'},
  ]},
  {semana:'25',periodo:'07/12–13/12',dias:[
    {data:'2026-12-07',dia:'Seg',conteudo:'Revisão muito leve: 1 tópico por matéria que ainda gere insegurança',mat:'Geral'},
    {data:'2026-12-08',dia:'Ter',conteudo:'Descanso total',mat:'Geral'},
    {data:'2026-12-09',dia:'Qua',conteudo:'Rever caderno de erros finais (30 min máximo)',mat:'Geral'},
    {data:'2026-12-10',dia:'Qui',conteudo:'Descanso — sono de qualidade é fundamental',mat:'Geral'},
    {data:'2026-12-11',dia:'Sex',conteudo:'5 questões das matérias mais inseguras — relaxado',mat:'Geral'},
    {data:'2026-12-12',dia:'Sáb',conteudo:'Preparar roupa, documentos e material para a prova',mat:'Geral'},
    {data:'2026-12-13',dia:'Dom',conteudo:'Descanso e confiança — você está preparada! ✦',mat:'Geral'},
  ]},
  {semana:'26',periodo:'14/12–20/12',dias:[
    {data:'2026-12-14',dia:'Seg',conteudo:'Revisão levíssima — só o que sentir necessidade (máx 30 min)',mat:'Geral'},
    {data:'2026-12-15',dia:'Ter',conteudo:'Descanso total',mat:'Geral'},
    {data:'2026-12-16',dia:'Qua',conteudo:'5 questões de cada matéria — só para aquecer',mat:'Geral'},
    {data:'2026-12-17',dia:'Qui',conteudo:'Descanso — dormir cedo',mat:'Geral'},
    {data:'2026-12-18',dia:'Sex',conteudo:'Confirmar local de prova, documentos e horário',mat:'Geral'},
    {data:'2026-12-19',dia:'Sáb',conteudo:'Descanso total. Dorme cedo. Você consegue! 🌟',mat:'Geral'},
    {data:'2026-12-20',dia:'Dom',conteudo:'🎯 DIA DA PROVA — IFPE 2027 · Boa sorte, Luísa!',mat:'Geral'},
  ]},
];

let planoFeitos = JSON.parse(localStorage.getItem('luisa_plano')||'[]');

function savePlano(){
  localStorage.setItem('luia_plano',JSON.stringify(planoFeitos));
  // PATCH direto — mais confiável que upsert para linha existente
  fetch(`${SUPA_URL}/rest/v1/study_goals?id=eq.1`,{
    method:'PATCH',
    headers:{...H,'Prefer':'return=minimal'},
    body:JSON.stringify({plano_feitos:planoFeitos})
  }).catch(()=>{});
}

function renderPlano(){
  const wrap=document.getElementById('plano-list');
  const today=todayLocal();
  const MAT_BADGE={'Português':'badge-port','Matemática':'badge-mat','Ciências da Natureza':'badge-bio','História':'badge-hist','Geografia':'badge-geo','Geral':'badge-rev'};

  wrap.innerHTML=PLANO_DATA.map((sem,si)=>{
    const totalDias=sem.dias.length;
    const feitos=sem.dias.filter(d=>planoFeitos.includes(d.data)).length;
    const pct=Math.round(feitos/totalDias*100);
    const isCurrent=sem.dias.some(d=>d.data===today||d.data>=today)&&(si===0||PLANO_DATA[si-1].dias.every(d=>d.data<today));

    const diasHTML=sem.dias.map(d=>{
      const isDone=planoFeitos.includes(d.data);
      const isToday=d.data===today;
      const isPast=d.data<today&&!isDone;
      const isFuture=d.data>today;
      const badge=MAT_BADGE[d.mat]||'badge-rev';

      // Estilo do container do dia
      let diaStyle='';
      if(isToday) diaStyle='background:rgba(251,191,36,.06);border-radius:8px;padding:8px;margin:-2px';
      else if(isPast&&!isDone) diaStyle='border-left:2px solid rgba(248,113,113,.3);padding-left:6px;margin-left:-6px';

      // Classe e estilo do check
      let checkClass='plano-dia-check';
      if(isDone) checkClass+=' done';
      else if(isToday) checkClass+=' hoje';
      else if(isPast) checkClass+=' atrasado';

      // Badge de status
      let statusBadge='';
      if(isDone) statusBadge='<span class="status-badge badge-feito">✓ Feito</span>';
      else if(isToday) statusBadge='<span class="status-badge badge-hoje">📌 Hoje</span>';
      else if(isPast) statusBadge='<span class="status-badge badge-atrasado">⚠️ Atrasado</span>';

      return '<div class="plano-dia" style="'+diaStyle+'">'
        +'<div class="'+checkClass+'" onclick="_authTogglePlano(\''+d.data+'\',this)"></div>'
        +'<div class="plano-dia-info">'
          +'<div class="plano-dia-data" style="display:flex;align-items:center;flex-wrap:wrap;gap:4px">'+d.dia+', '+fmtDate(d.data)+statusBadge+'</div>'
          +'<div class="plano-dia-conteudo">'+d.conteudo+'</div>'
          +'<span class="bloco-badge '+badge+'" style="margin-top:4px;display:inline-block">'+d.mat+'</span>'
        +'</div>'
      +'</div>';
    }).join('');

    return '<div class="plano-semana">'
      +'<div class="plano-semana-header" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'block\':\'none\'">'
        +'<div>'
          +'<div class="plano-semana-titulo">Semana '+sem.semana+' · '+sem.periodo+'</div>'
          +'<div style="font-size:10px;color:var(--text-dim);margin-top:2px">'+feitos+' de '+totalDias+' dias · '+pct+'%</div>'
        +'</div>'
        +'<div style="display:flex;align-items:center;gap:8px">'
          +'<div style="width:60px;height:4px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--accent);border-radius:99px"></div></div>'
          +(isCurrent?'<span style="font-size:9px;background:var(--accent);color:#fff;padding:2px 7px;border-radius:99px">ATUAL</span>':'')
        +'</div>'
      +'</div>'
      +'<div class="plano-semana-body" style="display:'+(isCurrent?'block':'none')+'">'
        +diasHTML
      +'</div>'
    +'</div>';
  }).join('');
}

// ═══════════════════════════════════════
//  CRUZAMENTO AUTOMÁTICO SESSÕES → PLANO
// ═══════════════════════════════════════
function sincronizarPlanoComSessoes(){
  let mudou=false;
  const diasComSessao=new Set(sessions.filter(s=>!s.archived).map(s=>s.data));

  // Marca dias do PLANO_DATA que têm sessão
  PLANO_DATA.forEach(sem=>{
    sem.dias.forEach(d=>{
      if(diasComSessao.has(d.data) && !planoFeitos.includes(d.data)){
        planoFeitos.push(d.data);
        mudou=true;
      }
    });
  });

  // TAMBÉM marca qualquer dia com sessão diretamente — mesmo que não esteja no plano
  // Isso garante que o streak conta mesmo se o dia não tem conteúdo no plano
  diasComSessao.forEach(data=>{
    if(!planoFeitos.includes(data)){
      planoFeitos.push(data);
      mudou=true;
    }
  });

  if(mudou){
    savePlano();
    return true;
  }
  return false;
}

function togglePlano(data, el){
  const jaFeito=planoFeitos.includes(data);
  if(jaFeito){
    planoFeitos=planoFeitos.filter(d=>d!==data);
    showToast('Dia desmarcado.','info');
  } else {
    planoFeitos.push(data);
    const isToday=data===todayLocal();
    if(isToday) setTimeout(celebrar, 200);
    else showToast('Dia concluído! 🔥','success');
  }
  savePlano();
  // Re-renderiza o plano para refletir o novo estado no check
  renderPlano();
  renderStreak();
  renderDashboard();
  atualizarContador();
  verificarConquistas();
}

// ═══════════════════════════════════════
//  METAS
// ═══════════════════════════════════════
async function salvarMetas(){
  const h=parseInt(document.getElementById('g-hours').value)||0;
  const s=parseInt(document.getElementById('g-sessions').value)||0;
  const q=parseInt(document.getElementById('g-questions').value)||0;
  const dataProva=document.getElementById('g-data-prova')?.value||goals.data_prova||'2026-12-20';
  const objetivo=document.getElementById('g-objetivo')?.value.trim()||goals.objetivo||'IFPE 2027';
  goals={...goals,weekly_hours:h,weekly_sessions:s,weekly_questions:q,data_prova:dataProva,objetivo};
  saveLocal();renderMetas();renderDashMetas();atualizarContador();showToast('Metas salvas! ✦','success');
  try{
    await fetch(`${SUPA_URL}/rest/v1/study_goals?id=eq.1`,{
      method:'PATCH',
      headers:{...H,'Prefer':'return=minimal'},
      body:JSON.stringify({weekly_hours:goals.weekly_hours,weekly_sessions:goals.weekly_sessions,weekly_questions:goals.weekly_questions,data_prova:goals.data_prova||'',objetivo:goals.objetivo||''})
    });
  }catch(e){}
}
function renderMetas(){
  document.getElementById('g-hours').value=goals.weekly_hours||'';
  document.getElementById('g-sessions').value=goals.weekly_sessions||'';
  document.getElementById('g-questions').value=goals.weekly_questions||'';
  if(document.getElementById('g-data-prova')) document.getElementById('g-data-prova').value=goals.data_prova||'2026-12-20';
  if(document.getElementById('g-objetivo')) document.getElementById('g-objetivo').value=goals.objetivo||'IFPE 2027';

  const now=new Date();
  const startW=new Date(now);startW.setDate(now.getDate()-now.getDay());startW.setHours(0,0,0,0);
  const weekSess=sessions.filter(s=>{const d=new Date(s.data+'T12:00');return d>=startW});
  const wMin=weekSess.reduce((a,s)=>a+(s.minutos||0),0);
  const wSess=weekSess.length;
  const wQ=weekSess.reduce((a,s)=>a+s.acertos+s.erros,0);

  const wrap=document.getElementById('metas-progress');
  if(!goals.weekly_hours&&!goals.weekly_sessions&&!goals.weekly_questions){wrap.innerHTML='<p style="color:var(--text-dim);font-size:13px;margin-top:1rem">Defina metas acima para acompanhar o progresso.</p>';return;}
  const items=[
    {label:'Horas estudadas',cur:Math.round(wMin/60*10)/10,meta:goals.weekly_hours,unit:'h'},
    {label:'Sessões realizadas',cur:wSess,meta:goals.weekly_sessions,unit:''},
    {label:'Questões resolvidas',cur:wQ,meta:goals.weekly_questions,unit:''}
  ].filter(x=>x.meta>0);
  wrap.innerHTML=items.map(x=>{const pct=Math.min(100,Math.round(x.cur/x.meta*100));const col=pct>=100?'var(--success)':pct>=60?'var(--warning)':'var(--accent)';return`<div class="goal-card">
    <div class="goal-header"><span class="goal-title">${x.label}</span><span class="goal-pct">${pct}%</span></div>
    <div class="progress-header"><span style="color:var(--text-secondary)">${x.cur}${x.unit} de ${x.meta}${x.unit}</span></div>
    <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${col}"></div></div>
  </div>`;}).join('');
}

// ═══════════════════════════════════════
//  CRONOGRAMA
// ═══════════════════════════════════════
function renderCronograma(){
  const wrap=document.getElementById('dias-list');
  CRONOGRAMA_DATA.forEach((d,i)=>{
    const card=document.createElement('div');
    card.className='day-card'+(i===0?' open':'');
    card.innerHTML=`<div class="day-header" onclick="this.parentElement.classList.toggle('open')">
      <div class="day-dot"></div><div class="day-name">${d.dia}</div>
      <div class="day-meta">${d.livre}</div><div class="day-chevron">▼</div>
    </div>
    <div class="day-body">${d.blocos.map(b=>`<div class="bloco">
      <div class="bloco-header"><span class="bloco-horario">${b.horario}</span><span class="bloco-badge ${b.badge}">${b.materia}</span></div>
      <div style="font-size:11px;color:var(--text-secondary);padding-left:4px;line-height:1.6">${b.tipo}</div>
    </div>`).join('')}</div>`;
    wrap.appendChild(card);
  });
}

// ═══════════════════════════════════════
//  CICLOS
// ═══════════════════════════════════════
function renderCicloNav(){document.getElementById('ciclo-nav').innerHTML=CICLOS.map((c,i)=>`<button class="ciclo-btn ${i===currentCiclo?'active':''}" onclick="selectCiclo(${i})">${c.nome}</button>`).join('');}
function selectCiclo(i){currentCiclo=i;renderCicloNav();renderCicloContent();}
function renderCicloContent(){
  const c=CICLOS[currentCiclo];
  const total=c.semanas.length;
  const done=c.semanas.filter((_,si)=>semanasFeitas.includes(`${currentCiclo}-${si}`)).length;
  const pct=Math.round(done/total*100);
  document.getElementById('ciclo-content').innerHTML=`
    <div class="card" style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600;color:var(--accent-light)">${c.nome} — ${c.subtitulo}</span>
        <span style="font-size:10px;color:var(--text-secondary)">${c.periodo}</span>
      </div>
      <div class="progress-header"><span>${done} de ${total} semanas</span><span>${pct}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:var(--accent)"></div></div>
    </div>
    ${c.semanas.map((s,si)=>{const key=`${currentCiclo}-${si}`;const isDone=semanasFeitas.includes(key);return`<div class="semana-card" style="${isDone?'opacity:.55':''}">
      <div class="semana-num">${s.num}</div>
      <div class="semana-content">
        <div class="semana-periodo">${s.periodo}</div>
        <div class="semana-topics">${s.topics.map(t=>`<span class="topic-chip">${t}</span>`).join('')}</div>
        <div class="semana-check">
          <div class="check-dot ${isDone?'done':''}" onclick="toggleSemana('${key}',this)"></div>
          <span class="check-label">${isDone?'Semana concluída ✦':'Marcar como concluída'}</span>
        </div>
      </div>
    </div>`;}).join('')}`;
}
async function toggleSemana(key,el){
  if(semanasFeitas.includes(key)){semanasFeitas=semanasFeitas.filter(k=>k!==key);showToast('Semana desmarcada.','info');}
  else{semanasFeitas.push(key);showToast('Semana concluída! ✦','success');}
  saveLocal();renderCicloContent();renderCicloNav();
  try{await sbUpsert('ciclos_feitos',semanasFeitas.map(k=>({ciclo_key:k})),'ciclo_key');}catch(e){}
}

// ═══════════════════════════════════════
//  HEATMAP
// ═══════════════════════════════════════
function renderHeatmap(){
  const grid=document.getElementById('heatmap-grid');
  const months=document.getElementById('heatmap-months');
  const today=new Date();
  const WEEKS=26;
  const start=new Date(today);
  start.setDate(today.getDate()-(WEEKS*7));
  start.setDate(start.getDate()-start.getDay());

  const byDay={};
  sessions.forEach(s=>{const k=s.data;if(!byDay[k])byDay[k]=0;byDay[k]+=(s.minutos||1);});

  const cols=[];let cur=new Date(start);
  const monthsShown=[];
  while(cur<=today){
    const col=[];
    for(let d=0;d<7;d++){const dt=new Date(cur);dt.setDate(cur.getDate()+d);col.push(new Date(dt));}
    if(col[0].getDate()<=7){const mn=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][col[0].getMonth()];monthsShown.push({col:cols.length,name:mn});}
    cols.push(col);cur.setDate(cur.getDate()+7);
  }

  // Labels de mês responsivos usando flex igual ao grid
  months.innerHTML='';
  const monthWrap=document.createElement('div');
  monthWrap.style.cssText='display:flex;gap:4px;width:100%';
  cols.forEach((col,ci)=>{
    const m=monthsShown.find(x=>x.col===ci);
    const span=document.createElement('span');
    span.style.cssText='flex:1;font-size:9px;color:var(--text-dim);overflow:hidden';
    span.textContent=m?m.name:'';
    monthWrap.appendChild(span);
  });
  months.appendChild(monthWrap);

  grid.innerHTML='';
  cols.forEach(col=>{
    const colEl=document.createElement('div');colEl.className='heatmap-col';
    col.forEach(dt=>{
      const k=dateToLocal(dt);
      const val=byDay[k]||0;
      const cell=document.createElement('div');cell.className='heatmap-cell';
      const intensity=val===0?0.07:val<30?0.3:val<60?0.6:1;
      cell.style.background=`rgba(168,85,247,${intensity})`;
      cell.title=`${fmtDate(k)}: ${val}min`;
      colEl.appendChild(cell);
    });
    grid.appendChild(colEl);
  });
}

// ═══════════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════════
function renderAnalytics(){
  // Sempre reseta para — antes de calcular
  ['an-best','an-worst','an-avg','an-day'].forEach(id=>{
    document.getElementById(id).textContent='—';
  });
  document.getElementById('an-best-sub').textContent='';
  document.getElementById('an-worst-sub').textContent='';
  document.getElementById('an-day-sub').textContent='';

  const ativas=sessions.filter(s=>!s.archived);
  const withQ=ativas.filter(s=>s.acertos+s.erros>0);
  if(withQ.length){
    const byMat={};
    MATS.forEach(m=>{
      const ms=withQ.filter(s=>s.materia===m);
      const a=ms.reduce((t,s)=>t+s.acertos,0);
      const e=ms.reduce((t,s)=>t+s.erros,0);
      if(a+e>0) byMat[m]={pct:Math.round(a/(a+e)*100),total:a+e};
    });
    const sorted=Object.entries(byMat).sort((a,b)=>b[1].pct-a[1].pct);
    if(sorted.length){
      document.getElementById('an-best').textContent=sorted[0][0].split(' ')[0];
      document.getElementById('an-best-sub').textContent=sorted[0][1].pct+'% acertos';
      document.getElementById('an-worst').textContent=sorted[sorted.length-1][0].split(' ')[0];
      document.getElementById('an-worst-sub').textContent=sorted[sorted.length-1][1].pct+'% acertos';
    }
  }
  const withMin=ativas.filter(s=>s.minutos>0);
  if(withMin.length){
    const avg=Math.round(withMin.reduce((t,s)=>t+s.minutos,0)/withMin.length);
    document.getElementById('an-avg').textContent=avg+'min';
  }
  if(ativas.length){
    const byDay={};
    ativas.forEach(s=>{const d=new Date(s.data+'T12:00').getDay();if(!byDay[d])byDay[d]=0;byDay[d]+=s.minutos||1;});
    const bestDay=Object.entries(byDay).sort((a,b)=>b[1]-a[1])[0];
    if(bestDay){
      document.getElementById('an-day').textContent=DIAS_SEMANA[bestDay[0]];
      document.getElementById('an-day-sub').textContent=bestDay[1]+'min acumulados';
    }
  }
}

// ═══════════════════════════════════════
//  STREAK
// ═══════════════════════════════════════
let streakMonthOffset=0;

function streakPrevMonth(){streakMonthOffset--;renderStreak();}
function streakNextMonth(){if(streakMonthOffset<0){streakMonthOffset++;renderStreak();}}

function calcStreak(){
  const diasAtivos=new Set(planoFeitos);
  const today=todayLocal();
  const yesterday=dateToLocal(new Date(new Date().setDate(new Date().getDate()-1)));

  // Tenta streak a partir de hoje
  let cur=new Date(today);
  let streak=0;
  while(true){
    const k=dateToLocal(cur);
    if(diasAtivos.has(k)){streak++;cur.setDate(cur.getDate()-1);}
    else break;
  }

  // Se hoje não foi marcado, mostra streak de ontem para não desanimar
  let streakOntem=0;
  let alerteHoje=false;
  if(streak===0 && diasAtivos.has(yesterday)){
    let c2=new Date(yesterday);
    while(true){
      const k=dateToLocal(c2);
      if(diasAtivos.has(k)){streakOntem++;c2.setDate(c2.getDate()-1);}
      else break;
    }
    alerteHoje=true;
  }

  const sorted=[...diasAtivos].sort();
  let maxStreak=0,tempStreak=0,prevDate=null;
  sorted.forEach(d=>{
    if(prevDate){
      const prev=new Date(prevDate);prev.setDate(prev.getDate()+1);
      if(dateToLocal(prev)===d) tempStreak++;
      else tempStreak=1;
    } else tempStreak=1;
    if(tempStreak>maxStreak) maxStreak=tempStreak;
    prevDate=d;
  });
  const record=Math.max(maxStreak,streak,streakOntem);
  return{streak:streak||streakOntem, record, diasAtivos, alerteHoje};
}

function renderStreak(){
  const{streak,record,diasAtivos,alerteHoje}=calcStreak();
  document.getElementById('streak-num').textContent=streak;
  document.getElementById('streak-record').textContent=record+' dias';

  // Alerta se hoje ainda não foi marcado mas ontem foi
  const alertEl=document.getElementById('streak-alerta');
  if(alertEl){
    if(alerteHoje){
      alertEl.style.display='block';
      alertEl.innerHTML='⚡ Marque o dia de hoje no Plano para manter seu streak!';
    } else {
      alertEl.style.display='none';
    }
  }

  const today=new Date();
  const ref=new Date(today.getFullYear(),today.getMonth()+streakMonthOffset,1);
  const year=ref.getFullYear();
  const month=ref.getMonth();
  const MESES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  document.getElementById('streak-month-label').textContent=MESES[month]+' '+year;
  // Seta › só aparece se não for o mês atual
  const nextBtn=document.getElementById('streak-next-btn');
  if(nextBtn) nextBtn.style.visibility=streakMonthOffset<0?'visible':'hidden';

  const daysInMonth=new Date(year,month+1,0).getDate();
  const todayStr=todayLocal();
  const cal=document.getElementById('streak-calendar');

  let html='';
  for(let d=1;d<=daysInMonth;d++){
    const dateStr=year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const isActive=diasAtivos.has(dateStr);
    const isToday=dateStr===todayStr;
    const isFuture=dateStr>todayStr;
    let cls='streak-day';
    if(isFuture) cls+=' future';
    else if(isActive) cls+=' active';
    else cls+=' inactive';
    if(isToday) cls+=' today';
    html+='<div class="'+cls+'" title="'+fmtDate(dateStr)+'">'+d+'</div>';
  }
  cal.innerHTML=html;
}

// ═══════════════════════════════════════
//  METAS NO DASHBOARD
// ═══════════════════════════════════════
function renderDashMetas(){
  const wrap=document.getElementById('dash-metas-wrap');
  const grid=document.getElementById('dash-metas');
  if(!goals.weekly_hours&&!goals.weekly_sessions&&!goals.weekly_questions){wrap.style.display='none';return;}

  const now=new Date();
  const startW=new Date(now);startW.setDate(now.getDate()-now.getDay());startW.setHours(0,0,0,0);
  const weekSess=sessions.filter(s=>{const d=new Date(s.data+'T12:00');return d>=startW;});
  const wMin=weekSess.reduce((a,s)=>a+(s.minutos||0),0);
  const wSess=weekSess.length;
  const wQ=weekSess.reduce((a,s)=>a+s.acertos+s.erros,0);

  const items=[
    {label:'Horas estudadas',cur:Math.round(wMin/60*10)/10,meta:goals.weekly_hours,unit:'h',tip:'Horas de estudo acumuladas nesta semana'},
    {label:'Sessões realizadas',cur:wSess,meta:goals.weekly_sessions,unit:'',tip:'Uma sessão = cada vez que você lança um estudo'},
    {label:'Questões resolvidas',cur:wQ,meta:goals.weekly_questions,unit:'',tip:'Total de questões certas + erradas desta semana'}
  ].filter(x=>x.meta>0);

  wrap.style.display='block';
  grid.innerHTML=items.map(x=>{
    const pct=Math.min(100,Math.round(x.cur/x.meta*100));
    const col=pct>=100?'var(--success)':pct>=60?'var(--warning)':'var(--accent)';
    return '<div class="dash-meta-card" data-tip="'+x.tip+'">'
      +'<div class="dash-meta-top"><span class="dash-meta-label">'+x.label+'</span><span class="dash-meta-pct">'+pct+'%</span></div>'
      +'<div class="dash-meta-track"><div class="dash-meta-fill" style="width:'+pct+'%;background:'+col+'"></div></div>'
      +'<div class="dash-meta-sub">'+x.cur+x.unit+' de '+x.meta+x.unit+'</div>'
      +'</div>';
  }).join('');
}


function renderDashboard(){
  // Sincroniza plano com sessões antes de qualquer render
  sincronizarPlanoComSessoes();

  const ativas=sessions.filter(s=>!s.archived);
  const total=ativas.length;
  const totalQSess=ativas.reduce((a,s)=>a+s.acertos+s.erros,0);
  const totalASess=ativas.reduce((a,s)=>a+s.acertos,0);
  const totalMin=ativas.reduce((a,s)=>a+(s.minutos||0),0);
  // Soma questões dos simulados
  const totalQSim=simHistorico.reduce((a,s)=>a+(s.total||0),0);
  const totalASim=simHistorico.reduce((a,s)=>a+(s.acertos||0),0);
  const totalQ=totalQSess+totalQSim;
  const totalA=totalASess+totalASim;
  const pct=totalQ>0?Math.round(totalA/totalQ*100)+'%':'—';
  document.getElementById('st-sess').textContent=total;
  document.getElementById('st-q').textContent=totalQ;
  document.getElementById('st-pct').textContent=pct;
  const horas=Math.floor(totalMin/60);
  const mins=totalMin%60;
  document.getElementById('st-min').textContent=horas>0?(horas+'h'+(mins>0?mins+'m':'')):(totalMin+'min');
  // st-sem removido
  renderStreak();
  renderDashMetas();
  renderProgressMat();renderTagsDash();renderChartTempo();renderChartMateria();
  renderAnalytics();renderRevisoes();renderRecado();atualizarRevDash();
  // Card simulados no dash
  if(simHistorico&&simHistorico.length){
    const card=document.getElementById('sim-dash-card');
    if(card) card.style.display='block';
    renderSimDash();
  }
  verificarConquistas(true);
}

function renderProgressMat(){
  document.getElementById('progress-list').innerHTML=MATS.map(m=>{
    const sess=sessions.filter(s=>s.materia===m);
    const a=sess.reduce((t,s)=>t+s.acertos,0);const e=sess.reduce((t,s)=>t+s.erros,0);const tot=a+e;
    const pct=tot>0?Math.round(a/tot*100):0;const col=MCOLOR[m]||'#888';
    return`<div class="progress-wrap">
      <div class="progress-header"><span style="color:${col};font-weight:500;font-size:12px">${m}</span><span>${tot>0?pct+'% ('+a+'/'+tot+')':'Sem dados'}</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${col}"></div></div>
    </div>`;
  }).join('');
}

const GRID={color:'rgba(168,85,247,0.1)'};const TICK={color:'#9B8EC4',font:{size:10}};
function mkChart(id,config){if(charts[id])charts[id].destroy();const ctx=document.getElementById(id);if(!ctx)return;charts[id]=new Chart(ctx,config);}

function renderChartTempo(){
  const data=MATS.map(m=>sessions.filter(s=>s.materia===m).reduce((t,s)=>t+(s.minutos||0),0));
  const total=data.reduce((a,b)=>a+b,0);const hasData=total>0;
  document.getElementById('empty-tempo').style.display=hasData?'none':'flex';
  document.getElementById('chart-tempo-inner').style.display=hasData?'block':'none';
  if(!hasData){if(charts['chartTempo']){charts['chartTempo'].destroy();delete charts['chartTempo'];}return;}
  const colors=MATS.map(m=>MCOLOR[m]);
  const tempoTooltip = function(ctx) { return ' '+ctx.label+': '+ctx.parsed+'min ('+Math.round(ctx.parsed/total*100)+'%)'; };
  mkChart('chartTempo',{type:'doughnut',data:{labels:MATS,datasets:[{data,backgroundColor:colors.map(c=>c+'CC'),borderColor:colors,borderWidth:2,hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{callbacks:{label:tempoTooltip}}}}});
  document.getElementById('donut-center').innerHTML='<div class="donut-total">'+total+'</div><div class="donut-sub">minutos</div>';
  document.getElementById('tempo-legend').innerHTML=MATS.map((m,i)=>data[i]>0?'<div class="legend-row"><div class="legend-dot" style="background:'+MCOLOR[m]+'"></div><span class="legend-name">'+m.split(' ')[0]+'</span><span class="legend-val">'+data[i]+'min · '+Math.round(data[i]/total*100)+'%</span></div>':'').join('');
}

function renderChartMateria(){
  const hasData=sessions.some(s=>s.acertos+s.erros>0);
  document.getElementById('empty-mat').style.display=hasData?'none':'flex';
  document.getElementById('chart-mat-inner').style.display=hasData?'block':'none';
  if(!hasData)return;
  document.getElementById('mat-bars').innerHTML=MATS.map(m=>{
    const sess=sessions.filter(s=>s.materia===m);const a=sess.reduce((t,s)=>t+s.acertos,0);const e=sess.reduce((t,s)=>t+s.erros,0);const tot=a+e;
    if(tot===0)return'';const pct=Math.round(a/tot*100);const col=MCOLOR[m];
    return`<div class="hbar-row"><div class="hbar-label"><span class="hbar-name">${m}</span><span class="hbar-pct">${pct}% · ${a}✓ ${e}✗</span></div>
    <div class="hbar-track"><div class="hbar-acerto" style="width:${pct}%;background:${col}">${pct>=20?`<span class="hbar-acerto-txt">${pct}%</span>`:''}</div></div></div>`;
  }).join('');
}

function parseLocalDate(str){
  // Evita bug UTC: '2026-06-22' virar 21/06 em UTC-3
  const [y,m,d]=str.split('-').map(Number);
  return new Date(y,m-1,d);
}

function renderChartEvolucao(){
  const byW={};
  sessions.filter(s=>!s.archived).forEach(s=>{
    const d=parseLocalDate(s.data);
    // Usa segunda-feira como início da semana (getDay(): 0=dom,1=seg...6=sáb)
    const day=d.getDay();
    const diff=day===0?-6:1-day; // recua até segunda
    d.setDate(d.getDate()+diff);
    const w=pad(d.getDate())+'/'+pad(d.getMonth()+1);
    if(!byW[w])byW[w]={a:0,e:0};
    byW[w].a+=s.acertos;byW[w].e+=s.erros;
  });
  const labels=Object.keys(byW).sort((a,b)=>{
    const [da,ma]=a.split('/').map(Number);
    const [db,mb]=b.split('/').map(Number);
    return ma!==mb?ma-mb:da-db;
  });
  const hasData=labels.length>=1&&sessions.some(s=>s.acertos+s.erros>0);
  document.getElementById('empty-ev').style.display=hasData?'none':'flex';
  document.getElementById('chart-ev-inner').style.display=hasData?'block':'none';
  if(!hasData){if(charts['chartEvolucao']){charts['chartEvolucao'].destroy();delete charts['chartEvolucao'];}return;}
  const pcts=labels.map(w=>{const t=byW[w].a+byW[w].e;return t>0?Math.round(byW[w].a/t*100):0;});
  mkChart('chartEvolucao',{type:'line',data:{labels,datasets:[{label:'% Acertos',data:pcts,borderColor:'#A855F7',backgroundColor:'rgba(168,85,247,0.12)',tension:.4,fill:true,pointBackgroundColor:'#C084FC',pointRadius:6,pointHoverRadius:8,borderWidth:2.5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' '+ctx.parsed.y+'% de acertos'}}},scales:{x:{ticks:TICK,grid:GRID},y:{min:0,max:100,ticks:{...TICK,stepSize:25,callback:v=>v+'%'},grid:GRID}}}});
}

// ═══════════════════════════════════════
//  TAGS NO DASHBOARD
// ═══════════════════════════════════════
function renderTagsDash(){
  const wrap=document.getElementById('tags-dash');
  if(!wrap) return;
  const ativas=sessions.filter(s=>!s.archived&&s.tags&&s.tags.length);
  if(!ativas.length){wrap.innerHTML='<p style="color:var(--text-dim);font-size:12px">Nenhuma tag registrada ainda.</p>';return;}
  const count={};
  ativas.forEach(s=>s.tags.forEach(t=>{count[t]=(count[t]||0)+1;}));
  const sorted=Object.entries(count).sort((a,b)=>b[1]-a[1]);
  const total=sorted.reduce((s,e)=>s+e[1],0);
  wrap.innerHTML=sorted.map(([tag,n])=>{
    const pct=Math.round(n/total*100);
    const EMOJI={'teoria':'📖','questões':'❓','revisão':'🔁','simulado':'📝','leitura':'📚','resumo':'✍️','prova':'🎯','reforço':'💪'};
    const em=EMOJI[tag]||'✦';
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'
      +'<span style="font-size:11px;min-width:90px;color:var(--text-primary)">'+em+' '+tag+'</span>'
      +'<div style="flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden">'
        +'<div style="height:100%;width:'+pct+'%;background:var(--accent);border-radius:99px"></div>'
      +'</div>'
      +'<span style="font-size:10px;color:var(--text-secondary);min-width:30px;text-align:right">'+n+'×</span>'
    +'</div>';
  }).join('');
}

// ═══════════════════════════════════════
//  CELEBRAÇÃO — CHUVA DE ESTRELAS
// ═══════════════════════════════════════
function celebrar(){
  // Overlay escuro que bloqueia o fundo
  const overlay=document.createElement('div');
  overlay.style.cssText=`
    position:fixed;inset:0;z-index:9999;
    background:rgba(7,4,26,0.85);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;backdrop-filter:blur(3px);
    animation:celebOverlayIn .4s ease forwards;
  `;
  overlay.onclick=()=>overlay.remove();
  document.body.appendChild(overlay);

  // Canvas de estrelas
  const canvas=document.createElement('canvas');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  canvas.style.cssText='position:absolute;inset:0;pointer-events:none';
  overlay.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  // Mensagem central
  const msg=document.createElement('div');
  msg.style.cssText=`
    position:relative;z-index:2;text-align:center;
    animation:celebMsgIn .6s cubic-bezier(.34,1.56,.64,1) forwards;
    padding:2rem 2.5rem;
    background:rgba(26,10,62,0.7);
    border:1px solid rgba(192,132,252,0.4);
    border-radius:20px;
    backdrop-filter:blur(20px);
    box-shadow:0 0 60px rgba(168,85,247,0.3), 0 0 120px rgba(168,85,247,0.1);
    max-width:90vw;
  `;
  msg.innerHTML=`
    <div style="font-size:3.5rem;margin-bottom:.75rem;animation:celebEmoji 1s ease infinite alternate">🔥</div>
    <div style="font-family:'Playfair Display',serif;font-size:clamp(2rem,6vw,3.5rem);font-weight:700;
      background:linear-gradient(135deg,#F0E8FF,#C084FC,#A855F7);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      line-height:1.2;margin-bottom:.5rem">
      Parabéns, Luísa!
    </div>
    <div style="font-size:clamp(1rem,3vw,1.4rem);color:#C084FC;letter-spacing:1px;margin-bottom:.5rem">
      Você bateu sua meta hoje! ✦
    </div>
    <div style="font-size:.85rem;color:rgba(155,142,196,0.7);margin-top:1rem">Toque para fechar</div>
  `;
  overlay.appendChild(msg);

  // CSS das animações
  if(!document.getElementById('celebStyle')){
    const s=document.createElement('style');
    s.id='celebStyle';
    s.textContent=`
      @keyframes celebOverlayIn{from{opacity:0}to{opacity:1}}
      @keyframes celebMsgIn{from{opacity:0;transform:scale(.7) translateY(30px)}to{opacity:1;transform:scale(1) translateY(0)}}
      @keyframes celebEmoji{from{transform:scale(1) rotate(-5deg)}to{transform:scale(1.15) rotate(5deg)}}
    `;
    document.head.appendChild(s);
  }

  // Estrelas cadentes — muitas, coloridas, de todos os lados
  const stars=[];
  const colors=['#C084FC','#E9D5FF','#FBBF24','#F0E8FF','#A855F7','#67E8F9','#4ADE80'];

  function spawnStar(){
    const fromTop=Math.random()>.3;
    stars.push({
      x: fromTop ? Math.random()*canvas.width : (Math.random()>.5?-20:canvas.width+20),
      y: fromTop ? -20 : Math.random()*canvas.height*.5,
      vx: (Math.random()*5+3)*(Math.random()>.5?1:-1),
      vy: Math.random()*4+2,
      len: Math.random()*140+80,
      life: 1,
      decay: Math.random()*.008+.006,
      color: colors[Math.floor(Math.random()*colors.length)],
      width: Math.random()*2+1
    });
  }

  // Spawn inicial em rajada
  for(let i=0;i<80;i++) setTimeout(spawnStar, i*40);

  let frame;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=stars.length-1;i>=0;i--){
      const s=stars[i];
      s.x+=s.vx; s.y+=s.vy; s.life-=s.decay;
      if(s.life<=0||s.y>canvas.height+50){stars.splice(i,1);continue;}
      const tail=s.len/4;
      const g=ctx.createLinearGradient(s.x,s.y,s.x-s.vx*tail,s.y-s.vy*tail);
      // Converte hex para rgba
      const r=parseInt(s.color.slice(1,3),16);
      const gv=parseInt(s.color.slice(3,5),16);
      const b=parseInt(s.color.slice(5,7),16);
      g.addColorStop(0,`rgba(${r},${gv},${b},${s.life})`);
      g.addColorStop(1,`rgba(${r},${gv},${b},0)`);
      ctx.beginPath();
      ctx.moveTo(s.x,s.y);
      ctx.lineTo(s.x-s.vx*tail,s.y-s.vy*tail);
      ctx.strokeStyle=g;
      ctx.lineWidth=s.width;
      ctx.lineCap='round';
      ctx.stroke();
      // Brilho na ponta
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.width*1.2,0,Math.PI*2);
      ctx.fillStyle=`rgba(${r},${gv},${b},${s.life*.8})`;
      ctx.fill();
    }
    if(document.body.contains(overlay)) frame=requestAnimationFrame(draw);
  }
  draw();

  // Remove automaticamente após 7 segundos
  setTimeout(()=>{
    if(document.body.contains(overlay)){
      overlay.style.animation='celebOverlayIn .5s ease reverse forwards';
      setTimeout(()=>{overlay.remove();cancelAnimationFrame(frame);},500);
    }
  },7000);
}

// ═══════════════════════════════════════
//  RENDER ALL
// ═══════════════════════════════════════
function renderAll(){
  const mudou=sincronizarPlanoComSessoes();
  renderDashboard();
  renderHistorico();
  renderRevisoes();
  renderMetas();
  // Se houve sincronização, re-renderiza streak e contador com dados atualizados
  if(mudou){
    // st-sem removido
    renderStreak();
    verificarConquistas(true);
  }
}

// ═══════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════

// ═══════════════════════════════════════
//  INIT
// ═══════════════════════════════════════
// ═══════════════════════════════════════
//  MODAL BOAS-VINDAS
// ═══════════════════════════════════════
function bvMostrar(){
  // Gera estrelinhas
  const bg = document.getElementById('bv-stars');
  if(bg && !bg.children.length){
    for(let i=0;i<20;i++){
      const s=document.createElement('div');
      s.className='bv-star';
      s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${.1+Math.random()*.6};animation-delay:${Math.random()*2}s;animation-duration:${1.5+Math.random()*2}s`;
      bg.appendChild(s);
    }
  }
  // Adapta texto se já tem chave no banco
  if(perfilData.chave){
    const nome = perfilData.nome ? perfilData.nome.split(' ')[0] : '';
    document.getElementById('bv-title').textContent = nome ? `Olá, ${nome}! 👋` : 'Bem-vinda de volta! 👋';
    document.getElementById('bv-sub').innerHTML = 'Digite sua palavra-chave para carregar seus dados.';
  } else {
    document.getElementById('bv-title').textContent = 'Bem-vinda ao Luia! ✨';
    document.getElementById('bv-sub').innerHTML = 'Sua plataforma de estudos para o IFPE 2027.<br>Digite sua palavra-chave para entrar.';
  }
  document.getElementById('bv-overlay').style.display='flex';
  setTimeout(()=>document.getElementById('bv-input').focus(),200);
}

function bvFechar(){
  document.getElementById('bv-overlay').style.display='none';
}

async function bvEntrar(){
  const inp = document.getElementById('bv-input');
  const err = document.getElementById('bv-error');
  const chave = inp.value.trim();
  if(!chave){ err.textContent='Digite sua palavra-chave.'; err.style.display='block'; return; }
  err.style.display='none';

  // Busca no Supabase pelo access_key
  try{
    const rows = await sbGet('study_goals','access_key=eq.'+encodeURIComponent(chave));
    if(!rows || !rows.length){
      // Chave não existe — pode ser primeira vez, aceita se não há chave cadastrada
      if(!perfilData.chave){
        // Sem chave ainda no banco — deixa entrar e vai pro perfil criar
        authDesbloqueado=true;
        bvFechar();
        showToast('Crie sua palavra-chave no Perfil para proteger seus dados! 🔐','info');
        return;
      }
      err.textContent='Palavra-chave incorreta. Tente novamente.';
      err.style.display='block';
      inp.value='';
      inp.focus();
      return;
    }
    // Chave correta — carrega tudo
    const row = rows[0];
    perfilData.chave = row.access_key;
    if(row.access_pergunta) perfilData.pergunta = row.access_pergunta;
    if(row.access_resposta) perfilData.resposta = row.access_resposta;
    if(row.perfil_json){
      const pj = row.perfil_json;
      Object.assign(perfilData, pj);
    }
    localStorage.setItem('luia_perfil', JSON.stringify(perfilData));
    authDesbloqueado = true;
    const _exp=Date.now()+24*60*60*1000;localStorage.setItem('luia_auth_exp',_exp);
    setTimeout(()=>{authDesbloqueado=false;localStorage.removeItem('luia_auth_exp');},24*60*60*1000);
    bvFechar();
    await loadFromSupabase();
    // Atualiza avatar e sidebar com dados do banco
    if(typeof atualizarSidebar==='function') atualizarSidebar();
    if(typeof renderDashboard==='function') renderDashboard();
    // Restaura aba anterior após login
    const _abaLogin=sessionStorage.getItem('luia_aba')||'dashboard';
    const _abasAuthLogin=['sobre','perfil'];
    setTimeout(()=>showLuia(_abasAuthLogin.includes(_abaLogin)?'dashboard':_abaLogin,null),200);
    showToast('Bem-vinda de volta' + (perfilData.nome?' , '+perfilData.nome.split(' ')[0]:'')+'! ✦','success');
  } catch(e){
    err.textContent='Erro de conexão. Tente novamente.';
    err.style.display='block';
  }
}

function bvVisitante(){
  bvFechar();
  showToast('Modo visitante — dados não serão salvos.','info');
}

async function init(){
  const savedTheme=localStorage.getItem('luisa_theme')||'dark';
  document.documentElement.setAttribute('data-theme',savedTheme);
  document.querySelectorAll('.theme-btn').forEach(b=>{if((b.textContent==='🌙'&&savedTheme==='dark')||(b.textContent==='☀️'&&savedTheme==='light'))b.classList.add('active');else b.classList.remove('active');});
  initStars();
  renderCronograma();
  document.getElementById('f-data').value=todayLocal();
  // Carrega dados do Supabase primeiro (pega chave e perfil se existirem)
  await loadFromSupabase();
  // Mostra modal de boas-vindas — só pula se já estava autenticado nessa sessão
  if(!authDesbloqueado){
    bvMostrar();
  } else {
    // Auth válida — restaura aba e atualiza avatar
    if(typeof atualizarSidebar==='function') atualizarSidebar();
    if(typeof renderDashboard==='function') renderDashboard();
    const _aba=sessionStorage.getItem('luia_aba')||'dashboard';
    const _abasAuth=['sobre','perfil'];
    setTimeout(()=>showLuia(_abasAuth.includes(_aba)?'dashboard':_aba,null),100);
  }
}
// ═══════════════════════════════════════
//  LUIA — SIDEBAR & WELCOME
// ═══════════════════════════════════════
function showLuia(id, btn){
  // Abas protegidas — qualquer aba exceto dashboard requer chave definida
  // Abas totalmente bloqueadas para visitante
  const ABAS_BLOQUEADAS = ['sobre','perfil'];
  if(ABAS_BLOQUEADAS.includes(id)){
    if(!authDesbloqueado){
      if(!perfilData.chave){ bvMostrar(); }
      else { comAuth(()=>showLuia(id,btn)); }
      return;
    }
  }

  // Salva aba atual para sobreviver ao refresh
  sessionStorage.setItem('luia_aba', id);

  document.querySelectorAll('.luia-nav-item').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  else {
    // Ativa o botão correto na sidebar
    document.querySelectorAll('.luia-nav-item').forEach(b=>{
      if(b.getAttribute('onclick')&&b.getAttribute('onclick').includes("'"+id+"'")) b.classList.add('active');
    });
  }
  fecharSidebar();
  if(['progresso','sobre','perfil','simulados','feedback'].includes(id)){
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    const sec=document.getElementById('sec-'+id);
    if(sec) sec.classList.add('active');
    if(id==='progresso') renderProgresso();
    if(id==='sobre') renderSobreMim();
    if(id==='perfil') setTimeout(carregarPerfil,100);
    if(id==='simulados'){renderSimHistorico();renderSimFavoritas();}
    if(id==='feedback'){renderFeedbacks();}
    return;
  }
  showSection(id, null, false);
}

function updateWelcome(){
  const prova=new Date('2026-12-20');
  const diff=Math.ceil((prova-new Date())/(1000*60*60*24));
  const sub=document.getElementById('welcome-sub');
  const cd=document.getElementById('welcome-countdown');
  if(!sub) return;
  const ativas=(sessions||[]).filter(s=>!s.archived);
  if(ativas.length>0){
    const totalQ=ativas.reduce((a,s)=>a+s.acertos+s.erros,0);
    const totalA=ativas.reduce((a,s)=>a+s.acertos,0);
    const pct=totalQ>0?Math.round(totalA/totalQ*100):0;
    sub.textContent='Você tem '+ativas.length+' registro'+(ativas.length>1?'s':'')+', '+pct+'% de acertos e '+diff+' dias para a prova. Bora!';
  } else {
    sub.textContent='Faltam '+diff+' dias para o IFPE 2027. Vamos começar!';
  }
  // Remove o pill duplicado
  if(cd) cd.style.display='none';
}

// Sidebar mobile
function abrirSidebar(){
  const sb=document.getElementById('luia-sidebar');
  const main=document.querySelector('.luia-main');
  const isMobile=window.innerWidth<=768;
  if(isMobile){
    sb.classList.add('open');
    const ov=document.getElementById('sidebar-overlay');
    if(ov) ov.style.display='block';
  } else {
    // Desktop: toggle collapse
    sb.classList.toggle('collapsed');
    if(main) main.classList.toggle('expanded');
  }
}
function fecharSidebar(){
  const sb=document.getElementById('luia-sidebar');
  const isMobile=window.innerWidth<=768;
  if(isMobile){
    sb.classList.remove('open');
    const ov=document.getElementById('sidebar-overlay');
    if(ov) ov.style.display='none';
  }
}

// Hook renderDashboard
(function(){
  const _orig=renderDashboard;
  renderDashboard=function(){
    _orig();
    if(typeof updateWelcome==='function') updateWelcome();
    if(typeof atualizarRevBadge==='function') atualizarRevBadge();
  };
})();

// ═══════════════════════════════════════
//  PERFIL & AUTENTICAÇÃO POR PALAVRA-CHAVE
// ═══════════════════════════════════════
let perfilData=JSON.parse(localStorage.getItem('luia_perfil')||'{}');
let authDesbloqueado=false;
// Restaura auth se ainda válida (24h)
(function(){
  const exp=parseInt(localStorage.getItem('luia_auth_exp')||'0');
  if(exp>Date.now()){
    authDesbloqueado=true;
    setTimeout(()=>{authDesbloqueado=false;localStorage.removeItem('luia_auth_exp');},exp-Date.now());
  }
})();
let authCallback=null;

function atualizarBanner(){
  const banner=document.getElementById('chave-banner');
  if(!banner) return;
  // Mostra se não tem palavra-chave, esconde se tem
  banner.style.display=perfilData.chave?'none':'flex';
}

function carregarPerfil(){
  atualizarBanner();
  const p=perfilData;
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v||'';};
  set('perfil-nome',p.nome); set('perfil-apelido',p.apelido);
  set('perfil-idade',p.idade); set('perfil-musica',p.musica);
  set('perfil-cor',p.cor); set('perfil-sonho',p.sonho);
  set('perfil-motivacao',p.motivacao);
  if(document.getElementById('perfil-signo')&&p.signo) document.getElementById('perfil-signo').value=p.signo;
  atualizarStatusChave();
  atualizarSidebar();
}

function atualizarSidebar(){
  const p=perfilData;
  const apelido=p.apelido||p.nome?.split(' ')[0]||'Luísa';
  const inicial=(apelido[0]||'L').toUpperCase();
  const svgContent=p.avatarSvg||'';

  // Hero avatar
  const heroAv=document.getElementById('hero-avatar');
  if(heroAv) heroAv.innerHTML=svgContent||inicial;

  // Preview no perfil
  const fp=document.getElementById('perfil-foto-preview');
  if(fp) fp.innerHTML=svgContent||inicial;

  // Sobre mim
  const sf=document.getElementById('sobre-foto');
  if(sf) sf.innerHTML=svgContent||inicial;

  // Displays do perfil
  const nd=document.getElementById('perfil-nome-display');
  if(nd) nd.textContent=apelido;
  const ad=document.getElementById('perfil-apelido-display');
  if(ad) ad.textContent=(p.signo?p.signo+' · ':'')+' IFPE 2027';

  // Welcome hero greeting
  const g=document.querySelector('.luia-hero-greeting');
  if(g) g.innerHTML='Bem-vinda, <em>'+apelido+'!</em> 👋';
}

function atualizarStatusChave(){
  const el=document.getElementById('chave-status');
  if(!el) return;
  el.innerHTML=perfilData.chave
    ?'<span class="chave-status chave-ok">🔒 Palavra-chave definida</span>'
    :'<span class="chave-status chave-nok">⚠️ Sem palavra-chave — qualquer pessoa pode editar</span>';
}

// ── AVATARES SVG ──
const AVATARES=[
  {id:'gatinho',label:'Gatinho',svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#1E1B4B"/><ellipse cx="40" cy="46" rx="22" ry="18" fill="#A78BFA"/><ellipse cx="40" cy="44" rx="19" ry="16" fill="#C4B5FD"/><circle cx="40" cy="36" r="14" fill="#A78BFA"/><polygon points="26,26 20,14 32,22" fill="#A78BFA"/><polygon points="54,26 60,14 48,22" fill="#A78BFA"/><circle cx="33" cy="34" r="4" fill="#1E1B4B"/><circle cx="47" cy="34" r="4" fill="#1E1B4B"/><circle cx="34" cy="33" r="1.5" fill="white"/><circle cx="48" cy="33" r="1.5" fill="white"/><ellipse cx="40" cy="39" rx="3" ry="2" fill="#F9A8D4"/><line x1="28" y1="38" x2="18" y2="36" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/><line x1="28" y1="40" x2="17" y2="40" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/><line x1="28" y1="42" x2="18" y2="44" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/><line x1="52" y1="38" x2="62" y2="36" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/><line x1="52" y1="40" x2="63" y2="40" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/><line x1="52" y1="42" x2="62" y2="44" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/></svg>`},
  {id:'astronauta',label:'Astronauta',svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#0F172A"/><circle cx="40" cy="38" r="20" fill="#E2E8F0"/><circle cx="40" cy="38" r="16" fill="#1E293B"/><circle cx="40" cy="38" r="13" fill="#38BDF8" opacity=".3"/><circle cx="36" cy="35" r="3" fill="white" opacity=".8"/><rect x="25" y="52" width="30" height="12" rx="6" fill="#E2E8F0"/><rect x="20" y="42" width="8" height="18" rx="4" fill="#CBD5E1"/><rect x="52" y="42" width="8" height="18" rx="4" fill="#CBD5E1"/><circle cx="40" cy="14" r="3" fill="#F59E0B"/><circle cx="55" cy="20" r="2" fill="#A78BFA"/><circle cx="24" cy="22" r="1.5" fill="white" opacity=".6"/><path d="M50 65 Q40 72 30 65" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`},
  {id:'lua',label:'Lua',svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#0F172A"/><path d="M50 20 A22 22 0 1 0 50 60 A14 14 0 1 1 50 20Z" fill="#FCD34D"/><circle cx="34" cy="32" r="3" fill="#F59E0B" opacity=".5"/><circle cx="42" cy="50" r="2" fill="#F59E0B" opacity=".4"/><circle cx="30" cy="48" r="1.5" fill="#F59E0B" opacity=".3"/><circle cx="18" cy="18" r="2" fill="white" opacity=".8"/><circle cx="62" cy="24" r="1.5" fill="white" opacity=".6"/><circle cx="65" cy="55" r="2" fill="white" opacity=".7"/><circle cx="15" cy="55" r="1" fill="white" opacity=".5"/><circle cx="55" cy="65" r="1.5" fill="#A78BFA" opacity=".8"/><path d="M14 40 L18 38 L14 36" stroke="#A78BFA" stroke-width="1" fill="none" opacity=".4"/></svg>`},
  {id:'estrela',label:'Estrela',svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#1E1B4B"/><path d="M40 12 L45 30 L64 30 L49 41 L55 59 L40 48 L25 59 L31 41 L16 30 L35 30 Z" fill="#F59E0B"/><circle cx="40" cy="40" r="8" fill="#FCD34D"/><circle cx="20" cy="20" r="2" fill="white" opacity=".6"/><circle cx="60" cy="15" r="1.5" fill="white" opacity=".5"/><circle cx="65" cy="60" r="2" fill="#A78BFA" opacity=".7"/><circle cx="15" cy="58" r="1.5" fill="white" opacity=".4"/><circle cx="58" cy="65" r="1" fill="#FCD34D" opacity=".6"/></svg>`},
  {id:'foguete',label:'Foguete',svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#0F172A"/><path d="M40 10 C40 10 28 24 28 42 L52 42 C52 24 40 10 40 10Z" fill="#A78BFA"/><rect x="32" y="40" width="16" height="16" rx="2" fill="#8B5CF6"/><circle cx="40" cy="36" r="6" fill="#38BDF8" opacity=".8"/><path d="M28 50 L20 60 L32 54Z" fill="#7C3AED" opacity=".8"/><path d="M52 50 L60 60 L48 54Z" fill="#7C3AED" opacity=".8"/><ellipse cx="40" cy="57" rx="8" ry="5" fill="#F59E0B" opacity=".7"/><ellipse cx="40" cy="60" rx="5" ry="4" fill="#EF4444" opacity=".6"/><circle cx="20" cy="20" r="1.5" fill="white" opacity=".5"/><circle cx="60" cy="25" r="2" fill="white" opacity=".6"/><circle cx="65" cy="55" r="1" fill="#A78BFA" opacity=".7"/></svg>`},
  {id:'flor',label:'Florzinha',svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#1E1B4B"/><ellipse cx="40" cy="26" rx="7" ry="11" fill="#F9A8D4"/><ellipse cx="40" cy="54" rx="7" ry="11" fill="#F9A8D4"/><ellipse cx="26" cy="40" rx="11" ry="7" fill="#C084FC"/><ellipse cx="54" cy="40" rx="11" ry="7" fill="#C084FC"/><ellipse cx="29" cy="29" rx="7" ry="11" transform="rotate(45 29 29)" fill="#FDA4AF"/><ellipse cx="51" cy="29" rx="7" ry="11" transform="rotate(-45 51 29)" fill="#FDA4AF"/><ellipse cx="29" cy="51" rx="7" ry="11" transform="rotate(-45 29 51)" fill="#FDA4AF"/><ellipse cx="51" cy="51" rx="7" ry="11" transform="rotate(45 51 51)" fill="#FDA4AF"/><circle cx="40" cy="40" r="10" fill="#FCD34D"/><circle cx="40" cy="40" r="6" fill="#F59E0B"/></svg>`},
  {id:'planeta',label:'Planeta',svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#0F172A"/><ellipse cx="40" cy="40" rx="38" ry="10" fill="none" stroke="#A78BFA" stroke-width="2" opacity=".4" transform="rotate(-20 40 40)"/><circle cx="40" cy="40" r="18" fill="#6D28D9"/><circle cx="40" cy="40" r="16" fill="#7C3AED"/><ellipse cx="35" cy="35" rx="8" ry="5" fill="#8B5CF6" opacity=".6" transform="rotate(-20 35 35)"/><ellipse cx="45" cy="46" rx="6" ry="3" fill="#4C1D95" opacity=".8"/><circle cx="18" cy="18" r="2" fill="white" opacity=".7"/><circle cx="62" cy="22" r="1.5" fill="white" opacity=".5"/><circle cx="65" cy="58" r="2" fill="#A78BFA" opacity=".6"/><circle cx="14" cy="56" r="1" fill="white" opacity=".4"/></svg>`},
  {id:'coracao',label:'Coração',svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="#1E1B4B"/><path d="M40 58 C40 58 18 46 18 32 C18 24 24 18 32 18 C36 18 40 22 40 22 C40 22 44 18 48 18 C56 18 62 24 62 32 C62 46 40 58 40 58Z" fill="#F43F5E"/><path d="M40 52 C40 52 22 42 22 32 C22 26 27 22 32 22 C36 22 40 26 40 26" fill="#FB7185" opacity=".5"/><circle cx="20" cy="20" r="1.5" fill="white" opacity=".5"/><circle cx="60" cy="18" r="2" fill="white" opacity=".6"/><circle cx="63" cy="58" r="1.5" fill="#A78BFA" opacity=".7"/><path d="M34 36 L38 40 L46 30" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/></svg>`},
];

function toggleAvatarPicker(){
  const picker=document.getElementById('perfil-avatar-picker');
  const grid=document.getElementById('avatar-grid');
  if(picker.style.display==='none'){
    // Renderiza grid de avatares
    grid.innerHTML=AVATARES.map(a=>`
      <div class="avatar-option${perfilData.avatarId===a.id?' selecionado':''}" onclick="selecionarAvatar('${a.id}')">
        ${a.svg}
        <div class="avatar-option-label">${a.label}</div>
      </div>`).join('');
    picker.style.display='block';
  } else {
    picker.style.display='none';
  }
}

function fecharAvatarPicker(){
  document.getElementById('perfil-avatar-picker').style.display='none';
}

function selecionarAvatar(id){
  const av=AVATARES.find(a=>a.id===id);
  if(!av) return;
  perfilData.avatarId=id;
  perfilData.avatarSvg=av.svg;
  perfilData.foto=''; // remove foto URL
  localStorage.setItem('luia_perfil',JSON.stringify(perfilData));
  atualizarAvatares();
  fecharAvatarPicker();
  showToast('Avatar '+av.label+' selecionado! ✦','success');
}

function atualizarAvatares(){
  const p=perfilData;
  const apelido=p.apelido||p.nome?.split(' ')[0]||'Luísa';
  const inicial=(apelido[0]||'L').toUpperCase();
  const svgContent=p.avatarSvg||'';

  // Hero avatar
  const heroAv=document.getElementById('hero-avatar');
  if(heroAv) heroAv.innerHTML=svgContent||inicial;

  // Perfil preview
  const fp=document.getElementById('perfil-foto-preview');
  if(fp) fp.innerHTML=svgContent||inicial;

  // Sobre foto
  const sf=document.getElementById('sobre-foto');
  if(sf) sf.innerHTML=svgContent||inicial;
}

async function salvarPerfil(){
  const chave=document.getElementById('perfil-chave').value.trim();
  const chave2=document.getElementById('perfil-chave2').value.trim();
  if(chave&&chave!==chave2){showToast('As palavras-chave não coincidem!','error');return;}
  perfilData.nome=document.getElementById('perfil-nome').value.trim()||perfilData.nome;
  perfilData.apelido=document.getElementById('perfil-apelido').value.trim();
  perfilData.idade=document.getElementById('perfil-idade').value.trim();
  perfilData.signo=document.getElementById('perfil-signo').value;
  perfilData.musica=document.getElementById('perfil-musica').value.trim();
  perfilData.cor=document.getElementById('perfil-cor').value.trim();
  perfilData.sonho=document.getElementById('perfil-sonho').value.trim();
  perfilData.motivacao=document.getElementById('perfil-motivacao').value.trim();
  if(chave) perfilData.chave=chave;
  const pergunta=document.getElementById('perfil-pergunta')?.value;
  const resposta=document.getElementById('perfil-resposta')?.value.trim().toLowerCase();
  if(pergunta) perfilData.pergunta=pergunta;
  if(resposta) perfilData.resposta=resposta;
  localStorage.setItem('luia_perfil',JSON.stringify(perfilData));
  // Salva chave no Supabase para funcionar em qualquer navegador
  if(perfilData.chave){
    try{
      const _patchResp = await fetch(`${SUPA_URL}/rest/v1/study_goals?id=eq.1`,{
        method:'PATCH',
        headers:{...H,'Prefer':'return=minimal'},
        body:JSON.stringify({
          access_key:perfilData.chave,
          access_pergunta:perfilData.pergunta||'',
          access_resposta:perfilData.resposta||'',
          perfil_json:{
            nome:perfilData.nome||'',
            apelido:perfilData.apelido||'',
            idade:perfilData.idade||'',
            signo:perfilData.signo||'',
            musica:perfilData.musica||'',
            cor:perfilData.cor||'',
            sonho:perfilData.sonho||'',
            motivacao:perfilData.motivacao||'',
            avatarId:perfilData.avatarId||'',
            avatarSvg:perfilData.avatarSvg||''
          }
        })
      });
      if(!_patchResp.ok) console.error('Erro salvarPerfil:', await _patchResp.text());
    }catch(e){console.log('chave salva só local');}
  }
  atualizarSidebar();
  atualizarStatusChave();
  atualizarBanner();
  document.getElementById('perfil-chave').value='';
  document.getElementById('perfil-chave2').value='';
  showToast('Perfil salvo! ✦','success');
}

function tentarRecuperar(){
  const resp=document.getElementById('auth-resposta').value.trim().toLowerCase();
  const err=document.getElementById('auth-recuperar-error');
  if(resp===perfilData.resposta){
    // Mostra a palavra-chave na tela de reveal
    document.getElementById('auth-chave-reveal').textContent=perfilData.chave;
    mostrarTela('auth-tela-reveal');
  } else {
    err.style.display='block';
    document.getElementById('auth-resposta').value='';
    setTimeout(()=>document.getElementById('auth-resposta').focus(),100);
  }
}

function toggleChaveVis(){
  const i=document.getElementById('perfil-chave');
  i.type=i.type==='password'?'text':'password';
}

// ── AUTH ──
function mostrarTela(id){
  ['auth-tela-principal','auth-tela-recuperar','auth-tela-reveal'].forEach(t=>{
    const el=document.getElementById(t);
    if(el) el.style.display=t===id?'block':'none';
  });
}

function irParaRecuperacao(){
  const perg=perfilData.pergunta||'Como se chama sua melhor amiga?';
  const el=document.getElementById('auth-pergunta-txt');
  if(el) el.textContent='Responda: '+perg;
  const err=document.getElementById('auth-recuperar-error');
  if(err) err.style.display='none';
  const resp=document.getElementById('auth-resposta');
  if(resp) resp.value='';
  mostrarTela('auth-tela-recuperar');
  setTimeout(()=>resp&&resp.focus(),100);
}

function voltarParaChave(){
  const err=document.getElementById('auth-error');
  if(err) err.style.display='none';
  const inp=document.getElementById('auth-input');
  if(inp) inp.value='';
  mostrarTela('auth-tela-principal');
  setTimeout(()=>inp&&inp.focus(),100);
}

function comAuth(fn){
  // Sem chave criada — bloqueia e redireciona para criar
  if(!perfilData.chave){
    const ov=document.getElementById('auth-overlay');
    mostrarTela('auth-tela-principal');
    const titulo=document.querySelector('#auth-tela-principal .auth-title');
    const sub=document.querySelector('#auth-tela-principal .auth-sub');
    const btn=document.querySelector('#auth-tela-principal .auth-btn');
    const inp=document.getElementById('auth-input');
    const err=document.getElementById('auth-error');
    if(titulo) titulo.textContent='Proteção necessária';
    if(sub) sub.textContent='Crie uma palavra-chave no Perfil para começar a usar o app com segurança.';
    if(btn){btn.textContent='→ Ir para Perfil';btn.onclick=function(){ov.style.display='none';showLuia('perfil',null);restaurarModal();};}
    if(inp) inp.style.display='none';
    if(err) err.style.display='none';
    document.querySelector('#auth-tela-principal .auth-cancel').style.display='none';
    const bg=document.getElementById('auth-stars-bg');
    if(bg&&!bg.children.length){for(let i=0;i<18;i++){const s=document.createElement('div');s.className='auth-star';s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${.2+Math.random()*.5};animation-delay:${Math.random()*2}s;animation-duration:${1.5+Math.random()*2}s`;bg.appendChild(s);}}
    ov.style.display='flex';
    return;
  }
  if(authDesbloqueado){fn();return;}
  authCallback=fn;
  restaurarModal();
  const ov=document.getElementById('auth-overlay');
  const err=document.getElementById('auth-error');
  const inp=document.getElementById('auth-input');
  if(err) err.style.display='none';
  if(inp){inp.value='';inp.style.display='';}
  mostrarTela('auth-tela-principal');
  const bg=document.getElementById('auth-stars-bg');
  if(bg&&!bg.children.length){for(let i=0;i<18;i++){const s=document.createElement('div');s.className='auth-star';s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${.2+Math.random()*.5};animation-delay:${Math.random()*2}s;animation-duration:${1.5+Math.random()*2}s`;bg.appendChild(s);}}
  ov.style.display='flex';
  setTimeout(()=>inp&&inp.focus(),150);
}

function restaurarModal(){
  const titulo=document.querySelector('#auth-tela-principal .auth-title');
  const sub=document.querySelector('#auth-tela-principal .auth-sub');
  const btn=document.querySelector('#auth-tela-principal .auth-btn');
  const inp=document.getElementById('auth-input');
  const cancel=document.querySelector('#auth-tela-principal .auth-cancel');
  if(titulo) titulo.textContent='Olá! Digite sua palavra-chave';
  if(sub) sub.textContent='Para inserir ou alterar dados, confirme que é você.';
  if(btn){btn.textContent='✦ Confirmar acesso';btn.onclick=tentarAuth;}
  if(inp) inp.style.display='';
  if(cancel) cancel.style.display='';
}

function tentarAuth(){
  const inp=document.getElementById('auth-input');
  const err=document.getElementById('auth-error');
  if(inp.value.trim()===perfilData.chave){
    authDesbloqueado=true;
    document.getElementById('auth-overlay').style.display='none';
    showToast('Acesso confirmado! ✦','success');
    if(authCallback){authCallback();authCallback=null;}
    const _authExp=Date.now()+24*60*60*1000;localStorage.setItem('luia_auth_exp',_authExp);setTimeout(()=>{authDesbloqueado=false;localStorage.removeItem('luia_auth_exp');},24*60*60*1000);
  } else {
    inp.classList.add('shake');
    if(err) err.style.display='block';
    inp.value='';
    setTimeout(()=>inp.classList.remove('shake'),400);
    setTimeout(()=>inp.focus(),100);
  }
}

function cancelarAuth(){
  document.getElementById('auth-overlay').style.display='none';
  authCallback=null;
}

document.getElementById('auth-overlay').addEventListener('click',function(e){
  if(e.target===this) cancelarAuth();
});

// ── WRAPPERS PROTEGIDOS ──
// showSection estendido — via showLuia, sem sobrescrever
// (não sobrescrever showSection evita recursão infinita)

// Dropdown de planos
function togglePlanDropdown(btn){
  const dd=document.getElementById('plan-dropdown');
  dd.style.display=dd.style.display==='none'?'block':'none';
}
document.addEventListener('click',function(e){
  const dd=document.getElementById('plan-dropdown');
  const btn=document.getElementById('plan-btn');
  if(dd&&btn&&!btn.contains(e.target)&&!dd.contains(e.target)) dd.style.display='none';
});

// Render Progresso — completo com todos os módulos gerenciais
const MATS_CORES={'Português':'#A78BFA','Matemática':'#FBBF24','Ciências da Natureza':'#4ADE80','História':'#FB923C','Geografia':'#38BDF8'};

function renderProgresso(){
  const ativas=filtrarSessoesPeriodo();
  const allAtivas=sessions.filter(s=>!s.archived);
  const today=todayLocal();

  // ── 1. ALERTA DA SEMANA (IA) ──
  renderAlertaSemana(allAtivas);

  // ── 2. DESEMPENHO POR MATÉRIA ──
  const wrap=document.getElementById('prog-materias-wrap');
  if(wrap){
    if(!ativas.length){
      wrap.innerHTML='<p style="color:var(--text-dim);font-size:13px">Nenhuma sessão no período.</p>';
    } else {
      const porMat={};
      ativas.forEach(s=>{
        if(!porMat[s.materia]) porMat[s.materia]={acertos:0,erros:0,min:0,sessoes:0,lastDate:''};
        porMat[s.materia].acertos+=s.acertos||0;
        porMat[s.materia].erros+=s.erros||0;
        porMat[s.materia].min+=s.minutos||0;
        porMat[s.materia].sessoes++;
        if(s.data>porMat[s.materia].lastDate) porMat[s.materia].lastDate=s.data;
      });
      wrap.innerHTML=Object.entries(porMat).sort((a,b)=>{
        const ta=a[1].acertos+a[1].erros,tb=b[1].acertos+b[1].erros;
        const pa=ta>0?a[1].acertos/ta:0,pb=tb>0?b[1].acertos/tb:0;
        return pb-pa;
      }).map(([mat,d])=>{
        const total=d.acertos+d.erros;
        const pct=total>0?Math.round(d.acertos/total*100):0;
        const cor=MATS_CORES[mat]||'#8B5CF6';
        const diasSemEstudar=d.lastDate?Math.floor((new Date()-new Date(d.lastDate+'T12:00'))/(1000*60*60*24)):999;
        return`<div class="prog-materia-card">
          <div class="prog-mat-header">
            <div class="prog-mat-nome" style="color:${cor}">${mat}</div>
            <div class="prog-mat-pct" style="color:${cor}">${pct}%</div>
          </div>
          <div style="height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;margin-bottom:8px">
            <div style="height:100%;width:${pct}%;background:${cor};border-radius:99px;transition:width .6s"></div>
          </div>
          <div class="prog-detalhes">
            <div class="prog-detalhe"><div class="prog-detalhe-val" style="color:${cor}">${d.sessoes}</div><div class="prog-detalhe-label">Sessões</div></div>
            <div class="prog-detalhe"><div class="prog-detalhe-val" style="color:#4ADE80">${d.acertos}✓</div><div class="prog-detalhe-label">Acertos</div></div>
            <div class="prog-detalhe"><div class="prog-detalhe-val" style="color:#F87171">${d.erros}✗</div><div class="prog-detalhe-label">Erros</div></div>
            <div class="prog-detalhe"><div class="prog-detalhe-val">${Math.round(d.min/60*10)/10}h</div><div class="prog-detalhe-label">Estudado</div></div>
          </div>
          ${diasSemEstudar>5?`<div style="margin-top:8px;font-size:10px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);border-radius:6px;padding:4px 8px;color:#F87171">⚠️ Sem estudar há ${diasSemEstudar} dias</div>`:''}
        </div>`;
      }).join('');
    }
  }

  // ── 3. MATÉRIA NEGLIGENCIADA ──
  renderMateriaNegligenciada(allAtivas);

  // ── 4. SEMANA A SEMANA ──
  renderSemanas(allAtivas);

  // ── 5. HORÁRIO FAVORITO ──
  renderHorario(allAtivas);

  // ── 6. VELOCIDADE DE REVISÃO ──
  renderVelocidadeRevisao();

  // ── 7. PROJEÇÃO ATÉ A PROVA ──
  renderProjecao(allAtivas);

  // ── RESUMO GERAL ──
  const totalMin=ativas.reduce((a,s)=>a+(s.minutos||0),0);
  const totalQ=ativas.reduce((a,s)=>a+s.acertos+s.erros,0);
  const totalA=ativas.reduce((a,s)=>a+s.acertos,0);
  const resumo=document.getElementById('prog-resumo-wrap');
  if(resumo) resumo.innerHTML=`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      <div class="prog-detalhe" style="background:#1E293B;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px">
        <div class="prog-detalhe-val" style="font-size:1.6rem;color:#A78BFA">${ativas.length}</div>
        <div class="prog-detalhe-label">Sessões no período</div>
      </div>
      <div class="prog-detalhe" style="background:#1E293B;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px">
        <div class="prog-detalhe-val" style="font-size:1.6rem;color:#4ADE80">${totalQ>0?Math.round(totalA/totalQ*100):0}%</div>
        <div class="prog-detalhe-label">Taxa de acertos</div>
      </div>
      <div class="prog-detalhe" style="background:#1E293B;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px">
        <div class="prog-detalhe-val" style="font-size:1.6rem;color:#F59E0B">${Math.round(totalMin/60*10)/10}h</div>
        <div class="prog-detalhe-label">Total estudado</div>
      </div>
    </div>`;
}

function renderAlertaSemana(ativas){
  const el=document.getElementById('prog-alerta');
  if(!el) return;
  // Calcula insights automáticos sem IA
  const today=new Date();
  const semAnt=new Date();semAnt.setDate(today.getDate()-7);
  const cutoff=semAnt.toISOString().split('T')[0];
  const semana=ativas.filter(s=>s.data>=cutoff);

  const insights=[];
  // Matérias não estudadas esta semana
  const matsEstaSemana=new Set(semana.map(s=>s.materia));
  const todasMats=new Set(ativas.map(s=>s.materia));
  const neglected=[...todasMats].filter(m=>!matsEstaSemana.has(m));
  if(neglected.length) insights.push(`⚠️ Esta semana sem estudar: ${neglected.join(', ')}`);
  // Acertos esta semana
  const qSem=semana.reduce((a,s)=>a+s.acertos+s.erros,0);
  const aSem=semana.reduce((a,s)=>a+s.acertos,0);
  if(qSem>0){const p=Math.round(aSem/qSem*100);insights.push(p>=85?`✨ Taxa de acertos esta semana: ${p}% — excelente!`:p<70?`📉 Taxa de acertos esta semana: ${p}% — atenção!`:`📊 Taxa de acertos esta semana: ${p}%`);}
  // Revisões atrasadas
  const today2=todayLocal();
  const revAtrasadas=reviews.filter(r=>r.review_date<today2&&r.status==='pendente').length;
  if(revAtrasadas>0) insights.push(`🔔 ${revAtrasadas} revisão(ões) atrasada(s) esperando você`);
  if(!semana.length) insights.push('📚 Nenhuma sessão esta semana ainda — que tal começar hoje?');

  el.innerHTML=insights.map(i=>`<div style="padding:8px 12px;background:rgba(139,92,246,.08);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;font-size:12px;color:var(--text-secondary);line-height:1.5">${i}</div>`).join('');
}

function renderMateriaNegligenciada(ativas){
  const el=document.getElementById('prog-negligenciada');
  if(!el||!ativas.length) return;
  const porMat={};
  ativas.forEach(s=>{if(!porMat[s.materia]||s.data>porMat[s.materia])porMat[s.materia]=s.data;});
  const sorted=Object.entries(porMat).sort((a,b)=>a[1].localeCompare(b[1]));
  if(!sorted.length){el.innerHTML='<p style="color:var(--text-dim);font-size:13px">Nenhum dado ainda.</p>';return;}
  el.innerHTML=sorted.map(([mat,lastDate])=>{
    const dias=Math.floor((new Date()-new Date(lastDate+'T12:00'))/(1000*60*60*24));
    const cor=dias>7?'var(--danger)':dias>3?'var(--warning)':'var(--success)';
    const cor2=MATS_CORES[mat]||'#8B5CF6';
    return`<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:8px;height:8px;border-radius:50%;background:${cor2};flex-shrink:0"></div>
        <span style="font-size:13px;font-weight:500;color:var(--text-primary)">${mat}</span>
      </div>
      <span style="font-size:12px;font-weight:600;color:${cor}">
        ${dias===0?'Hoje':dias===1?'Ontem':dias+' dias atrás'}
      </span>
    </div>`;
  }).join('');
}

function renderSemanas(ativas){
  const el=document.getElementById('prog-semanas');
  if(!el) return;
  // Agrupa por semana ISO
  const porSemana={};
  ativas.forEach(s=>{
    const d=new Date(s.data+'T12:00');
    const semNum=Math.floor((d-new Date('2026-06-22'))/(7*24*60*60*1000));
    const key='S'+(semNum+1);
    if(!porSemana[key]) porSemana[key]={dias:new Set(),q:0,a:0,min:0,label:key};
    porSemana[key].dias.add(s.data);
    porSemana[key].q+=s.acertos+s.erros;
    porSemana[key].a+=s.acertos;
    porSemana[key].min+=s.minutos||0;
  });
  const semanas=Object.values(porSemana).sort((a,b)=>a.label.localeCompare(b.label));
  if(!semanas.length){el.innerHTML='<p style="color:var(--text-dim);font-size:13px">Nenhum dado ainda.</p>';return;}
  el.innerHTML=`<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead><tr>
      <th style="text-align:left;padding:8px 10px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)">Semana</th>
      <th style="text-align:center;padding:8px 10px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)">Dias</th>
      <th style="text-align:center;padding:8px 10px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)">Questões</th>
      <th style="text-align:center;padding:8px 10px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)">Acertos</th>
      <th style="text-align:center;padding:8px 10px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)">Horas</th>
      <th style="padding:8px 10px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)">Desempenho</th>
    </tr></thead>
    <tbody>${semanas.map((s,i)=>{
      const pct=s.q>0?Math.round(s.a/s.q*100):0;
      const cor=pct>=85?'#4ADE80':pct>=70?'#A78BFA':pct>=50?'#FBBF24':'#F87171';
      return`<tr style="border-bottom:1px solid rgba(255,255,255,.04)">
        <td style="padding:10px;font-weight:600;color:var(--text-primary)">${s.label}</td>
        <td style="padding:10px;text-align:center;color:var(--text-secondary)">${s.dias.size}/7</td>
        <td style="padding:10px;text-align:center;color:var(--text-secondary)">${s.q}</td>
        <td style="padding:10px;text-align:center"><span style="font-weight:700;color:${cor}">${pct}%</span></td>
        <td style="padding:10px;text-align:center;color:var(--text-secondary)">${Math.round(s.min/60*10)/10}h</td>
        <td style="padding:10px"><div style="height:5px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;min-width:60px"><div style="height:100%;width:${pct}%;background:${cor};border-radius:99px"></div></div></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

function renderHorario(ativas){
  const el=document.getElementById('prog-horario');
  if(!el||!ativas.length) return;
  // Analisa hora de lançamento pelo created_at
  const periodos={'Manhã (6h-12h)':0,'Tarde (12h-18h)':0,'Noite (18h-24h)':0,'Madrugada (0h-6h)':0};
  let comHora=0;
  ativas.forEach(s=>{
    if(!s.created_at) return;
    const h=new Date(s.created_at).getHours();
    comHora++;
    if(h>=6&&h<12) periodos['Manhã (6h-12h)']++;
    else if(h>=12&&h<18) periodos['Tarde (12h-18h)']++;
    else if(h>=18) periodos['Noite (18h-24h)']++;
    else periodos['Madrugada (0h-6h)']++;
  });
  if(!comHora){el.innerHTML='<p style="color:var(--text-dim);font-size:13px">Dados de horário não disponíveis.</p>';return;}
  const max=Math.max(...Object.values(periodos));
  el.innerHTML=Object.entries(periodos).map(([p,n])=>{
    const pct=Math.round(n/comHora*100);
    const isMax=n===max&&n>0;
    return`<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:12px;font-weight:${isMax?'700':'400'};color:${isMax?'var(--accent-light)':'var(--text-secondary)'}">${p}${isMax?' ⭐':''}</span>
        <span style="font-size:12px;font-weight:600;color:var(--text-secondary)">${n} sessões · ${pct}%</span>
      </div>
      <div style="height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${isMax?'var(--accent)':'rgba(139,92,246,.4)'};border-radius:99px;transition:width .6s"></div>
      </div>
    </div>`;
  }).join('');
}

function renderVelocidadeRevisao(){
  const el=document.getElementById('prog-revisao-vel');
  if(!el) return;
  const today=todayLocal();
  const total=reviews.length;
  const feitas=reviews.filter(r=>r.status==='concluida').length;
  const noPrazo=reviews.filter(r=>{
    if(r.status!=='concluida') return false;
    // Considera no prazo se não está atrasada (simplificado)
    return true;
  }).length;
  const atrasadas=reviews.filter(r=>r.status==='pendente'&&r.review_date<today).length;
  const pctCump=total>0?Math.round(feitas/total*100):0;
  const cor=pctCump>=80?'#4ADE80':pctCump>=60?'#FBBF24':'#F87171';
  el.innerHTML=`
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px">
      <div style="background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);border-radius:10px;padding:12px;text-align:center">
        <div style="font-family:'Poppins',sans-serif;font-size:1.5rem;font-weight:700;color:#A78BFA">${total}</div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em;margin-top:3px">Total</div>
      </div>
      <div style="background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;text-align:center">
        <div style="font-family:'Poppins',sans-serif;font-size:1.5rem;font-weight:700;color:#4ADE80">${feitas}</div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em;margin-top:3px">Feitas</div>
      </div>
      <div style="background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;text-align:center">
        <div style="font-family:'Poppins',sans-serif;font-size:1.5rem;font-weight:700;color:#F87171">${atrasadas}</div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em;margin-top:3px">Atrasadas</div>
      </div>
      <div style="background:rgba(${cor==='#4ADE80'?'74,222,128':cor==='#FBBF24'?'251,191,36':'248,113,113'},.1);border:1px solid rgba(${cor==='#4ADE80'?'74,222,128':cor==='#FBBF24'?'251,191,36':'248,113,113'},.2);border-radius:10px;padding:12px;text-align:center">
        <div style="font-family:'Poppins',sans-serif;font-size:1.5rem;font-weight:700;color:${cor}">${pctCump}%</div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em;margin-top:3px">Cumprimento</div>
      </div>
    </div>
    <div style="height:8px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden">
      <div style="height:100%;width:${pctCump}%;background:${cor};border-radius:99px;transition:width .6s"></div>
    </div>`;
}

function renderProjecao(ativas){
  const el=document.getElementById('prog-projecao');
  if(!el) return;
  const dataProva=new Date((goals.data_prova||'2026-12-20')+'T00:00:00');
  const hoje=new Date();
  const diasRestantes=Math.max(1,Math.ceil((dataProva-hoje)/(1000*60*60*24)));
  const totalDiasPlano=PLANO_DATA.reduce((a,s)=>a+s.dias.length,0);
  const diasFeitos=planoFeitos.length;
  const diasPassados=Math.max(1,Math.ceil((hoje-new Date('2026-06-22'))/(1000*60*60*24)));
  const ritmoAtual=diasFeitos/diasPassados; // dias/dia
  const projecaoDias=Math.round(ritmoAtual*diasRestantes);
  const totalProjetado=diasFeitos+projecaoDias;
  const pctProjetado=Math.min(100,Math.round(totalProjetado/totalDiasPlano*100));
  const vaiBem=pctProjetado>=80;
  const cor=vaiBem?'#4ADE80':pctProjetado>=60?'#FBBF24':'#F87171';
  // Sessões/semana
  const sessPorDia=ativas.length/Math.max(1,diasPassados);
  const sessSemana=Math.round(sessPorDia*7*10)/10;
  el.innerHTML=`
    <div style="background:rgba(${vaiBem?'74,222,128':pctProjetado>=60?'251,191,36':'248,113,113'},.06);border:1px solid rgba(${vaiBem?'74,222,128':pctProjetado>=60?'251,191,36':'248,113,113'},.2);border-radius:12px;padding:16px 18px;margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600;color:var(--text-primary)">${vaiBem?'✅ No caminho certo!':pctProjetado>=60?'⚠️ Atenção necessária':'🚨 Ritmo precisa aumentar'}</span>
        <span style="font-family:'Poppins',sans-serif;font-size:1.4rem;font-weight:700;color:${cor}">${pctProjetado}%</span>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">
        No ritmo atual, você vai cumprir <strong style="color:${cor}">${pctProjetado}%</strong> do plano até a prova.<br>
        Hoje: ${diasFeitos}/${totalDiasPlano} dias cumpridos · Ritmo: ${sessSemana} sessões/semana · ${diasRestantes} dias até a prova.
      </div>
    </div>
    <div style="height:8px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden">
      <div style="height:100%;width:${Math.round(diasFeitos/totalDiasPlano*100)}%;background:var(--accent);border-radius:99px"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-dim);margin-top:4px">
      <span>Hoje: ${Math.round(diasFeitos/totalDiasPlano*100)}%</span>
      <span>Projeção final: ${pctProjetado}%</span>
    </div>`;
}

// Render Sobre Mim
function renderSobreMim(){
  // Controla lock
  const locked=document.getElementById('sobre-locked-wrap');
  const card=document.getElementById('sobre-mim-card');
  if(perfilData.chave && !authDesbloqueado){
    if(locked) locked.style.display='block';
    if(card) card.style.display='none';
    return;
  }
  if(locked) locked.style.display='none';
  if(card) card.style.display='block';
  const p=perfilData;
  const apelido=p.apelido||p.nome?.split(' ')[0]||'Luísa';
  const inicial=apelido[0]?.toUpperCase()||'L';
  const foto=document.getElementById('sobre-foto');
  const nome=document.getElementById('sobre-nome');
  const signo=document.getElementById('sobre-signo');
  const grid=document.getElementById('sobre-grid');
  if(foto) foto.innerHTML=p.foto?`<img src="${p.foto}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:(p.avatarSvg||inicial);
  if(nome) nome.textContent=p.nome||'Luísa Couto Mota';
  if(signo) signo.textContent=(p.signo||'')+(p.signo?' · ':'')+' IFPE 2027';
  const itens=[
    {label:'Como gosta de ser chamada',val:p.apelido,icon:'👋'},
    {label:'Idade',val:p.idade?p.idade+' anos':'—',icon:'🎂'},
    {label:'Signo',val:p.signo||'—',icon:'✨'},
    {label:'Música favorita',val:p.musica||'—',icon:'🎵'},
    {label:'Cor favorita',val:p.cor||'—',icon:'🎨'},
    {label:'Sonho',val:p.sonho||'—',icon:'💭',full:true},
    {label:'Por que o IFPE?',val:p.motivacao||'—',icon:'🚀',full:true},
  ].filter(i=>i.val&&i.val!=='—');

  if(!itens.length){
    if(grid) grid.innerHTML='<div class="sobre-mim-item sobre-mim-full" style="text-align:center;color:#64748B;font-size:13px">Preencha seu perfil para ver seus dados aqui ✨</div>';
    return;
  }
  if(grid) grid.innerHTML=itens.map(i=>`
    <div class="sobre-mim-item${i.full?' sobre-mim-full':''}">
      <div class="sobre-mim-item-label">${i.icon} ${i.label}</div>
      <div class="sobre-mim-item-val">${i.val}</div>
    </div>`).join('');
}

// ── RECADOS ──
let recadoOrdem='desc';
function renderRecado(){
  const wrap=document.getElementById('recado-content');
  if(!wrap) return;
  const comObs=sessions.filter(s=>!s.archived&&s.obs&&s.obs.trim()!=='');
  if(!comObs.length){
    wrap.innerHTML='<p style="color:var(--text-dim);font-size:13px;font-style:italic">Deixe um recado no campo observação ao lançar uma sessão! ✦</p>';
    return;
  }
  const sorted=[...comObs].sort((a,b)=>recadoOrdem==='desc'?(a.data>b.data?-1:1):(a.data>b.data?1:-1));
  const today=todayLocal();
  const btn='<div style="display:flex;justify-content:flex-end;margin-bottom:8px">'
    +'<button onclick="toggleRecadoOrdem()" style="background:none;border:1px solid var(--border);border-radius:99px;padding:3px 10px;font-size:10px;color:var(--text-secondary);cursor:pointer;font-family:\'Inter\',sans-serif">'
    +(recadoOrdem==='desc'?'↑ Mais antigo primeiro':'↓ Mais recente primeiro')
    +'</button></div>';
  const items=sorted.map(s=>{
    const isToday=s.data===today;
    return '<div style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,.08)">'
      +'<div style="font-size:10px;font-weight:600;color:'+(isToday?'var(--warning)':'var(--accent-light)')+';margin-bottom:4px">'
      +fmtDate(s.data)+(isToday?' · Hoje':'')+' <span style="color:var(--text-secondary);font-weight:400">· '+s.materia+'</span></div>'
      +'<div style="font-size:13px;color:var(--text-primary);font-style:italic;padding:8px 12px;background:rgba(139,92,246,.06);border-left:3px solid var(--accent-light);border-radius:0 6px 6px 0">"'+s.obs+'"</div>'
      +'</div>';
  }).join('');
  wrap.innerHTML=btn+'<div style="max-height:220px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent">'+items+'</div>';
}
function toggleRecadoOrdem(){
  recadoOrdem=recadoOrdem==='desc'?'asc':'desc';
  renderRecado();
}

// ── RELATÓRIO DE PROGRESSO ──
let progPeriodo=7;
function setProgPeriodo(dias,btn){
  progPeriodo=dias;
  document.querySelectorAll('#sec-progresso .filter-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProgresso();
}

function filtrarSessoesPeriodo(){
  const ativas=sessions.filter(s=>!s.archived);
  if(progPeriodo===0) return ativas;
  const corte=new Date();corte.setDate(corte.getDate()-progPeriodo);
  const cutoff=corte.toISOString().split('T')[0];
  return ativas.filter(s=>s.data>=cutoff);
}

async function exportarRelatorio(winPreAberta){
  const periodo=progPeriodo===0?'Total':('Últimos '+progPeriodo+' dias');
  const ativas=filtrarSessoesPeriodo();
  const today=todayLocal();

  // Coleta dados
  const totalQ=ativas.reduce((a,s)=>a+s.acertos+s.erros,0);
  const totalA=ativas.reduce((a,s)=>a+s.acertos,0);
  const totalMin=ativas.reduce((a,s)=>a+(s.minutos||0),0);
  const pctGeral=totalQ>0?Math.round(totalA/totalQ*100):0;
  const {streak,record}=calcStreak();

  // Por matéria
  const MATS_CORES={'Português':'#A78BFA','Matemática':'#FBBF24','Ciências da Natureza':'#4ADE80','História':'#FB923C','Geografia':'#38BDF8'};
  const porMat={};
  ativas.forEach(s=>{
    if(!porMat[s.materia])porMat[s.materia]={acertos:0,erros:0,min:0,sessoes:0};
    porMat[s.materia].acertos+=s.acertos||0;
    porMat[s.materia].erros+=s.erros||0;
    porMat[s.materia].min+=s.minutos||0;
    porMat[s.materia].sessoes++;
  });

  // Revisões
  const revTotal=reviews.length;
  const revFeitas=reviews.filter(r=>r.status==='concluida').length;
  const revPend=reviews.filter(r=>r.status==='pendente'&&r.review_date<=today).length;
  const porCiclo={'1d':{f:0,p:0},'7d':{f:0,p:0},'15d':{f:0,p:0},'30d':{f:0,p:0}};
  reviews.forEach(r=>{
    let tipo=r.tipo||'30d';
    if(!porCiclo[tipo])porCiclo[tipo]={f:0,p:0};
    if(r.status==='concluida')porCiclo[tipo].f++;
    else porCiclo[tipo].p++;
  });

  // Plano
  const totalDiasPlano=PLANO_DATA.reduce((a,s)=>a+s.dias.length,0);
  const diasFeitos=planoFeitos.length;
  const pctPlano=Math.round(diasFeitos/totalDiasPlano*100);

  // Conquistas
  const conquFeitas=conquistasDesbloqueadas||[];

  // Dados de simulados
  const simHist=simHistorico||[];
  const simPeriodo=progPeriodo===0?simHist:simHist.filter(s=>{
    const corte=new Date();corte.setDate(corte.getDate()-progPeriodo);
    return new Date(s.data+'T12:00')>=corte;
  });
  const simMedia=simPeriodo.length?Math.round(simPeriodo.reduce((a,s)=>a+s.pct,0)/simPeriodo.length):0;
  const simMelhor=simPeriodo.length?Math.max(...simPeriodo.map(s=>s.pct)):0;

  // Usa janela pré-aberta ou abre nova
  const win = winPreAberta || window.open('','_blank');
  if(!win){ showToast('Permita popups para gerar o relatório.','error'); return; }
  if(!winPreAberta) win.document.write('<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#0F172A;color:#fff;font-size:18px"><div style="text-align:center"><div style="font-size:3rem;margin-bottom:16px">✦</div><div>Gerando diagnóstico com IA...</div><div style="font-size:13px;color:#94A3B8;margin-top:8px">Isso pode levar alguns segundos</div></div></body></html>');

  win.document.open();
  win.document.write(html);
  win.document.close();
}


// ── WRAPPERS PROTEGIDOS (sem recursão) ──
function _authOpenEdit(uid){if(_visitanteBlocked('editar sessão'))return;comAuth(()=>openEdit(uid));}
function _visitanteBlocked(msg){
  if(!perfilData.chave){
    showToast('Entre com sua palavra-chave para ' + (msg||'realizar esta ação') + '.','info');
    bvMostrar();
    return true;
  }
  return false;
}
function _authLancar(){if(_visitanteBlocked('registrar sessão'))return;comAuth(()=>lancarSessao());}
function _authTogglePlano(data,el){if(_visitanteBlocked('marcar o plano'))return;comAuth(()=>togglePlano(data,el));}
function _authConcluir(id){if(_visitanteBlocked('concluir revisão'))return;comAuth(()=>concluirRevisao(id));}
function _authReabrir(id){if(_visitanteBlocked('reabrir revisão'))return;comAuth(()=>reabrirRevisao(id));}
function _authArquivar(uid){if(_visitanteBlocked('arquivar sessão'))return;comAuth(()=>arquivar(uid));}
function _authZerar(mat){if(_visitanteBlocked('zerar matéria'))return;comAuth(()=>zerarMateria(mat));}
function _authSalvarMetas(){if(_visitanteBlocked('salvar metas'))return;comAuth(()=>salvarMetas());}
function _authExportarRelatorio(){
  if(_visitanteBlocked('gerar relatório'))return;
  // Abre janela ANTES do comAuth (popup só funciona no clique direto)
  const win=window.open('','_blank');
  if(!win){showToast('Permita popups para gerar o relatório.','error');return;}
  win.document.write('<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#0F172A;color:#fff;font-size:18px"><div style="text-align:center"><div style="font-size:3rem;margin-bottom:16px">✦</div><div>Gerando diagnóstico com IA...</div><div style="font-size:13px;color:#94A3B8;margin-top:8px">Isso pode levar alguns segundos</div></div></body></html>');
  if(authDesbloqueado){
    exportarRelatorio(win);
  } else {
    comAuth(()=>exportarRelatorio(win));
  }
}
function _authTimerStart(){if(_visitanteBlocked('iniciar cronômetro'))return;comAuth(()=>timerStart());}

// ── BANCO DE FRASES MOTIVACIONAIS ──
const FRASES=[
  "Cada questão resolvida é um passo mais perto do IFPE. Continue!",
  "Consistência bate talento quando o talento não se esforça.",
  "Hoje você é melhor do que ontem. Amanhã será melhor que hoje.",
  "O segredo do sucesso é começar. Você já começou!",
  "Frações parecem difíceis até que de repente ficam fáceis. Persiste!",
  "Cada minuto de estudo hoje vale horas no dia da prova.",
  "Você não está estudando para passar — você está estudando para brilhar.",
  "A Luísa que entra no IFPE em 2027 está sendo construída agora.",
  "Interpretação de texto é superpower. Você está desenvolvendo o seu.",
  "Matemática é lógica. E você tem lógica de sobra.",
  "Todo dia estudado é um dia que o IFPE fica mais próximo.",
  "Pequenos progressos todos os dias somam grandes resultados.",
  "Não existe dia ruim de estudo — existe dia de aprendizado.",
  "Ciências da Natureza é fascinante quando você entende o porquê.",
  "Seu esforço hoje é o orgulho de amanhã.",
  "Uma sessão de estudo por dia mantém a reprovação afastada.",
  "História não é decorar datas — é entender o mundo. Você está indo bem!",
  "Geografia abre sua visão de mundo. Literalmente.",
  "Revisão é o segredo dos que passam. Não pule essa etapa!",
  "Você tem 178 dias. Cada um deles conta.",
  "A diferença entre quem passa e quem não passa é a consistência.",
  "Foco. Fé. Estudo. Nessa ordem.",
  "Sua mãe acredita em você. Você acredita em você?",
  "O IFPE não vai saber o que te espera. Mas você vai.",
  "Estudar cansa. Não estudar também. Prefira o cansaço que vale a pena.",
  "Cada erro em questão é um acerto garantido na prova.",
  "Você está construindo seu futuro, tijolo por tijolo.",
  "Luia está do seu lado. Vamos juntas!",
  "Interpretação, matemática, ciências — você domina tudo isso.",
  "A aprovação não é sorte. É consequência. Continue!",
];

function getFraseHoje(){
  const dia=new Date().getDay()+new Date().getDate();
  return FRASES[dia % FRASES.length];
}

// ── CONTADOR REGRESSIVO CIRCULAR ──
function atualizarContador(){
  // Pega data da prova das goals ou usa padrão
  const dataProva = goals.data_prova || '2026-12-20';
  const nomeObj = goals.objetivo || 'IFPE 2027';
  const inicio = new Date('2026-06-22T00:00:00'); // início do plano
  const prova = new Date(dataProva+'T00:00:00');
  const hoje = new Date();

  const totalDias = Math.ceil((prova-inicio)/(1000*60*60*24));
  const diasRestantes = Math.max(0, Math.ceil((prova-hoje)/(1000*60*60*24)));
  const diasPassados = totalDias - diasRestantes;
  const pct = Math.min(100, Math.round(diasPassados/totalDias*100));

  // Arco SVG: circunferência = 2π*28 ≈ 175.9
  const circ = 175.9;
  const offset = circ - (circ * pct / 100);
  const arc = document.getElementById('countdown-arc');
  if(arc) arc.style.strokeDashoffset = offset;

  const num = document.getElementById('countdown-num');
  const texto = document.getElementById('countdown-texto');
  const pctEl = document.getElementById('countdown-pct');
  const objEl = document.getElementById('countdown-objetivo');

  if(num) num.textContent = diasRestantes;
  if(objEl) objEl.textContent = nomeObj;
  if(texto) texto.textContent = diasRestantes <= 0
    ? '🎉 Dia da prova chegou! Vai com tudo!'
    : getFraseHoje();
  if(pctEl) pctEl.textContent = pct+'% do tempo percorrido · '+diasPassados+' dias estudando';
}

// ── BADGE DE REVISÕES PENDENTES ──
function atualizarRevBadge(){
  const today = todayLocal();
  const atrasadas = reviews.filter(r=>r.status==='pendente'&&r.review_date<=today).length;
  const badge = document.getElementById('rev-badge');
  if(!badge) return;
  if(atrasadas > 0){
    badge.style.display = 'inline-block';
    badge.textContent = atrasadas > 9 ? '9+' : atrasadas;
  } else {
    badge.style.display = 'none';
  }
}

// ── ATUALIZA WELCOME ──
function updateWelcome(){
  const prova = new Date((goals.data_prova||'2026-12-20')+'T00:00:00');
  const diff = Math.ceil((prova-new Date())/(1000*60*60*24));
  const sub = document.getElementById('welcome-sub');
  if(!sub) return;
  const ativas = (sessions||[]).filter(s=>!s.archived);
  if(ativas.length>0){
    const totalQ=ativas.reduce((a,s)=>a+s.acertos+s.erros,0);
    const totalA=ativas.reduce((a,s)=>a+s.acertos,0);
    const pct=totalQ>0?Math.round(totalA/totalQ*100):0;
    sub.textContent='Você tem '+ativas.length+' registro'+(ativas.length>1?'s':'')+', '+pct+'% de acertos e '+diff+' dias para a prova. Bora!';
  } else {
    sub.textContent='Faltam '+diff+' dias para a prova. Vamos começar!';
  }
  atualizarContador();
  atualizarRevBadge();
}

init();
setTimeout(()=>{carregarPerfil();atualizarBanner();},600);

// ═══════════════════════════════════════
//  FEEDBACK
// ═══════════════════════════════════════
let fbTipo='bug', fbPrior='normal';
function fbSetTipo(btn,tipo){document.querySelectorAll('.fb-tipo-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');fbTipo=tipo;}
function fbSetPrior(btn,prior){document.querySelectorAll('.fb-prior-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');fbPrior=prior;}
async function fbEnviar(){
  if(_visitanteBlocked('enviar feedback')) return;
  const texto=document.getElementById('fb-texto').value.trim();
  if(!texto){showToast('Descreve o feedback antes de enviar!','error');return;}
  const btn=document.querySelector('#sec-feedback .btn-primary');
  if(btn){btn.disabled=true;btn.textContent='Enviando...';}
  try{
    await sbPost('feedbacks',{access_key:perfilData.chave||'visitante',texto,tipo:fbTipo,prioridade:fbPrior,resolvido:false});
    document.getElementById('fb-texto').value='';
    showToast('Feedback enviado! Sua mãe vai ver em breve.','success');
    renderFeedbacks();
  }catch(e){showToast('Erro ao enviar. Tente novamente.','error');}
  finally{if(btn){btn.disabled=false;btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Enviar feedback';}}
}
async function renderFeedbacks(){
  const el=document.getElementById('fb-lista');
  if(!el) return;
  try{
    const rows=await sbGet('feedbacks','order=created_at.desc&limit=20');
    if(!rows||!rows.length){el.innerHTML='<p style="font-size:13px;color:var(--text-dim)">Nenhum feedback ainda.</p>';return;}
    const tIcon={bug:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2l1.5 1.5M15.5 2 14 3.5M12 8c-2.2 0-4 1.8-4 4v3h8v-3c0-2.2-1.8-4-4-4z"/></svg>',ideia:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>',melhoria:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'};
    const pCor={urgente:'#F87171',normal:'#FBBF24',calma:'#4ADE80'};
    el.innerHTML=rows.map(r=>`<div class="fb-item ${r.resolvido?'resolvido':''}" style="margin-bottom:8px"><div class="fb-item-icon" style="background:rgba(139,92,246,.12);color:#A78BFA">${tIcon[r.tipo]||tIcon.bug}</div><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#A78BFA">${r.tipo}</span><span style="font-size:10px;padding:1px 7px;border-radius:99px;background:rgba(0,0,0,.2);color:${pCor[r.prioridade]||'#94A3B8'};font-weight:600">${r.prioridade}</span>${r.resolvido?'<span style="font-size:10px;color:#4ADE80">Resolvido</span>':''}<span style="font-size:10px;color:var(--text-dim);margin-left:auto">${(r.created_at||'').substring(0,10)}</span></div><div style="font-size:13px;color:var(--text-secondary);line-height:1.5">${r.texto}</div></div></div>`).join('');
  }catch(e){el.innerHTML='<p style="font-size:13px;color:var(--text-dim)">Erro ao carregar feedbacks.</p>';}
}

// ═══════════════════════════════════════
//  RELATÓRIO PDF
// ═══════════════════════════════════════
let relPeriodoDias=7;
function abrirModalRelatorio(){document.getElementById('modal-relatorio').style.display='flex';}
function relSetPeriodo(btn,dias){
  relPeriodoDias=dias;
  document.querySelectorAll('.rel-per-btn').forEach(b=>{b.style.border='1.5px solid rgba(255,255,255,.1)';b.style.background='transparent';b.style.color='rgba(255,255,255,.5)';});
  btn.style.border='1.5px solid #7C3AED';btn.style.background='rgba(124,58,237,.2)';btn.style.color='#A78BFA';
}
function gerarRelatorio(){
  document.getElementById('modal-relatorio').style.display='none';
  const win=window.open('','_blank');
  if(!win){showToast('Permita popups para gerar o relatório.','error');return;}
  const dias=relPeriodoDias;
  const hoje=new Date();
  const corte=dias>0?new Date(hoje.getTime()-dias*24*60*60*1000):null;
  const periodoLabel=dias===7?'Últimos 7 dias':dias===15?'Últimos 15 dias':dias===30?'Últimos 30 dias':'Todo o período';
  const dataGer=hoje.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'})+' às '+hoje.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  const ativas=sessions.filter(s=>!s.archived&&(!corte||new Date(s.data+'T12:00')>=corte));
  const simFilt=(simHistorico||[]).filter(s=>!s.arquivado&&(!corte||new Date((s.data||'')+'T12:00')>=corte));
  const revFilt=reviews.filter(r=>!corte||new Date((r.review_date||'')+'T12:00')>=corte);
  const totalSess=ativas.length;
  const totalQ=ativas.reduce((a,s)=>a+s.acertos+s.erros,0)+simFilt.reduce((a,s)=>a+(s.total||0),0);
  const totalA=ativas.reduce((a,s)=>a+s.acertos,0)+simFilt.reduce((a,s)=>a+(s.acertos||0),0);
  const totalMin=ativas.reduce((a,s)=>a+(s.minutos||0),0);
  const pctAcertos=totalQ>0?Math.round(totalA/totalQ*100):0;
  const horas=Math.floor(totalMin/60);const mins=totalMin%60;
  const horasStr=horas>0?`${horas}h${mins>0?mins+'m':''}`:`${totalMin}min`;
  const {streak}=calcStreak();
  const porMat={};
  ativas.forEach(s=>{if(!porMat[s.materia])porMat[s.materia]={acertos:0,erros:0,sessoes:0,minutos:0};porMat[s.materia].acertos+=s.acertos;porMat[s.materia].erros+=s.erros;porMat[s.materia].sessoes++;porMat[s.materia].minutos+=(s.minutos||0);});
  simFilt.forEach(s=>{if(!porMat[s.materia])porMat[s.materia]={acertos:0,erros:0,sessoes:0,minutos:0};porMat[s.materia].acertos+=s.acertos||0;porMat[s.materia].erros+=(s.total||0)-(s.acertos||0);});
  const today=todayLocal();
  const revConcluidas=revFilt.filter(r=>r.status==='concluida').length;
  const revAtrasadas=revFilt.filter(r=>r.status==='pendente'&&r.review_date<=today).length;
  const diasPlanoFilt=planoFeitos.filter(d=>!corte||new Date(d+'T12:00')>=corte).length;
  const totalDiasBase=dias>0?dias:Math.max(planoFeitos.length,1);
  const pctPlano=Math.min(100,Math.round(diasPlanoFilt/totalDiasBase*100));
  const sessPorSemana=dias>0?(totalSess/(dias/7)):totalSess/4;
  const revScore=revConcluidas+revAtrasadas>0?Math.round(revConcluidas/(revConcluidas+revAtrasadas)*100):100;
  const prontidao=Math.round(pctAcertos*.40+pctPlano*.30+Math.min(100,sessPorSemana/5*100)*.20+revScore*.10);
  const corPront=prontidao>=70?'#4ADE80':prontidao>=50?'#FBBF24':'#F87171';
  const textoPront=prontidao>=70?'Excelente ritmo! Luísa mantém consistência e bom aproveitamento.':prontidao>=50?'Progresso satisfatório. Há espaço para melhorar consistência e revisões.':'Atenção necessária. Recomenda-se aumentar frequência de estudos.';
  const todasMat=['Português','Matemática','Ciências da Natureza','História','Geografia'];
  const negligenciadas=todasMat.filter(m=>!porMat[m]);
  const nome=perfilData.nome||'Luísa';
  const objetivo=goals.objetivo||'IFPE 2027';
  const prova=new Date(((goals.data_prova||'2027-01-01')+'T00:00:00'));
  const diasProva=Math.ceil((prova-hoje)/(1000*60*60*24));
  const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório — ${nome}</title><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#F8F9FF;color:#1E1B4B}.header{background:linear-gradient(135deg,#0F172A,#1E1B4B);padding:24px 32px;display:flex;align-items:center;justify-content:space-between}.logo{font-family:'Poppins',sans-serif;font-size:28px;font-weight:800;color:#fff}.logo span{color:#A78BFA}.h-info{text-align:right}.h-nome{font-size:15px;font-weight:700;color:#fff}.h-sub{font-size:11px;color:rgba(167,139,250,.7);margin-top:2px}.h-data{font-size:10px;color:rgba(255,255,255,.4);margin-top:4px}.periodo{display:inline-block;background:rgba(124,58,237,.3);color:#A78BFA;font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;margin-top:4px}.page{max-width:720px;margin:0 auto;padding:28px 24px}section{margin:20px 0}h2{font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;color:#6D28D9;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;display:flex;align-items:center;gap:8px}h2::after{content:'';flex:1;height:1px;background:rgba(109,40,217,.15)}.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.sc{background:#fff;border-radius:10px;padding:14px;text-align:center;border:1px solid rgba(109,40,217,.1)}.sv{font-family:'Poppins',sans-serif;font-size:1.4rem;font-weight:800;color:#6D28D9}.sl{font-size:10px;color:#94A3B8;text-transform:uppercase;letter-spacing:.05em;margin-top:3px}.pcard{background:#fff;border-radius:10px;padding:18px;border:1px solid rgba(109,40,217,.1)}.pbar{height:10px;background:#F1F5F9;border-radius:99px;overflow:hidden;margin:10px 0}.pbfill{height:100%;border-radius:99px}.mrow{display:flex;align-items:center;gap:10px;margin-bottom:8px}.mnome{width:130px;font-size:12px;font-weight:600;color:#1E1B4B;flex-shrink:0}.mbar{flex:1;height:7px;background:#F1F5F9;border-radius:99px;overflow:hidden}.mbfill{height:100%;border-radius:99px}.mpct{width:34px;text-align:right;font-size:12px;font-weight:600;color:#6D28D9}.mq{width:44px;text-align:right;font-size:10px;color:#94A3B8}table{width:100%;border-collapse:collapse;font-size:12px}th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#94A3B8;padding:5px 8px;border-bottom:2px solid #E2E8F0}td{padding:7px 8px;border-bottom:1px solid #F1F5F9;color:#374151}.badge{display:inline-block;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:600}.bg{background:#DCFCE7;color:#16A34A}.by{background:#FEF9C3;color:#CA8A04}.br{background:#FEE2E2;color:#DC2626}.alerta{background:#FEF9C3;border-left:3px solid #F59E0B;padding:9px 12px;border-radius:0 8px 8px 0;font-size:12px;color:#92400E;margin-bottom:7px}.ok{background:#DCFCE7;border-left:3px solid #4ADE80;padding:9px 12px;border-radius:0 8px 8px 0;font-size:12px;color:#166534;margin-bottom:7px}.footer{margin-top:28px;padding-top:14px;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between;font-size:10px;color:#94A3B8}@media print{body{background:#fff}.page{padding:16px}}</style></head><body>
<div class="header"><div class="logo">Luia<span>✦</span></div><div class="h-info"><div class="h-nome">${nome}</div><div class="h-sub">${objetivo} · ${diasProva} dias para a prova</div><div class="h-data">Gerado em ${dataGer}</div><div class="periodo">${periodoLabel}</div></div></div>
<div class="page">
<section><h2>Resumo geral</h2><div class="grid4"><div class="sc"><div class="sv">${totalSess}</div><div class="sl">Sessões</div></div><div class="sc"><div class="sv">${horasStr}</div><div class="sl">Horas</div></div><div class="sc"><div class="sv">${totalQ}</div><div class="sl">Questões</div></div><div class="sc"><div class="sv">${pctAcertos}%</div><div class="sl">Acertos</div></div></div></section>
<section><h2>Projeção de prontidão</h2><div class="pcard"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:12px;color:#64748B;margin-bottom:3px">Índice estimado</div><div style="font-family:'Poppins',sans-serif;font-size:1.8rem;font-weight:800;color:${corPront}">${prontidao}%</div></div><div style="font-size:11px;color:#94A3B8;max-width:180px;line-height:1.5;text-align:right">${textoPront}</div></div><div class="pbar"><div class="pbfill" style="width:${prontidao}%;background:${corPront}"></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px"><div style="text-align:center"><div style="font-size:12px;font-weight:700;color:#6D28D9">${pctAcertos}%</div><div style="font-size:9px;color:#94A3B8">Acertos</div></div><div style="text-align:center"><div style="font-size:12px;font-weight:700;color:#6D28D9">${pctPlano}%</div><div style="font-size:9px;color:#94A3B8">Plano</div></div><div style="text-align:center"><div style="font-size:12px;font-weight:700;color:#6D28D9">${Math.round(Math.min(100,sessPorSemana/5*100))}%</div><div style="font-size:9px;color:#94A3B8">Consistência</div></div><div style="text-align:center"><div style="font-size:12px;font-weight:700;color:#6D28D9">${revScore}%</div><div style="font-size:9px;color:#94A3B8">Revisões</div></div></div></div></section>
<section><h2>Desempenho por matéria</h2>${Object.entries(porMat).sort((a,b)=>{const pa=a[1].acertos/(a[1].acertos+a[1].erros||1);const pb=b[1].acertos/(b[1].acertos+b[1].erros||1);return pb-pa;}).map(([mat,d])=>{const t=d.acertos+d.erros;const p=t>0?Math.round(d.acertos/t*100):0;const c=p>=80?'#4ADE80':p>=60?'#FBBF24':'#F87171';return `<div class="mrow"><div class="mnome">${mat}</div><div class="mbar"><div class="mbfill" style="width:${p}%;background:${c}"></div></div><div class="mpct" style="color:${c}">${p}%</div><div class="mq">${t}q</div></div>`;}).join('')}${Object.keys(porMat).length===0?'<p style="font-size:12px;color:#94A3B8">Nenhuma sessão no período.</p>':''}</section>
${simFilt.length>0?`<section><h2>Simulados</h2><table><thead><tr><th>Data</th><th>Matéria</th><th>Tópico</th><th>Nível</th><th>Resultado</th></tr></thead><tbody>${simFilt.map(s=>{const c=s.pct>=80?"bg":s.pct>=60?"by":"br";return "<tr><td>"+fmtDate(s.data)+"</td><td>"+s.materia+"</td><td>"+s.topico+"</td><td>"+s.nivel+"</td><td><span class=\"badge "+c+"\">"+s.pct+"% ("+s.acertos+"/"+s.total+")</span></td></tr>";}).join("")}</tbody></table></section>`:""}
<section><h2>Revisões &amp; Alertas</h2>${revAtrasadas>0?`<div class="alerta">${revAtrasadas} revisão(ões) atrasada(s).</div>`:`<div class="ok">Revisões em dia!</div>`}${streak>=5?`<div class="ok">Sequência de ${streak} dias estudando!</div>`:streak>0?`<div class="alerta">Streak: ${streak} dia(s). Meta: 5 dias seguidos.</div>`:""}${negligenciadas.length>0?`<div class="alerta">Sem estudo no período: ${negligenciadas.join(", ")}.</div>`:""}${pctPlano<50?`<div class="alerta">Plano cumprido: ${pctPlano}%.</div>`:pctPlano>=80?`<div class="ok">Plano: ${pctPlano}% cumprido!</div>`:""}</section>
<div class="footer"><span>Luia — Plataforma de estudos</span><span>Gerado em ${dataGer}</span></div>
</div><script>window.onload=()=>setTimeout(()=>window.print(),500)<\/script></body></html>`;
  win.document.write(html);
  win.document.close();
}