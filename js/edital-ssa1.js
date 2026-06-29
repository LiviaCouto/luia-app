// ═══════════════════════════════════════════════════════
//  EDITAL SSA 1 · UPE · TRIÊNIO 2026/2028
//  Extraído do Manual do Candidato — Edital DPSA/CPCA Nº 04/2026
//  Prova: 06/12/2026 (Dia 1) e 13/12/2026 (Dia 2)
// ═══════════════════════════════════════════════════════

const EDITAL_SSA1 = {

  id: 'ssa1',
  nome: 'SSA 1 · UPE 2026',
  instituicao: 'Universidade de Pernambuco — UPE',
  descricao: 'Sistema Seriado de Avaliação — 1ª Fase · Triênio 2026/2028',
  dataProva1: '2026-12-06',   // Dia 1: Linguagens + Ciências Humanas
  dataProva2: '2026-12-13',   // Dia 2: Matemática + Ciências da Natureza
  totalQuestoes: 90,
  duracaoPorDia: '4 horas',
  horario: 'Manhã',

  // ── ÁREAS E PESOS ──────────────────────────────────────
  areas: [
    { id: 'linguagens',   nome: 'Linguagens e suas Tecnologias',       questoes: 23, dia: 1, cor: '#C084FC' },
    { id: 'humanas',      nome: 'Ciências Humanas e Sociais Aplicadas', questoes: 22, dia: 1, cor: '#FB923C' },
    { id: 'matematica',   nome: 'Matemática e suas Tecnologias',        questoes: 22, dia: 2, cor: '#FBBF24' },
    { id: 'natureza',     nome: 'Ciências da Natureza e suas Tecnologias', questoes: 23, dia: 2, cor: '#4ADE80' }
  ],

  // ── LEITURAS OBRIGATÓRIAS ──────────────────────────────
  // Foco SSA 1: Barroco + Arcadismo + Literatura Pernambucana + Africana
  leituras: [
    {
      id: 'lr1',
      titulo: 'Marília de Dirceu & Cartas Chilenas',
      autor: 'Tomás Antônio Gonzaga',
      editora: 'Ática', ano: 2019,
      estilo: 'Arcadismo',
      area: 'linguagens',
      prioridade: 'alta',
      dica: 'Arcadismo brasileiro. Gonzaga é Dirceu, Marília é sua amada. Cartas Chilenas é sátira social.'
    },
    {
      id: 'lr2',
      titulo: 'Poemas Escolhidos',
      autor: 'Gregório de Matos',
      editora: 'Companhia das Letras', ano: 2011,
      estilo: 'Barroco',
      area: 'linguagens',
      prioridade: 'alta',
      dica: 'Barroco brasileiro. "Boca do Inferno" — sátira, religiosidade, antítese, cultismo e conceptismo.'
    },
    {
      id: 'lr3',
      titulo: 'Boca do Inferno',
      autor: 'Ana Miranda',
      editora: 'Companhia das Letras', ano: 2019,
      estilo: 'Romance histórico — Barroco',
      area: 'linguagens',
      prioridade: 'alta',
      dica: 'Romance sobre Gregório de Matos na Bahia colonial. Contexto histórico do Barroco.'
    },
    {
      id: 'lr4',
      titulo: 'O Karaíba: uma História do pré-Brasil',
      autor: 'Daniel Munduruku',
      editora: 'Melhoramentos', ano: 2018,
      estilo: 'Literatura indígena contemporânea',
      area: 'linguagens',
      prioridade: 'media',
      dica: 'Literatura indígena. Pré-história do Brasil. Cosmovisão Tupinambá.'
    },
    {
      id: 'lr5',
      titulo: 'Cronistas do Descobrimento',
      autor: 'Olivieri, Antonio Carlos; Villa, Marco Antonio (orgs.)',
      editora: 'Ática', ano: 2019,
      estilo: 'Literatura de informação — Quinhentismo',
      area: 'linguagens',
      prioridade: 'media',
      dica: 'Textos dos primeiros cronistas: Pero Vaz de Caminha, Pero de Magalhães Gândavo, etc.'
    },
    {
      id: 'lr6',
      titulo: 'Autos e Farsas de Gil Vicente',
      autor: 'Gil Vicente',
      editora: 'Melhoramentos', ano: 2012,
      estilo: 'Teatro medieval português — Trovadorismo/Humanismo',
      area: 'linguagens',
      prioridade: 'media',
      dica: 'Teatro de Gil Vicente: Auto da Barca do Inferno, Farsa de Inês Pereira. Crítica social e religiosa.'
    }
  ],

  // ── PROGRAMA COMPLETO POR ÁREA ──────────────────────────

  programa: {

    // ════════════════════════════════════
    //  LINGUAGENS E SUAS TECNOLOGIAS
    // ════════════════════════════════════
    linguagens: {
      materias: ['Língua Portuguesa', 'Literatura', 'Língua Inglesa', 'Língua Espanhola', 'Arte', 'Educação Física'],
      topicos: [
        // ── LÍNGUA PORTUGUESA ──
        {
          id: 'lp1', materia: 'Língua Portuguesa',
          titulo: 'Campo jornalístico-midiático',
          subtopicos: [
            'Gêneros jornalísticos: condições de produção, circulação e recepção',
            'Leitura crítica de mídias: autor, formato, público, conteúdo e propósito',
            'Checagem de fatos e fotos — fake news',
            'Visões de mundo e ideologias em textos midiáticos',
            'Fenômenos de efeito bolha e manipulação na internet',
            'Curadoria em redes sociais'
          ]
        },
        {
          id: 'lp2', materia: 'Língua Portuguesa',
          titulo: 'Campo da vida pessoal e culturas juvenis',
          subtopicos: [
            'Práticas culturais juvenis: slams, batalhas de poesia, intervenções urbanas',
            'Linguagem para compartilhar gostos e interesses',
            'Defesa dos Direitos Humanos em práticas de linguagem'
          ]
        },
        {
          id: 'lp3', materia: 'Língua Portuguesa',
          titulo: 'Campo da vida pública',
          subtopicos: [
            'Formas não institucionalizadas de participação social',
            'Textos de documentos legais e normativos: direitos e deveres',
            'Contextos de produção de documentos oficiais'
          ]
        },
        {
          id: 'lp4', materia: 'Língua Portuguesa',
          titulo: 'Campo das práticas de estudo e pesquisa',
          subtopicos: [
            'Gêneros de divulgação científica: contexto, organização, multissemiose',
            'Marcas do discurso reportado e citações',
            'Tipos e processos de pesquisa; leitura de gráficos',
            'Fontes confiáveis e não confiáveis; enfoques tendenciosos'
          ]
        },
        {
          id: 'lp5', materia: 'Língua Portuguesa',
          titulo: 'Campo artístico-literário',
          subtopicos: [
            'Gêneros literários: contos, crônicas, fábulas, poemas — funções e figuras de linguagem',
            'Intertextualidade e interdiscursividade',
            'Literatura popular e regional pernambucana',
            'Literatura de autoria pernambucana: consagrados e não consagrados',
            'Literatura de autoria pernambucana contemporânea',
            'Macrossistema em língua portuguesa: literatura africana e brasileira',
            'Estéticas BARROCA e ÁRCADE: assimilações, rupturas e permanências',
            'Recursos estilísticos do Barroco e do Arcadismo em múltiplos textos'
          ]
        },
        {
          id: 'lp6', materia: 'Língua Portuguesa',
          titulo: 'Análise linguística e semântica',
          subtopicos: [
            'Aspectos semânticos: campo semântico, efeitos de sentido, humor e ironia',
            'Texto argumentativo: tese, tipos de argumentos, parágrafos, estratégias',
            'Multimodalidade: imagens, semioses em textos digitais',
            'Variedades do português brasileiro: dimensões regional, histórica, social',
            'Concordância verbal e nominal; regência verbal e nominal',
            'Níveis da língua: fonético-fonológico, lexical, sintático, semântico'
          ]
        },

        // ── LÍNGUA INGLESA ──
        {
          id: 'ing1', materia: 'Língua Inglesa',
          titulo: 'Leitura e compreensão em inglês',
          subtopicos: [
            'Compreensão e análise de textos em Língua Inglesa',
            'Elementos coesivos e relações lógico-discursivas',
            'Marcas de posição do enunciador; verbos modais como modalizadores',
            'Inferência de sentido de palavras e expressões em contexto',
            'Ideias principais e secundárias em textos'
          ]
        },
        {
          id: 'ing2', materia: 'Língua Inglesa',
          titulo: 'Gramática em inglês',
          subtopicos: [
            'Cognates / False cognates',
            'Plural of Nouns',
            'Personal Pronouns (subject and object)',
            'Verb be — Present, Past and Future (affirmative, negative, interrogative)',
            'Interrogative Pronouns (what, who, where, when, why)',
            'Present Simple; Adverbs of frequency',
            'Present Continuous',
            'Possessive Adjectives, Pronouns, Possessive Case (\'s)',
            'There + be (there is/are, there was/were)',
            'Past Simple (regular and irregular verbs)',
            'Past Continuous',
            'Future with going to; Future with will',
            'Modal verbs (can, could, may, might, shall, should, ought to, will, would)',
            'Conectores: but, however, although, yet, if',
            'Prepositions (in, on, under, at, behind, beside)',
            'Indefinite pronouns (some, any, no)',
            'Quantifiers: much, many, some, any, little, few, less, most',
            'Present Perfect tense',
            'Phrasal verbs',
            'Comparisons'
          ]
        },

        // ── LÍNGUA ESPANHOLA ──
        {
          id: 'esp1', materia: 'Língua Espanhola',
          titulo: 'Leitura e compreensão em espanhol',
          subtopicos: [
            'Compreensão de textos e gêneros discursivos em espanhol',
            'Ideia principal e informações secundárias',
            'Marcadores discursivos e conectores; relações temporais',
            'Estrutura e função social de gêneros discursivos escritos',
            'Variedades linguísticas e aspectos socioculturais dos povos hispanofalantes',
            'Textos argumentativos e injuntivos; conectores na estrutura global',
            'Aspectos culturais e identidade dos países hispanofalantes'
          ]
        },

        // ── ARTE ──
        {
          id: 'art1', materia: 'Arte',
          titulo: 'Função social da Arte',
          subtopicos: [
            'Significado e funções sociais da Arte',
            'Conceitos: estesia, fruição, criação, crítica',
            'Análise de produções artísticas: aspectos estéticos, formais, históricos e culturais',
            'Patrimônio material e imaterial; preservação e educação patrimonial',
            'Diversidade étnica e cultural nas artes'
          ]
        },
        {
          id: 'art2', materia: 'Arte',
          titulo: 'Elementos formais das linguagens artísticas',
          subtopicos: [
            'Linguagem musical: atributos do som; fundamentos da composição',
            'Linguagem visual: fundamentos da composição visual',
            'Linguagem da dança: fatores do movimento e elementos cênicos',
            'Teatro e encenação'
          ]
        },
        {
          id: 'art3', materia: 'Arte',
          titulo: 'Formas expressivas e História da Arte',
          subtopicos: [
            'Técnicas e materiais expressivos nas artes visuais',
            'Gêneros na Dança; Danças pernambucanas',
            'Gêneros musicais urbanos; Ritmos pernambucanos',
            'Gêneros do teatro; Teatro de bonecos em Pernambuco',
            'Arte híbrida: conceito e exemplos',
            'Arte moderna e contemporânea no Brasil e em Pernambuco',
            'Arte Popular em Pernambuco'
          ]
        },

        // ── EDUCAÇÃO FÍSICA ──
        {
          id: 'ef1', materia: 'Educação Física',
          titulo: 'Dança e Luta',
          subtopicos: [
            'História das danças populares, urbanas e de massa',
            'Danças pernambucanas: Frevo, Maracatu Nação, Maracatu de Baque Solto, Cavalo-Marinho, Caboclinho',
            'Fundamentos da dança na perspectiva da cultura corporal',
            'Lutas do Brasil: Capoeira Angola e Regional (história, musicalidade, movimentos)',
            'Luta Corporal Indígena Huka Huka'
          ]
        },
        {
          id: 'ef2', materia: 'Educação Física',
          titulo: 'Esporte, Ginástica e Práticas Corporais',
          subtopicos: [
            'Ginástica de condicionamento físico: aeróbica, musculação, treinamento funcional',
            'Ginástica de competição: Ginástica Artística e Rítmica',
            'Esportes de Marca e de Invasão: Futsal, Handebol, Basquete, Voleibol',
            'Práticas corporais urbanas: Slackline, Skate, Le Parkour',
            'Jogos de Salão: Xadrez, Dama, jogos de tabuleiro'
          ]
        }
      ]
    },

    // ════════════════════════════════════
    //  CIÊNCIAS HUMANAS E SOCIAIS APLICADAS
    // ════════════════════════════════════
    humanas: {
      materias: ['História', 'Geografia', 'Filosofia'],
      topicos: [
        // ── HISTÓRIA ──
        {
          id: 'hi1', materia: 'História',
          titulo: 'Introdução e Pré-História',
          subtopicos: [
            'O ser humano como produtor de história; usos do passado',
            'Fontes históricas: escritas, imagéticas, audiovisuais, orais, artísticas',
            'Tempos e calendários em diferentes contextos históricos',
            'Pré-História: evolução biológica e cultural do ser humano',
            'Povoamento das Américas: teorias e percursos',
            'Povos indígenas do atual território brasileiro',
            'Revolução Neolítica: agricultura, cidades, estado, religiões',
            'O Egito: civilização mediterrânica e africana',
            'O antigo Oriente Médio'
          ]
        },
        {
          id: 'hi2', materia: 'História',
          titulo: 'Civilizações Clássicas',
          subtopicos: [
            'O Mediterrâneo e os contatos entre África, Europa e Ásia',
            'Arte, política e pensamento na Civilização Grega',
            'Arte, política e pensamento na Civilização Romana',
            'Sociedades e religiosidades no Mundo Clássico',
            'Gregos e romanos na África'
          ]
        },
        {
          id: 'hi3', materia: 'História',
          titulo: 'Europa Medieval (séculos IV–XV)',
          subtopicos: [
            'Fim do Mundo Clássico e Tardo-Antiguidade',
            'Arte, política e pensamento na Europa Medieval',
            'Sociedades e religiosidades na Idade Média',
            'Cidades e comércio na Europa e na Afro-Ásia'
          ]
        },
        {
          id: 'hi4', materia: 'História',
          titulo: 'Império Muçulmano',
          subtopicos: [
            'Origens do mundo islâmico: fatores culturais, sociais e teológicos',
            'Sociedades islâmicas na Idade Média',
            'Os viajantes na Idade Média: era de descobrimentos mútuos',
            'Relações islâmicas com culturas não-islâmicas'
          ]
        },

        // ── GEOGRAFIA ──
        {
          id: 'ge1', materia: 'Geografia',
          titulo: 'Introdução e conceitos fundamentais',
          subtopicos: [
            'A Geografia e o estudo das paisagens naturais e culturais',
            'Princípios clássicos da Geografia',
            'Espaço Geográfico, Território, Região, Paisagem, Lugar',
            'Relações Natureza e Sociedade; Geossistema',
            'Escala geográfica; impacto ambiental',
            'Riscos e desastres naturais e sociais',
            'Patrimônio Material e Imaterial; Biodiversidade',
            'Desenvolvimento sustentável; Serviços Ecossistêmicos'
          ]
        },
        {
          id: 'ge2', materia: 'Geografia',
          titulo: 'Cartografia',
          subtopicos: [
            'Coordenadas geográficas',
            'Componentes e tipos de mapas e cartas',
            'Escalas cartográficas; projeções cartográficas; legenda',
            'Sensoriamento remoto: imagens de satélite e radar',
            'Representação tridimensional das paisagens'
          ]
        },
        {
          id: 'ge3', materia: 'Geografia',
          titulo: 'Relações Terra-Sol e Geografia da Natureza',
          subtopicos: [
            'Movimentos da Terra e suas consequências geográficas',
            'Energia solar: efeitos, consequências e sustentabilidade',
            'Estrutura interna do planeta; geoesferas; placas litosféricas',
            'Compartimentação do relevo terrestre; morfoesculturas e morfoestruturas',
            'Formação e caracterização de rochas e solos',
            'Condições climáticas: tempo e clima; tipologia dos climas; mudanças climáticas',
            'Recursos hídricos: bacias hidrográficas, oceanos, águas subterrâneas',
            'Biosfera: biomas e formações vegetais; conservação'
          ]
        },

        // ── FILOSOFIA ──
        {
          id: 'fi1', materia: 'Filosofia',
          titulo: 'Introdução à Filosofia e Filosofia Grega',
          subtopicos: [
            'Filosofia: origem, contexto histórico, conceitos e características',
            'Filosofia, Mito, Ciência e Senso Comum',
            'Os Pré-Socráticos e a Filosofia da natureza',
            'Sócrates, Platão e Aristóteles',
            'Ética, Valores e Sociedade',
            'Cidadania, Democracia e Liberdade'
          ]
        },
        {
          id: 'fi2', materia: 'Filosofia',
          titulo: 'Filosofias Modernas',
          subtopicos: [
            'O Renascimento: paradigmas e rupturas',
            'Empirismo (Locke) e Racionalismo (Descartes)',
            'Positivismo; Iluminismo; Marxismo',
            'Escola de Frankfurt / Teoria Crítica',
            'Indústria Cultural e Cultura de Massa',
            'Ética do Discurso e Razão Comunicativa'
          ]
        },
        {
          id: 'fi3', materia: 'Filosofia',
          titulo: 'Filosofia e questões contemporâneas',
          subtopicos: [
            'Mídias, Sociedade e Cidadania',
            'Mídias Digitais e Produção de Verdades (Fake News)',
            'Trabalho, Ideologia e Alienação',
            'Neoliberalismo, Globalização e Cidadania',
            'Ciência, Tecnologia e Mundo do Trabalho',
            'Identidade, autonomia e ancestralidade'
          ]
        }
      ]
    },

    // ════════════════════════════════════
    //  MATEMÁTICA E SUAS TECNOLOGIAS
    // ════════════════════════════════════
    matematica: {
      materias: ['Matemática'],
      topicos: [
        {
          id: 'ma1', materia: 'Matemática',
          titulo: 'Números e Álgebra',
          subtopicos: [
            'Números reais: conceitos, subconjuntos, representações, reta real',
            'Sistema cartesiano ortogonal',
            'Razão e proporção: taxas, índices, proporcionalidade direta e inversa',
            'Expressões algébricas: valor numérico',
            'Equações do 1º grau e representações geométricas',
            'Equações do 2º grau e representações geométricas',
            'Sistemas de equações do 1º e 2º grau'
          ]
        },
        {
          id: 'ma2', materia: 'Matemática',
          titulo: 'Funções',
          subtopicos: [
            'Conceito de função: relação entre grandezas; domínio, imagem, crescimento/decrescimento',
            'Função afim (1º grau): raízes, proporcionalidade, gráficos, coeficientes',
            'Função quadrática (2º grau): raízes, gráficos, máximo/mínimo, coeficientes',
            'Função exponencial: conceito, domínio, imagem, gráficos, equações exponenciais',
            'Progressão Aritmética (PA): termo geral, soma de n termos, relação com função afim',
            'Progressão Geométrica (PG): termo geral, soma, produto, PG infinita decrescente, relação com exponencial'
          ]
        },
        {
          id: 'ma3', materia: 'Matemática',
          titulo: 'Geometria e Medidas',
          subtopicos: [
            'Conversão de unidades: comprimento, massa, capacidade, volume, temperatura, velocidade',
            'Notação científica; ordem de grandeza; algarismos significativos',
            'Grandezas determinadas por razão ou produto de outras',
            'Área e perímetro de figuras planas (segmentos e arcos de circunferência)',
            'Volume de paralelepípedo retangular reto'
          ]
        },
        {
          id: 'ma4', materia: 'Matemática',
          titulo: 'Probabilidade e Estatística',
          subtopicos: [
            'Gráficos, infográficos e tabelas: leitura e interpretação',
            'Medidas de tendência central: média, moda, mediana',
            'Medidas de dispersão: amplitude, variância, desvio padrão'
          ]
        }
      ]
    },

    // ════════════════════════════════════
    //  CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS
    // ════════════════════════════════════
    natureza: {
      materias: ['Biologia', 'Química', 'Física'],
      topicos: [
        // ── BIOLOGIA ──
        {
          id: 'bi1', materia: 'Biologia',
          titulo: 'Metodologia Científica e Bioquímica',
          subtopicos: [
            'Metodologia científica: importância, etapas, resolução de problemas',
            'Água e sais minerais: composição molecular e função',
            'Carboidratos: composição, classificação e função',
            'Lipídios: composição, classificação e função',
            'Proteínas: composição, classificação e função',
            'Ácidos nucleicos: composição, classificação e função',
            'Vitaminas: fontes naturais e avitaminoses'
          ]
        },
        {
          id: 'bi2', materia: 'Biologia',
          titulo: 'Origem da Vida e Citologia',
          subtopicos: [
            'Hipóteses e teorias sobre a origem da vida',
            'Surgimento dos primeiros seres vivos',
            'Evolução e diversificação biológica',
            'Características e níveis de organização dos seres vivos',
            'Estruturas e funções celulares em procariotos e eucariotos',
            'Organelas e suas interações; membranas e envoltórios',
            'Permeabilidade celular; endocitose e exocitose',
            'Metabolismo energético: Fotossíntese, Respiração, Quimiossíntese, Fermentação',
            'Divisão celular: binária, mitose, meiose',
            'Controle gênico: replicação, transcrição, código genético, tradução'
          ]
        },
        {
          id: 'bi3', materia: 'Biologia',
          titulo: 'Reprodução, Embriologia e Histologia',
          subtopicos: [
            'Reprodução assexuada e sexuada',
            'Fecundação; segmentação, blastulação, gastrulação e organogênese',
            'Tecidos epiteliais, conjuntivos, musculares e nervoso'
          ]
        },
        {
          id: 'bi4', materia: 'Biologia',
          titulo: 'Aspectos Sociais da Biologia',
          subtopicos: [
            'Transtornos alimentares: anorexia, bulimia',
            'Transtornos psicológicos: ansiedade, depressão, síndrome do pânico',
            'Uso de drogas lícitas e ilícitas: álcool, cigarros, esteroides',
            'ISTs: HIV, sífilis e outras',
            'Puberdade e sexualidade na adolescência',
            'Diversidade sexual: orientação sexual e identidade de gênero',
            'Primeiros socorros: vias aéreas, mal súbito, choque elétrico, picadas'
          ]
        },
        {
          id: 'bi5', materia: 'Biologia',
          titulo: 'Ecologia e Meio Ambiente',
          subtopicos: [
            'Relações intraespecíficas e interespecíficas',
            'Estrutura dos ecossistemas; fluxo de energia; ciclos biogeoquímicos',
            'Cadeia e teia alimentar; níveis tróficos',
            'Ações antrópicas; poluição ambiental; eutrofização; bioacumulação',
            'Mudanças climáticas e impacto nos ecossistemas',
            'Espécies exóticas e invasoras',
            'Desenvolvimento sustentável; conservação da biodiversidade'
          ]
        },

        // ── QUÍMICA ──
        {
          id: 'qu1', materia: 'Química',
          titulo: 'Propriedades da Matéria e Estrutura Atômica',
          subtopicos: [
            'Estados físicos e mudanças de estado; transformações físicas e químicas',
            'Átomos e elementos químicos; isótopos',
            'Modelos atômicos: Dalton, Thomson, Rutherford e Bohr',
            'Classificação periódica dos elementos',
            'Substâncias simples e compostas; substância pura e misturas; alotropia',
            'Ligações químicas: iônica, covalente e metálica',
            'Fórmulas químicas; fórmula estrutural de compostos orgânicos',
            'Misturas e separação de misturas',
            'Funções químicas: ácidos, bases, sais e óxidos',
            'Conceito de ácidos e bases (Brönsted-Lowry e Lewis)',
            'Radioatividade: isótopos radioativos, meia-vida, datação por carbono-14'
          ]
        },
        {
          id: 'qu2', materia: 'Química',
          titulo: 'Transformações Químicas',
          subtopicos: [
            'Reações e equações químicas; balanceamento',
            'Quantidade de matéria (mol) e cálculo estequiométrico',
            'Pureza e rendimento; cálculo estequiométrico com gases (CNTP, volume molar)',
            'Polímeros naturais e sintéticos: propriedades, usos e impacto ambiental',
            'Carboidratos, aminoácidos e proteínas; lipídios; vitaminas',
            'Hormônios e anabolizantes; fármacos; contraceptivos',
            'Mediadores químicos: endorfina, dopamina, serotonina, ocitocina',
            'Biossíntese e fotossíntese (abordagem química)',
            'Ciclos biogeoquímicos: carbono, nitrogênio, oxigênio, enxofre, fósforo'
          ]
        },

        // ── FÍSICA ──
        {
          id: 'fi1f', materia: 'Física',
          titulo: 'Fundamentos e Cinemática',
          subtopicos: [
            'Ordem de grandeza e notação científica',
            'Sistema Internacional de Unidades (SI)',
            'Escalas e gráficos; grandezas escalares e vetoriais',
            'Operações básicas com vetores',
            'Movimento e repouso: posição, tempo, velocidade',
            'Movimento Uniforme (MU) e Movimento Uniformemente Variado (MUV)',
            'Lançamento vertical',
            'Movimento relativo; movimento parabólico (lançamento horizontal e oblíquo)',
            'Movimento circular; MCU: velocidade tangencial e angular; aceleração centrípeta',
            'Movimento circular uniformemente acelerado: aceleração tangencial e resultante'
          ]
        },
        {
          id: 'fi2f', materia: 'Física',
          titulo: 'Dinâmica e Gravitação',
          subtopicos: [
            'Leis de Newton',
            'Sistemas de referência inerciais e não inerciais',
            'Força de atrito, peso, normal, tração e força centrípeta',
            'Leis de Kepler',
            'Lei da atração universal dos corpos',
            'Satélites naturais e artificiais',
            'Teoria geral da relatividade de Einstein (aceleração da gravidade)'
          ]
        },
        {
          id: 'fi3f', materia: 'Física',
          titulo: 'Hidrostática e Energia',
          subtopicos: [
            'Pressão hidrostática e manômetros',
            'Teorema de Stevin; experimento de Torricelli; pressão atmosférica',
            'Vasos comunicantes; Teorema de Pascal; prensa hidráulica',
            'Teorema de Arquimedes; flutuação e estabilidade',
            'Trabalho de uma força; conceito de energia; potência',
            'Energia cinética; energia potencial elástica e gravitacional',
            'Forças conservativas e dissipativas; conservação da energia mecânica',
            'Centro de massa; quantidade de movimento; conservação do momento',
            'Teorema do Impulso; choques mecânicos'
          ]
        }
      ]
    }
  },

  // ── CRONOGRAMA BASE ────────────────────────────────────
  // 160 dias · 06/07/2026 → 06/12/2026
  // Distribuição sugerida por semana com base no peso na prova
  cronogramaBase: {
    totalDias: 160,
    inicio: '2026-07-06',
    fim: '2026-12-06',
    // Pesos de estudo por área (não são os pesos da prova, são sugestão de horas)
    distribuicao: {
      linguagens:  0.30,  // 30% — maior volume de conteúdo (6 matérias)
      humanas:     0.25,  // 25% — História + Geografia + Filosofia
      matematica:  0.25,  // 25% — exige mais prática diária
      natureza:    0.20   // 20% — Biologia + Química + Física
    }
  }
};

// ── HELPERS ────────────────────────────────────────────

/**
 * Retorna todos os tópicos de uma área
 */
function getTopicosArea(areaId) {
  return EDITAL_SSA1.programa[areaId]?.topicos || [];
}

/**
 * Retorna todas as matérias distintas do edital SSA 1
 */
function getMateriasSSA1() {
  return [
    // Linguagens
    'Língua Portuguesa', 'Literatura', 'Língua Inglesa', 'Língua Espanhola',
    'Arte', 'Educação Física',
    // Humanas
    'História', 'Geografia', 'Filosofia',
    // Matemática
    'Matemática',
    // Ciências da Natureza
    'Biologia', 'Química', 'Física'
  ];
}

/**
 * Retorna a área de uma matéria
 */
function getAreaDaMateria(materia) {
  const map = {
    'Língua Portuguesa': 'linguagens', 'Literatura': 'linguagens',
    'Língua Inglesa': 'linguagens', 'Língua Espanhola': 'linguagens',
    'Arte': 'linguagens', 'Educação Física': 'linguagens',
    'História': 'humanas', 'Geografia': 'humanas', 'Filosofia': 'humanas',
    'Matemática': 'matematica',
    'Biologia': 'natureza', 'Química': 'natureza', 'Física': 'natureza'
  };
  return map[materia] || null;
}

/**
 * Dias até a prova a partir de hoje
 */
function diasAteSSA1() {
  const hoje = new Date();
  const prova = new Date('2026-12-06T00:00:00');
  return Math.ceil((prova - hoje) / (1000 * 60 * 60 * 24));
}

/**
 * Para simulados: retorna tópicos formatados por matéria (compatível com SIM_TOPICOS)
 */
function getSIMTopicosSSA1() {
  const result = {};
  Object.values(EDITAL_SSA1.programa).forEach(area => {
    area.topicos.forEach(topico => {
      const mat = topico.materia;
      if (!result[mat]) result[mat] = [];
      // Adiciona o título do tópico
      result[mat].push(topico.titulo);
      // Adiciona subtópicos relevantes (primeiros 5 para não sobrecarregar o select)
      topico.subtopicos.slice(0, 5).forEach(sub => {
        if (!result[mat].includes(sub)) result[mat].push(sub);
      });
    });
  });
  // Adiciona "Todos os tópicos" em cada matéria
  Object.keys(result).forEach(mat => {
    result[mat] = ['Todos os tópicos de ' + mat, ...result[mat]];
  });
  // Misto
  result['Misto (todas)'] = ['Todos os tópicos'];
  return result;
}
