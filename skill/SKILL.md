---
name: "dashboard-vista-polo"
description: "Contexto completo e método do Dashboard Polo (Polo Residencial, Vista CRM no BigQuery, imobiliaria_id 1005). Use ao criar, ajustar, validar, explicar ou publicar qualquer indicador, aba ou gráfico do painel da Polo."
---

# Dashboard Polo (Polo Residencial · Vista CRM · BigQuery)

## Quem é quem
- **CreativeImob**: assessoria de growth marketing imobiliário (Vila Leopoldina, SP). Usuário: Paulo (paulo@creativeimob.com), equipe de **Data & BI**.
- **Polo Residencial**: cliente. "Boutique Imobiliária" de alto padrão, desde 2021, fundadores no mercado desde 2007. CRECI 044523-J. Escritório: Av. Dr. Chucri Zaidan, 1550, conj. 503, Brooklin Novo, São Paulo. Site https://www.poloresidencial.com.br/ (feito pela Lead Link). Atendimento por "Personal Brokers", foco em discrição e no tempo do cliente.
  - Região: Zona Sul e Oeste de SP. Bairros principais: Brooklin, Campo Belo, Moema, Vila Olímpia, Chácara Santo Antônio, Granja Julieta, Itaim Bibi, Vila Nova Conceição, Alto da Boa Vista, Vila Clementino.
  - Produto: apartamentos de 107 a 250 m², em geral 3 suítes, R$ 2,1 a 5,7 mi nos destaques. Vitrines: Exclusivos, Destaques, Lançamentos. Códigos de imóvel `PR` + número (ex.: PR59193).
  - Frentes: **Venda** (núcleo, revenda e lançamentos; parceiros Cyrela, Helbor, Tegra, Eztec, Adolpho Lindenberg, Lucio, AW Realty, Gamaro, Mac, Bolsa de Imóveis); **Polo Select** (programa de exclusividade: avaliação, fotos/drone/tour, marketing, divulgação em imobiliárias parceiras de alto padrão, consultor único, suporte jurídico); **Locação e administração** (contrato, vistoria, cobrança, repasse, reajuste, renovação, rescisão); **parceria com corretores externos**.
  - Marca: preto, vermelho e branco; logo "P/R" em quadrantes (pretos em cima à esquerda e embaixo à direita, vermelhos nos outros dois, quadrado branco central com "P" preto e "R" vermelho, serifado).
- **Vista CRM**: origem dos dados (corretores cadastram leads, movem cards por etapa, registram atividades).
- **Power BI atual do cliente** ("Dashboard Polo - Desempenho", fundo escuro preto/vermelho): páginas Visão Geral, Performance, Exploração, Comparativo, Financeiro, Metas. É a **fonte da verdade**: nenhum número vale até bater com ele.

## Estado atual (24/10/2026, 14h) — ler primeiro
- **Entrega oficial = site com senha no GitHub Pages** (decisão do usuário em 24/10/2026): repositório público `paulollaque12/creativeimob-polo-crm` (branch `main`, Pages em `/docs`).
  - **Endereço oficial: https://polo.creativeimob.app** (domínio próprio desde 24/10/2026, igual ao dashboard performance). DNS na GoDaddy (zona creativeimob.app, NS domaincontrol.com): registro CNAME `polo` → `paulollaque12.github.io`; `docs/CNAME` com `polo.creativeimob.app`; HTTPS ativado pelo usuário em Settings → Pages ("Enforce HTTPS"; `.app` só abre com HTTPS). O endereço github.io (https://paulollaque12.github.io/creativeimob-polo-crm/) redireciona para o domínio. Se o GitHub disser "InvalidDNSError" logo após criar o registro, é só cache: conferir com https://dns.google/resolve?name=polo.creativeimob.app&type=CNAME e mandar "Check again"/remover e salvar o domínio de novo.
  - **Dashboard Polo na raiz do site** (`docs/index.html` + `docs/data.enc.json`, cubo cifrado com AES-GCM/PBKDF2-SHA256 250k, **sem compressão** desde 24/10 — ~291 KB — porque navegadores antigos, ex. iOS < 16.4, não têm `DecompressionStream` e davam "Senha incorreta" com qualquer senha). O endereço antigo `/painel/` (`docs/painel/index.html`) só redireciona para a raiz.
  - Ícone da CreativeImob (o mesmo do dashboard performance): `docs/favicon.ico`, `docs/favicon-32.png`, `docs/apple-touch-icon.png` (copiados de `paulollaque12/creativeimob-performance-midia/docs`), links inseridos pelo `tools/montar.py` (constante `ICONES`).
  - **Tema escuro é o padrão** (pedido em 24/10/2026); o botão Tema alterna e salva em `localStorage` `polo-tema`. **Gráficos em vermelho Polo** (pedido em 24/10/2026): `--bar` #b0121c (claro) / #cf2530 (escuro), `--barsoft` #e8c3c5 / #5c1d21; paleta da Participação `PALS = ['var(--red)','#7c0e15','#e0767c','#8d8984','#f0b3b6','#5e5b57','#c9c6c1']`.
  - **Ranking da TV fora do site** (pedido do usuário em 24/10/2026: "isolemos só o dashboard da Polo, o ranking deixemos pra depois"): guardado em `ranking/index.html` + `ranking/data.enc.json`, que o Pages não publica (só serve `docs/`). Para voltar, gerar em `docs/ranking/` no `tools/montar.py`.
  - **Dados de 01/01/2026 até D-1** (decisão do usuário em 24/10/2026; cubo v4 corta em ontem, horário de São Paulo).
  - Tela de senha em tela cheia preta, no mesmo estilo da do ranking (pedido do usuário). Mesma senha para as duas páginas. **No painel a senha é pedida a cada abertura** (fica só em `sessionStorage`, `__poloCfg.lembrar = false`; ao abrir, apaga o antigo `localStorage` `polo-tv-senha`), porque o usuário estranhou o painel abrir direto sem a tela. Na TV continua salva em `localStorage`. `?sair` na URL apaga a senha salva. Erro de navegador (sem Web Crypto etc.) mostra "Este navegador não conseguiu abrir os dados…" em vez de "Senha incorreta" (só `OperationError` = senha errada). O usuário conhece a senha: NUNCA gravá-la em arquivo, commit, mensagem ou skill, nem digitá-la num site pelo navegador (é o usuário quem digita). A única exceção é o prompt da tarefa agendada (modelo da Gralha, pedido do usuário).
  - **Tarefa agendada "Atualizar Dashboard Polo"** (criada 24/10/2026, pedido do usuário "todo dia 07:00 D-1, igual modelo da Gralha"): `CRON_TZ=America/Sao_Paulo 37 6 * * *` (06:37; 7h em ponto evitado por fila), roda na nuvem com o conector BigQuery, segue o `ATUALIZAR.md` do repo (clone → `sql/painel-cubo.sql` → `tools/cifrar.py --painel` com conferência → commit só de `docs/data.enc.json` "dados ate AAAA-MM-DD" → push → confirmar "pages build and deployment"). Id `trig_01FLPo5FHSLQ7hgSs1y1WQoA`, aprovação automática, modelo claude-opus-5-5; primeira execução 25/10/2026. Outras rotinas do usuário: Gralha espelho 06:52, Gralha equipes 07:21, mídia 07:51.
  - `tools/cifrar.py --painel` só grava se: `ref` = hoje; nenhum dado depois de ontem; consegue abrir o arquivo publicado com a mesma senha (senão para: senha errada); nenhuma métrica m0..m9 (com ≥ 50 linhas) cai mais de 2%. Mostra o último dia de leads/atendimento/venda e avisa se leads não chegaram até ontem (publica mesmo assim). `--sem-comparar` pula a comparação (só para reconstruir do zero).
  - Dados publicados até 23/10/2026 (cubo v4 gerado em 24/10).
  - O repo tem `README.md`, `ATUALIZAR.md` (passo a passo da rotina), `skill/SKILL.md` (cópia desta skill), `fonte/` (painel-ui.html, ranking-tv-ui.html, core.js, estatico.js, estatico-painel.js, fotos-exemplo.js), `sql/` (painel-cubo.sql, ranking-tv.sql), `tools/` (montar.py, cifrar.py), `docs/` (site: painel) e `ranking/` (fora do site).
- Os artefatos do claude.ai (abaixo) ficaram como versões antigas: o do painel baixa o cubo inteiro (~470 KB) pelo conector e pode ficar carregando sem fim, como aconteceu com o ranking. Não são a entrega ao cliente.
- **Painel ao vivo (artefato Claude)**: https://claude.ai/artifact/8yFJyEP1FQ6uHEei8FuaTo (versão 2, comentário `<!-- v2026-10-15b fontes Sora + Manrope -->`). Privado do Paulo; para outros abrirem é preciso compartilhar pelo menu da página, e cada pessoa precisa do conector "Google Cloud BigQuery" com acesso ao projeto `vistaprocessos`.
- Capacidade declarada: `{"mcp": {"servers": [{"server": "Google Cloud BigQuery", "tools": ["execute_sql_readonly", "get_query_results"]}]}}`. Ao republicar sem `capabilities`, a declaração é mantida.
- **Fonte de verdade do código = o repositório** `paulollaque12/creativeimob-polo-crm` (`fonte/painel-ui.html` com marcadores `/*@@CORE@@*/` e `/*@@SQL@@*/""`, `fonte/core.js`, `sql/painel-cubo.sql`; `tools/montar.py` gera as páginas). O SQL e o motor completos também estão no fim desta skill.

## Bases (BigQuery)
- Projeto `vistaprocessos`, dataset `nitro_dados`, location **us-east1** (usar em `get_query_results`). Conector: `execute_sql_readonly` com `projectId: vistaprocessos`.
- **Id da Polo: `imobiliaria_id = 1005`** (Gralha = 1). Tabela `nitro_dados.imobiliarias` (id 1005, nome "Polo Residencial"). Há outras imobiliárias com outros ids no mesmo dataset: sempre filtrar.
- Views da Polo (mesma estrutura das views da Gralha, só mudam as etapas):
  - `vw_consolidado_clientes_capturados_polo` (c, leads): `Data` é TIMESTAMP → usar `DATE(Data)`. Colunas úteis: CodigoCliente, nome_usuario (corretor), veiculocaptacao_dn, bairro_imovel, categoria_imovel, Dormitorios, AreaPrivativa (BIGNUMERIC), `operacao` (sempre 'Venda', constante na view). Dados desde 02/08/2022; ~8,7 mil linhas, 8,2 mil clientes; ~580 linhas duplicadas (cliente com mais de um corretor) → contar `COUNT(DISTINCT CodigoCliente)`.
  - `vw_consolidado_dados_polo` (d, cards/negócios): `Data` DATE. EtapaAcaoId, Assunto, CodigoNegocio, CodigoCliente, CodigoEmImovel, valornegocio_dn (no 'Negócio ganho' vem do texto da atividade), nome_usuario, veiculocaptacao_dn, bairro_imovel, categoria_imovel, dormitorios_imovel, areaprivativa_imovel, CodigoPipe, nomeetapa_en. ~73,7 mil linhas, 8,6 mil negócios. Há datas futuras (até nov/2026): limitar a `<= CURRENT_DATE()`.
  - `vw_consolidado_historico_polo` (h, atividades): `Data` DATE, Assunto, Statusvisita. ~141 mil linhas; datas futuras até dez/2026. Visita aparece com Statusvisita 'Finalizado'. **O painel não usa h** (a Visita do DAX da Polo vem da etapa 2 em d).
- Tabelas brutas (filtrar `imobiliaria_id = 1005`): `vista_imoveis` (11.338 imóveis; `codigo`, `data_cadastro`, `tem_placa` — só 2 com placa, `status` com Venda/Aluguel/Venda e Aluguel/Suspenso/Vendido Imobiliária/Vendido Terceiros/Alugado Imobiliária/Alugado Terceiros, `codigo_corretor`, `bairro`, `categoria`, `dormitorios`, `area_privativa`, latitude/longitude; última carga vista 04/10/2026), `vista_usuarios` (`codigo`, `nome`, `equipe_nome`), `vista_agencias` (só 1 = "POLO RESIDENCIAL").
- Estrutura comercial: **uma loja** ("POLO RESIDENCIAL") e **uma equipe** ("Polo Residencial"); 21 corretores com leads em 2026 (28 nomes no dicionário, alguns "(Excluído)", e "Administrativo Polo Residencial"). Por isso o painel não tem filtros de Loja nem Equipe.
- Veículos de captação (2026): Instagram Leads (~61%), Facebook Leads, Grupo Zap, C2Sbot, Carteira do corretor, Campanha Própria, CTWA Instagram, Desconhecido, Orgânico, Site Próprio, Campanha Corretor, CTWA Facebook - Anúncios, Corretor Parceiro, Chaves na Mão, Cliente Indicação, Youtube/YouTube (unificados no painel), Indicação etc.

## Pipelines e etapas (EtapaAcaoId, nomeetapa_en)
- **Pipe 1 (principal)**: 17 Pré atendimento (2d) · 9 1º Contato (3d) · 12 Sem Retorno (2d) · 13 Em Atendimento (7d) · 16 Em Atendimento (PRIORIDADE) · 14 Em Agendamento (7d) · 2 Em Visitação (3d) · 3 Proposta (3d) · 4 Fechamento · 10 Futuro (45d) · 11 Captação (15d).
- **Pipe 2 (quase vazio, ~25 movimentos/ano)**: 5 Prospecção · 6 Visita · 7 Proposta · 8 Fechamento.
- Os ids NÃO seguem a Gralha (lá 12 era Fechamento; aqui 12 é Sem Retorno). Nunca reaproveitar regras da Gralha. Nunca usar `nomeetapa_dn`.

## Regras de contagem (DAX do cliente, validadas)
Filtro comum das etapas (view d): `Assunto <> 'Negócio ganho'` e `Assunto <> 'Negócio perdido'` (no SQL: `Assunto IS NULL OR Assunto NOT IN (...)`), `DISTINCTCOUNT(CodigoCliente)`, pela `Data` do evento.
| Etapa do funil | Regra | DAX |
|---|---|---|
| Leads | view c, `COUNT(DISTINCT CodigoCliente)` por `DATE(Data)` | — |
| 1º Contato | EtapaAcaoId = '9' | primeiro_contato_tratado |
| Pré-atendimento | '17' | pre_atendimento_tratado |
| Atendimento | '13','16' | atendimento_tratado |
| Agendamento | '14' | agendamento_tratado |
| Visita | '2' | visitacao_tratado |
| Proposta | '7' (pipe 2) | proposta_tratado |
| Venda | view d, `Assunto IN ('Negócio ganho', 'Negocio Ganho via API')`, `COUNT(DISTINCT CodigoNegocio)` | — |
- A ordem do funil é a do Power BI: Leads, 1º Contato, Pré atendimento, Atendimento, Agendamento, Visita, Proposta, Venda (1º Contato antes do Pré, mesmo sendo o contrário no pipe).
- **Vendas = `Assunto IN ('Negócio ganho', 'Negocio Ganho via API')`** (decisão do usuário em 24/10/2026). 'Via API' tem 2 negócios em 2026 (9710, Maya, R$ 750.000, 03/05, PR53313; 1843, Administrativo Polo Residencial, R$ 3.790.000, 11/06, PR55058); essas linhas não têm EtapaAcaoId, então não mexem nas etapas. Com elas: mai/2026 = 7 vendas / R$ 14,76 mi; jun/2026 = 5 / R$ 14,23 mi. O filtro das etapas continua o do DAX (exclui só 'Negócio ganho' e 'Negócio perdido').
- **Proposta = etapa 7**, como no DAX (confirmado pelo usuário em 24/10/2026), mesmo dando quase sempre 0.
- **VGV (regra do Power BI, confirmada)**: soma de UM valor por imóvel vendido (`MAX(valornegocio_dn)` por `COALESCE(CodigoEmImovel, CodigoNegocio)`), enquanto **Vendas** conta negócios distintos. Ex.: agosto/2026 tem 8 negócios ganhos, mas 10520 e 10635 são o mesmo imóvel PR57379 (Arthur, R$ 2,55 mi, 18/08) → soma por negócio 13.007.000, Power BI 10.457.000. Nos outros meses de 2026 as duas somas coincidem.
- **Ticket médio** = VGV / Vendas (ago/2026: 1.307.125). Por corretor: VGV do corretor / vendas do corretor (Cátia 1.767.000/3 = 589.000).
- Venda com mais de um corretor conta para cada um (9715: Igor e Mitsu); o total conta uma vez.
- **Agenciamentos** = `COUNT(DISTINCT codigo)` de `vista_imoveis` (1005) por `DATE(data_cadastro)`, captador = `vista_usuarios.nome` via `codigo_corretor`. **Placas** = o mesmo com `LOWER(tem_placa)='sim'`. NÃO validados com o Power BI (não aparecem no PDF). Imóvel não tem veículo: com filtro de veículo eles ficam zerados (aviso na tela).
- Conversão entre etapas = etapa / etapa anterior (pode passar de 100%, ex.: Pré 33 / 1º Contato 25 = 132%).
- "vs. período anterior" = mesmos N dias imediatamente antes; anterior zero ou começando antes de 01/01/2026 (`INICIO` no core.js) = "sem base" (ex.: o atalho "Ano" mostra tudo "sem base"). No Comparativo, a variação B vs. A fica "sem base" se o período A começa antes de 2026.

## Números de validação (PDF do Power BI = painel, 100%)
- 01–20/09/2026: Leads 165 · 1º Contato 25 · Pré 33 · Atendimento 125 · Agendamento 19 · Visita 23 · Proposta 0 · Venda 1 · VGV R$ 2,53 Mi. Variações do PDF: 62%, -55%, 0%, 7%, 19%, 77%, 0%, -80%; conversões 15%, 132%, 379%, 15%, 121%, 0%, 0%.
- 01–21/09/2026 (Comparativo): 180 · 26 · 35 · 129 · 20 · 24 · 0 · 1 · R$ 2,53 Mi.
- Agosto/2026 (Financeiro): 8 vendas · VGV 10.457.000 · ticket 1.307.125. Mitsu 3 / 6.140.000 · Arthur 2 / 2.550.000 · Igor 1 / 2.000.000 · Cátia 3 / 1.767.000.
- Setembro/2026 (Performance, leads): W1 43 · W2 43 · W3 79 · W4 59 · W5 22 · total 246. Ranking: Maya 30, Paloma Piteri 27, Daniela Simões 24, Paloma Moura 22, Igor 21, Viviane 20, Eduardo 19, Arthur 17, Erick 16, Cátia 15, Mitsu 15, Lilian 14, Montero 7, Administrativo Polo Residencial 1.
- Leads por veículo 01–20/09: Instagram Leads 72, Grupo Zap 18, Orgânico 18, Facebook Leads 17, C2Sbot 9, Carteira do corretor 8, CTWA Instagram 8.
- Série mensal 2026 (leads / vendas / VGV mi / agenciamentos): jan 622/4/9,33/139 · fev 456/5/7,69/181 · mar 319/7/11,25/244 · abr 328/5/7,82/261 · mai 298/7/14,76/195 · jun 280/5/14,23/162 · jul 241/4/16,35/219 · ago 134/8/10,457/255 · set 246/1/2,53/213 (vendas e VGV já com 'via API').
- Outubro/2026, 01–23/10 (carga normalizada): Leads 145 · 1º Contato 23 · Pré 29 · Atendimento 105 · Agendamento 33 · Visita 22 · Proposta 0 · Venda 3 · VGV R$ 5,25 Mi.

## Arquitetura do painel
- HTML único (artefato) + `claude.use("mcp")` → `callTool("Google Cloud BigQuery","execute_sql_readonly",{projectId:"vistaprocessos",query:SQL,timeoutMs:90000},{cache:{staleTime:300000,gcTime:86400000}})`. Botão Atualizar usa `cache:{refresh:true}`. Se `jobComplete === false`, faz polling com `get_query_results` (`location` us-east1, até 8 vezes). Uma nova tentativa automática só para erro `retryable`.
- **Uma consulta só** (o "cubo", começa com `/*polo-cubo v4 · de 2026-01-01 até D-1*/`), de **01/01/2026** até ontem (`DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)`): ~11 mil linhas codificadas em ~225 KB (~291 KB cifrado, sem compressão), devolvidas em 14 linhas de resultado (`m0`..`m9` com os registros, `k_cor`/`k_vei`/`k_bai`/`k_cat` dicionários, `ref` = data de hoje em America/Sao_Paulo). Todo o resto (filtros, períodos, agregações) é calculado no navegador, instantâneo.
- Formato de cada registro (`;` entre registros, `|` entre campos): `dia|x|cor|vei|bai|cat|dorm|area|imovel|valor`, dia = dias desde 2025-01-01 (marco zero da contagem, igual ao `E0` do motor; NÃO mudar sem mudar os dois); x = CodigoCliente (m0–m6), CodigoNegocio (m7) ou código do imóvel (m8/m9); cor/vei/bai/cat = índices 1-based nos dicionários (0 = vazio).
- Métricas: m0 Leads, m1 1º Contato, m2 Pré-atendimento, m3 Atendimento, m4 Agendamento, m5 Visita, m6 Proposta, m7 Venda (um registro por negócio × corretor, com imóvel e valor), m8 Agenciamentos, m9 Placas.
- Atributos de imóvel para leads vêm do primeiro imóvel de interesse do cliente (view c); para etapas e vendas, do imóvel ligado ao card.
- O cubo custa ~227 MB processados e ~3,3 mi slot-ms por execução; com o cache de 5 min do conector, aberturas seguidas não reconsultam.
- Erros tratados por código: `server_not_connected`/`selection_required` (adicionar conector), `needs_reauth` (reconectar), `approval_required`/`not_in_manifest` (botão "Permitir e carregar"), `blocked_by_policy`, `tool_error` (mostra a mensagem do BigQuery), outros (tentar de novo). `claude.use("mcp")` nulo → "Abra no claude.ai". Falha num Atualizar mantém os dados anteriores.

## Site estático (como funciona)
- `tools/montar.py` junta `fonte/*-ui.html` + `fonte/core.js` + o SQL e gera `docs/index.html` (painel, publicado), `docs/painel/index.html` (redirecionamento) e `ranking/index.html` (TV, fora do site), inserindo antes dos scripts da página o leitor `fonte/estatico.js` (o painel recebe antes `fonte/estatico-painel.js`, que cria o overlay `#portao` em tela cheia e define `window.__poloCfg` com a tela de senha nele; o `carregar()` do painel remove `#portao` quando os dados abrem; a TV recebe depois `fonte/fotos-exemplo.js`). Também gera em `dist/` as versões de artefato (ignoradas pelo git).
- O leitor define `window.__poloFonte()`: busca `data.enc.json`, decifra (Web Crypto; `DecompressionStream('deflate')` só se `z:1`, hoje `z:0`) e devolve `{gerado, rows}`. As páginas detectam `window.__poloFonte` no `carregar()` e usam esse caminho em vez do conector. No painel, filtros e atalhos ficam ocultos até os dados chegarem; o rodapé mostra "Dados até … · gerados em …".
- `tools/cifrar.py` (senha só via `DASH_SENHA`): com `--painel` confere e cifra o cubo → `docs/data.enc.json` (sem zlib); sem opção cifra o resultado do ranking → `ranking/data.enc.json`. Aceita o JSON do conector ou uma lista `[[...]]`.
- Resultados grandes do conector vão para arquivo. Para forçar arquivo num resultado pequeno (ranking): acrescentar só na execução `UNION ALL SELECT 'zz', '_pad', REPEAT('x', 300000)` e remover essa linha antes de cifrar.
- Teste local: servir `docs/` com `python3 -m http.server`, Playwright com Google Fonts bloqueadas. Conferido em 24/10 (versão v2026-10-24d): senha pedida mesmo com senha antiga salva, nova sessão pede de novo, tema escuro; antes (só 2026): senha errada mostra aviso; o overlay some ao entrar; recarregar não pede senha; funil 01–20/09 igual ao PDF; ago 8 vendas / 10.457.000; Performance lista jan/2026 a out/2026; `/painel/` redireciona; celular (390 px) sem rolagem lateral.

## Ranking de corretores para a TV do escritório
- Pedido do cliente: top corretores numa TV, uma métrica por vez, seletor de métrica e período (anual, mensal, semanal; mensal e semanal comparados com o período anterior no mesmo nº de dias), setas de posição (▲ verde, ▼ coral, "=", "NOVO"), foto dos corretores, tela cheia sem rolagem (vai ficar horas ligada), estética muito cuidada.
- Canvas de propostas (tipo Design): https://claude.ai/artifact/MSqEvyCaWfHzhFpXr2nYEs — o usuário aprovou 1 Pódio Noir, 2 Placar Editorial, 4 Torre de Cronometragem e 5 Destaque do Líder (a 3, Cartões Top 5, foi descartada) e pediu taças sutis ouro/prata/bronze no top 3 (traço fino, sem preenchimento).
- Página de teste com as 4 opções (seletor "Opção 1·2·3·4" no topo = Pódio, Placar, Torre, Destaque): `ranking/index.html` no repo (fora do site desde 24/10) e artefato https://claude.ai/artifact/BxCci1R18SxPdkoemgiwKe (versão ao vivo via conector). Palco 1920×1080 escalado para a tela; recarrega a cada 30 min; lembra opção/métrica/período no `localStorage` `polo-tv`.
- Métricas: Leads, Atendimento, Agendamento, Visitas, Vendas, VGV, Agenciamentos. Ficam fora usuários "(Excluído)", "Administrativo" e "Creative". Consulta `sql/ranking-tv.sql` já agregada (~6 KB): períodos `ano`, `mes`, `mes_ant`, `sem`, `sem_ant`, sempre até D-1.
- Fotos: `vista_usuarios.foto` tem a URL de todos os corretores ativos (`https://cdn.vistahost.com.br/poloresi/vista.imobi/fotos/e_poloresi_<codigo>_….jpg`), mas o sandbox não baixa desse CDN. Para a demonstração o site usa rostos gerados por IA (StyleGAN) do projeto acadêmico Which Face Is Real (`whichfaceisreal.blob.core.windows.net/public/fakeimages/…`, mapa por nome em `fonte/fotos-exemplo.js`) e a barra mostra "Fotos ilustrativas · rostos gerados por IA". O artefato do claude.ai bloqueia imagens externas (mostra iniciais). Versão final: embutir as fotos reais do Vista.
- Pendente: o cliente escolher a opção; depois deixar só ela, colocar fotos reais e, quando o usuário pedir, agendar a atualização diária. Ideia oferecida: rotação automática entre métricas.

## Abas (identidade própria, mais simples que a Gralha)
Filtros globais no cabeçalho (datas mínimas 01/01/2026): Período (duas datas + atalhos Mês atual, Mês anterior, Últimos 30 dias, Trimestre, Ano; só o primeiro atalho que corresponde fica marcado), Corretor, Veículo de captação. **Sem filtro de Operação** (ver pendências). Datas padrão: dia 1 do mês até D-1 (no dia 1, mês anterior inteiro). Navegação por hash: `#ov`, `#pf`, `#ex`, `#cp`, `#fi`.
1. **Visão Geral** (`ov`): card "Funil de conversão" (linhas: rótulo, número, barra centralizada proporcional ao maior valor do funil, chip vs. anterior; entre linhas "↓ %" de conversão; Venda em vermelho; VGV embaixo) + card "Resultado do período" (VGV grande, Vendas, Ticket médio, Conversão lead → venda, Agenciamentos, todos com chip; nota com o período comparado) + "Evolução" (barras SVG com seletor: 8 etapas, VGV, Agenciamentos, Placas; dia até 62 dias, semana até 200, depois mês; tooltip ao passar o mouse).
2. **Performance** (`pf`): seletor de **Mês** (de jan/2026 até o mês atual; substitui o período), métricas (8 etapas + Agenciamentos + Placas). Ranking de corretores (barras horizontais, 1º em vermelho), Evolução semanal (linha vermelha com área), Tabela corretor × W1..Wn + Total ordenável. **Semanas = segunda a domingo recortadas dentro do mês** (W1 de set/2026 = 01–06). Total = clientes distintos (um cliente com dois corretores conta na linha de cada um).
3. **Exploração** (`ex`): "Analisar por" Corretor, Veículo de captação, Bairro, Tipologia, Dormitórios (1, 2, 3, 4 ou mais), Área privativa (até 80, 80–120, 120–160, 160–220, 220–300, 300+ m², em ordem de faixa). "Participação": **gráfico circular (rosca)** desde 24/10/2026 (pedido do usuário; antes era faixa 100% empilhada): 6 maiores + "Outros (k)", total e métrica no centro; ao passar o mouse numa fatia ou na legenda aparece "dimensão · quantidade · %" (função `rosca()`), a fatia se destaca e as outras esmaecem; tabela (legenda) que começa exatamente na linha do botão "Leads" (primeiro botão de métrica) e vai até a borda direita do card, rosca centrada no espaço à esquerda (função `alinharPz()`, recalculada após as fontes carregarem e no resize; se os botões quebram linha, rosca ocupa 40% e tabela o resto; empilhado no celular); colunas: ponto, nome (1fr), barra (36%, centrada na linha), e Qtd. + % juntos à direita (1fr, 56 px cada), em lista única (cabeçalho Dimensão · Qtd. · %, ponto de cor, nome, barrinha proporcional, quantidade e %; linha destacada ao passar o mouse); nota "Outros soma k itens menores". Seletor de métrica. Obs.: leads e etapas não têm bairro/área preenchidos na view (só as vendas têm), então nessas dimensões a rosca mostra 100% "Sem informação". "Funil por …": tabela com as 8 etapas, colunas →% de conversão, VGV e Agenc., total no rodapé, ordenável. **Agenciamentos sempre aparece** (botão na Participação e coluna na tabela, pedido em 24/10/2026); na visão por Veículo de captação mostra "–" (imóvel não tem veículo) e a Participação mostra "–" com a frase "Agenciamentos não têm veículo de captação."
4. **Comparativo** (`cp`): Período A e B, cada um com datas e corretor próprios; padrão B = período padrão, A = mesmos dias do mês anterior. Funil espelhado (A à esquerda, B à direita), variação B vs. A no centro, conversões e VGV dos dois lados. O filtro de veículo do topo vale para os dois.
5. **Financeiro** (`fi`): 3 KPIs (Vendas, VGV, Ticket médio, com vs. anterior), Evolução do VGV (semana ou mês), tabela "VGV por" (as 6 dimensões; Vendas, VGV, Ticket médio, ordenável) e lista "Negócios ganhos" (data, corretores, imóvel · bairro, valor; asterisco quando o imóvel se repete e entra uma vez no VGV).
- Tabelas (`.tw`): a primeira coluna (dimensão) fica travada (`position:sticky; left:0`) ao rolar para o lado, com sombra suave na borda quando a tabela foi rolada (classe `rolou`, listener de scroll em captura). Pedido do usuário em 24/10/2026, que elogiou a tabela "Funil por …".
- Tabelas: clique no cabeçalho ordena (números começam do maior, texto A–Z; 2º clique inverte; seta vermelha).
- Página "Metas" do Power BI não foi feita (decisão a confirmar). "Nome Cliente" da Exploração ficou de fora por LGPD (mesma decisão da Gralha).

## Design
- Pedido do usuário: inspirar-se na Gralha sem copiar; identidade própria, elegante, sênior, com as cores da marca; mais resumido que a Gralha.
- **Tipografia (pedido explícito: "igual à Gralha")**: **Sora 600** em títulos, números, cabeçalhos de bloco e marca; **Manrope** (400–700) no texto. Link: `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600&display=swap`. A primeira versão usava Bodoni Moda + Hanken Grotesk e o usuário NÃO gostou: não voltar a serifadas.
- Escala: h1 `600 clamp(26px,3.4vw,34px)/1.15`, letter-spacing -.02em; número grande 38px (KPI do Financeiro 34px); números do funil 21px; títulos de card 12px maiúsculo com .12em; rótulos 10.5px maiúsculo.
- Versão atual da interface: `<!-- v2026-10-24l agenciamentos sempre visível, barras centradas -->`.
- Espaçamento padrão (24/10/2026, pedido "deixar tudo em padrão"): `#view` é flex em coluna com `gap:18px`, igual ao `gap` das `.grid`; todos os blocos de todas as abas ficam a 18 px uns dos outros.
- Gráficos de barras (Evolução da Visão Geral e Evolução do VGV do Financeiro) têm seletor **Ano · Mês · Semana · Dia** (`.seg`, `ST.gran`, compartilhado entre as abas; sem escolha = automático: dia até 62 dias, semana até 200, depois mês; no Financeiro o automático nunca é dia). `serie()` aceita `'ano'`. Barras com no máximo 72 px de largura, centradas; todas na mesma cor `var(--bar)` (vermelho Polo).
- Layout: barra lateral preta fixa (236 px) com monograma em CSS (2×2 preto/vermelho + quadrado branco "PR") e "POLO RESIDENCIAL / Business Intelligence"; navegação com ícones; rodapé com "Dados até … · consultados às …" (no site: "· gerados em …"), botões Atualizar e Tema. Área principal clara, cards brancos com borda fina, raio 10 px. Em ≤900 px a barra lateral vira barra superior com abas roláveis; em ≤620 px o funil e o comparativo se compactam.
- Tokens (claro / escuro; o escuro é o padrão): paper #f3f3f1/#0e0e0f, surface #fff/#171718, ink #151515/#efedea, ink2 #5e5b57/#a6a29c, ink3 #8d8984/#77736e, line #e3e1dd/#29292b, track #eeece9/#212123, red #ad111b/#e2353e, bar #b0121c/#cf2530 (barras em vermelho Polo desde 24/10; antes eram neutras #2a2a2a/#d9d6d1), barsoft #e8c3c5/#5c1d21, up #2b7a4b/#4cc27f, down #b4601a/#e8964d (queda em âmbar, para não confundir com o vermelho da marca). Barra lateral preta nos dois temas. Tema escuro por padrão (não segue mais o sistema), com alternância salva em localStorage (`polo-tema`).
- Gráficos em SVG próprio (sem biblioteca), escala "redonda", valores sobre as barras quando cabem.

## Pendências e decisões em aberto
1. **Operação** (Venda/Locação): no Power BI existe o filtro, mas na base `operacao` é sempre 'Venda'. Perguntar de onde vem. Há vendas de R$ 8 mil a 17 mil (ex.: 10531 de Cátia, R$ 17.000) que parecem locação e entram no VGV, igual ao Power BI.
2. **Proposta**: decidido manter a etapa 7 do DAX (24/10/2026), embora quase sempre dê 0; a etapa 3 "Proposta (3d)" do pipe 1 tem movimento. Pode voltar à mesa com o cliente. Fechamento (4/8) não está no funil.
3. ~~'Negocio Ganho via API'~~: resolvido em 24/10/2026 (entram).
4. ~~Atraso de carga~~: resolvido; em 24/10/2026 leads e etapas estão até 23/10 e a última venda é de 20/10.
5. Agenciamentos/Placas sem validação com o Power BI; base com só 2 imóveis com placa; estoque de 11 mil imóveis inclui imóveis de terceiros (status "Vendido/Alugado Terceiros").
6. Página Metas não feita. Site com senha publicado em polo.creativeimob.app, com rotina diária às 06:37.
7. Os artefatos ao vivo (conector) podem ficar carregando sem fim com o cubo grande; se o usuário quiser voltar a eles, trocar por consultas agregadas por aba (como `sql/ranking-tv.sql`).

## Como trabalhar
1. Antes de mexer: anexar o repo com `add_repo` (push), clonar raso, editar em `fonte/`/`sql/`, rodar `python3 tools/montar.py`, testar `docs/` localmente, mudar o comentário de versão `<!-- vAAAA-MM-DDx ... -->` em `fonte/painel-ui.html` e dar push (só depois de conferir que a senha não está em nenhum arquivo). Para os artefatos antigos: ler a versão publicada com `Artifact` action `read` antes de republicar.
2. Métrica ou regra nova: escrever o SQL, rodar com `execute_sql_readonly`, comparar com o Power BI (mesmo período e filtros), só então mexer no cubo (`base` em cubo.sql + `MET`/`FUNIL` no motor) e na interface.
3. Para testar o motor fora do navegador: rodar o cubo pelo conector (o resultado grande é salvo em arquivo), parsear `rows[].f[].v` com `parseCubo` e conferir com os números de validação acima.
4. Resultados grandes do MCP nunca vão para o contexto: processar o arquivo salvo com Python/jq.
5. LGPD: as views têm nome e telefone de clientes; o painel só usa códigos e agregados. Nunca exibir telefone; nome de cliente só se o usuário pedir.
6. Idioma: português do Brasil.

## Consulta do cubo (cubo.sql, completa)
```sql
/*polo-cubo v4 · de 2026-01-01 até D-1*/
WITH
d0 AS (
  SELECT Data, CodigoCliente, EtapaAcaoId, nome_usuario, veiculocaptacao_dn, bairro_imovel, categoria_imovel, dormitorios_imovel, areaprivativa_imovel
  FROM `vistaprocessos.nitro_dados.vw_consolidado_dados_polo`
  WHERE Data BETWEEN '2026-01-01' AND DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)
    AND (Assunto IS NULL OR Assunto NOT IN ('Negócio ganho','Negócio perdido'))
    AND EtapaAcaoId IN ('9','17','13','16','14','2','7')
),
g0 AS (
  SELECT CodigoNegocio, MIN(Data) d, ANY_VALUE(CodigoEmImovel) imo, MAX(valornegocio_dn) val,
    ANY_VALUE(veiculocaptacao_dn) vei, ANY_VALUE(bairro_imovel) bai, ANY_VALUE(categoria_imovel) cat,
    ANY_VALUE(dormitorios_imovel) dor, ANY_VALUE(areaprivativa_imovel) are, ARRAY_AGG(DISTINCT IFNULL(nome_usuario,'')) cors
  FROM `vistaprocessos.nitro_dados.vw_consolidado_dados_polo`
  WHERE Assunto IN ('Negócio ganho', 'Negocio Ganho via API') AND Data BETWEEN '2026-01-01' AND DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)
  GROUP BY 1
),
u AS (SELECT codigo, ANY_VALUE(nome) nome FROM `vistaprocessos.nitro_dados.vista_usuarios` WHERE imobiliaria_id = 1005 GROUP BY 1),
i0 AS (
  SELECT codigo, ANY_VALUE(DATE(data_cadastro)) d, ANY_VALUE(tem_placa) pl, ANY_VALUE(codigo_corretor) cc,
    ANY_VALUE(bairro) bai, ANY_VALUE(categoria) cat, ANY_VALUE(dormitorios) dor, ANY_VALUE(SAFE_CAST(area_privativa AS FLOAT64)) are
  FROM `vistaprocessos.nitro_dados.vista_imoveis` WHERE imobiliaria_id = 1005 GROUP BY 1
),
base AS (
  SELECT DISTINCT 0 m, DATE(Data) d, CodigoCliente x, nome_usuario cor, veiculocaptacao_dn vei, bairro_imovel bai, categoria_imovel cat,
    Dormitorios dor, CAST(ROUND(SAFE_CAST(AreaPrivativa AS FLOAT64)) AS INT64) are, CAST(NULL AS STRING) imo, CAST(NULL AS INT64) val
  FROM `vistaprocessos.nitro_dados.vw_consolidado_clientes_capturados_polo`
  WHERE DATE(Data) BETWEEN '2026-01-01' AND DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)
  UNION DISTINCT
  SELECT CASE EtapaAcaoId WHEN '9' THEN 1 WHEN '17' THEN 2 WHEN '13' THEN 3 WHEN '16' THEN 3 WHEN '14' THEN 4 WHEN '2' THEN 5 ELSE 6 END,
    Data, CodigoCliente, nome_usuario, veiculocaptacao_dn, bairro_imovel, categoria_imovel, dormitorios_imovel,
    CAST(ROUND(areaprivativa_imovel) AS INT64), NULL, NULL
  FROM d0
  UNION DISTINCT
  SELECT 7, d, CodigoNegocio, NULLIF(c,''), vei, bai, cat, dor, CAST(ROUND(are) AS INT64), imo, CAST(ROUND(val) AS INT64)
  FROM g0, UNNEST(cors) c
  UNION DISTINCT
  SELECT m, i0.d, i0.codigo, u.nome, NULL, bai, cat, dor, CAST(ROUND(are) AS INT64), NULL, NULL
  FROM i0 LEFT JOIN u ON u.codigo = i0.cc, UNNEST(IF(LOWER(pl) = 'sim', [8, 9], [8])) m
  WHERE i0.d BETWEEN '2026-01-01' AND DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)
),
k AS (
  SELECT 'cor' t, cor v FROM base WHERE cor IS NOT NULL GROUP BY 2 UNION ALL
  SELECT 'vei', vei FROM base WHERE vei IS NOT NULL GROUP BY 2 UNION ALL
  SELECT 'bai', bai FROM base WHERE bai IS NOT NULL GROUP BY 2 UNION ALL
  SELECT 'cat', cat FROM base WHERE cat IS NOT NULL GROUP BY 2
),
kd AS (SELECT t, v, ROW_NUMBER() OVER (PARTITION BY t ORDER BY v) id FROM k),
enc AS (
  SELECT b.m, b.d,
    CONCAT(DATE_DIFF(b.d, DATE '2025-01-01', DAY), '|', IFNULL(b.x,''), '|', IFNULL(CAST(k1.id AS STRING),''), '|', IFNULL(CAST(k2.id AS STRING),''), '|',
      IFNULL(CAST(k3.id AS STRING),''), '|', IFNULL(CAST(k4.id AS STRING),''), '|', IFNULL(CAST(b.dor AS STRING),''), '|', IFNULL(CAST(b.are AS STRING),''), '|',
      IFNULL(b.imo,''), '|', IFNULL(CAST(b.val AS STRING),'')) r
  FROM base b
  LEFT JOIN kd k1 ON k1.t = 'cor' AND k1.v = b.cor
  LEFT JOIN kd k2 ON k2.t = 'vei' AND k2.v = b.vei
  LEFT JOIN kd k3 ON k3.t = 'bai' AND k3.v = b.bai
  LEFT JOIN kd k4 ON k4.t = 'cat' AND k4.v = b.cat
)
SELECT CONCAT('m', CAST(m AS STRING)) k, COUNT(*) n, STRING_AGG(r, ';' ORDER BY d) s FROM enc GROUP BY m
UNION ALL
SELECT CONCAT('k_', t), COUNT(*), STRING_AGG(v, '\t' ORDER BY id) FROM kd GROUP BY t
UNION ALL
SELECT 'ref', 0, CAST(CURRENT_DATE('America/Sao_Paulo') AS STRING)
```

## Motor de cálculo (core.js, completo)
```js
// ===== Motor de cálculo do Dashboard Polo (puro, sem DOM) =====
var E0 = Date.UTC(2025, 0, 1);            // dia 0 do cubo
var DAY = 86400000;
var MET = [
  { k: 'leads', n: 'Leads', s: 'Leads captados' },
  { k: 'c1', n: '1º Contato' },
  { k: 'pre', n: 'Pré-atendimento' },
  { k: 'atd', n: 'Atendimento' },
  { k: 'agd', n: 'Agendamento' },
  { k: 'vis', n: 'Visita' },
  { k: 'prop', n: 'Proposta' },
  { k: 'vend', n: 'Venda' },
  { k: 'agc', n: 'Agenciamentos' },
  { k: 'pla', n: 'Placas' }
];
var FUNIL = [0, 1, 2, 3, 4, 5, 6, 7];

function dIdx(iso) { var p = iso.split('-'); return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - E0) / DAY); }
function dIso(i) { return new Date(E0 + i * DAY).toISOString().slice(0, 10); }
function dObj(i) { return new Date(E0 + i * DAY); }
var INICIO = dIdx('2026-01-01');          // primeiro dia com dados no cubo

// Converte o resultado da consulta (linhas k, n, s) no cubo em memória
function parseCubo(rows) {
  var C = { m: [], k: {}, ref: null };
  for (var i = 0; i < 10; i++) C.m[i] = [];
  rows.forEach(function (r) {
    var k = r[0], s = r[2] || '';
    if (k === 'ref') { C.ref = s; return; }
    if (k.indexOf('k_') === 0) { C.k[k.slice(2)] = [''].concat(s.split('\t')); return; }
    var m = +k.slice(1);
    if (!s) return;
    C.m[m] = s.split(';').map(function (t) {
      var a = t.split('|');
      return { d: +a[0], x: a[1], r: a[2] ? +a[2] : 0, v: a[3] ? +a[3] : 0, b: a[4] ? +a[4] : 0, t: a[5] ? +a[5] : 0,
        q: a[6] === '' ? null : +a[6], a: a[7] === '' ? null : +a[7], imo: a[8], val: a[9] === '' ? 0 : +a[9] };
    });
  });
  return C;
}

function faixaArea(a) {
  if (a == null || a <= 0) return 'Sem informação';
  if (a < 80) return 'Até 80 m²';
  if (a < 120) return '80 a 120 m²';
  if (a < 160) return '120 a 160 m²';
  if (a < 220) return '160 a 220 m²';
  if (a < 300) return '220 a 300 m²';
  return '300 m² ou mais';
}
var AREA_ORD = ['Até 80 m²', '80 a 120 m²', '120 a 160 m²', '160 a 220 m²', '220 a 300 m²', '300 m² ou mais', 'Sem informação'];
function faixaDorm(q) { if (q == null || q <= 0) return 'Sem informação'; return q >= 4 ? '4 ou mais' : q + (q === 1 ? ' dormitório' : ' dormitórios'); }

var DIMS = [
  { k: 'cor', n: 'Corretor', f: function (C, e) { return C.k.cor[e.r] || 'Sem corretor'; } },
  { k: 'vei', n: 'Veículo de captação', f: function (C, e) { return normVei(C.k.vei[e.v]) || 'Sem informação'; }, semImovel: true },
  { k: 'bai', n: 'Bairro', f: function (C, e) { return C.k.bai[e.b] || 'Sem informação'; } },
  { k: 'cat', n: 'Tipologia', f: function (C, e) { return C.k.cat[e.t] || 'Sem informação'; } },
  { k: 'dor', n: 'Dormitórios', f: function (C, e) { return faixaDorm(e.q); } },
  { k: 'are', n: 'Área privativa', f: function (C, e) { return faixaArea(e.a); }, ord: AREA_ORD }
];
function dimBy(k) { for (var i = 0; i < DIMS.length; i++) if (DIMS[i].k === k) return DIMS[i]; }
// Une grafias diferentes do mesmo veículo
function normVei(s) {
  if (!s) return s;
  var l = s.toLowerCase();
  if (l === 'youtube') return 'YouTube';
  return s;
}

// F = {cor: id|0, vei: nome|''}
function passa(C, m, e, F) {
  if (F.cor && e.r !== F.cor) return false;
  if (F.vei) { if (m >= 8) return false; if (normVei(C.k.vei[e.v]) !== F.vei) return false; }
  return true;
}
function linhas(C, m, d1, d2, F) {
  var out = [], L = C.m[m];
  for (var i = 0; i < L.length; i++) { var e = L[i]; if (e.d >= d1 && e.d <= d2 && passa(C, m, e, F)) out.push(e); }
  return out;
}
function distintos(L) { var s = {}, n = 0; for (var i = 0; i < L.length; i++) if (!s[L[i].x]) { s[L[i].x] = 1; n++; } return n; }
// VGV: um valor por imóvel vendido (regra do Power BI); vendas = negócios distintos
function vgv(L) {
  var p = {}, t = 0;
  for (var i = 0; i < L.length; i++) { var e = L[i], k = e.imo || ('n' + e.x); if (!(k in p) || e.val > p[k]) p[k] = e.val; }
  for (var k in p) t += p[k];
  return t;
}
function medida(C, m, d1, d2, F) { return distintos(linhas(C, m, d1, d2, F)); }
function funil(C, d1, d2, F) {
  var o = {};
  FUNIL.forEach(function (m) { o[m] = medida(C, m, d1, d2, F); });
  var lv = linhas(C, 7, d1, d2, F);
  o.vgv = vgv(lv); o.ticket = o[7] ? o.vgv / o[7] : 0;
  o[8] = medida(C, 8, d1, d2, F); o[9] = medida(C, 9, d1, d2, F);
  return o;
}
// Período anterior: os N dias imediatamente antes
function anterior(d1, d2) { var n = d2 - d1 + 1; return [d1 - n, d1 - 1]; }
function variacao(a, b, d1prev) {
  if (d1prev < INICIO || !b) return null;   // período anterior antes do início dos dados = sem base
  return (a - b) / b;
}
// Agrupa uma métrica por dimensão: [{nome, n, vend, vgv}]
function porDim(C, m, d1, d2, F, dk) {
  var dim = dimBy(dk), g = {};
  linhas(C, m, d1, d2, F).forEach(function (e) { var k = dim.f(C, e); (g[k] = g[k] || []).push(e); });
  return Object.keys(g).map(function (k) { return { nome: k, n: distintos(g[k]), L: g[k] }; });
}
// Séries temporais: granularidade dia/semana/mês
function serie(C, m, d1, d2, F, gran, valor) {
  var L = linhas(C, m, d1, d2, F), b = {}, keys = [];
  function chave(i) {
    var o = dObj(i);
    if (gran === 'dia') return i;
    if (gran === 'sem') { var w = (o.getUTCDay() + 6) % 7; return Math.max(i - w, d1); }
    return Date.UTC(o.getUTCFullYear(), o.getUTCMonth(), 1);
  }
  for (var i = d1; i <= d2; i++) { var k = chave(i); if (!b[k]) { b[k] = []; keys.push(k); } }
  L.forEach(function (e) { b[chave(e.d)].push(e); });
  return keys.map(function (k) { return { k: k, v: valor === 'vgv' ? vgv(b[k]) : distintos(b[k]) }; });
}
// Semanas do mês, de segunda a domingo, recortadas no mês (W1..Wn)
function semanasMes(ano, mes) {
  var d1 = dIdx(ano + '-' + String(mes).padStart(2, '0') + '-01');
  var fim = new Date(Date.UTC(ano, mes, 0)).getUTCDate(), d2 = d1 + fim - 1, out = [], ini = d1;
  for (var i = d1; i <= d2; i++) {
    var dow = (dObj(i).getUTCDay() + 6) % 7;
    if (dow === 6 || i === d2) { out.push([ini, i]); ini = i + 1; }
  }
  return out;
}
var fmt = {
  n: function (v) { return Math.round(v).toLocaleString('pt-BR'); },
  pct: function (v, dec) { return (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }) + '%'; },
  mi: function (v) { return 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Mi'; },
  brl: function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); },
  data: function (i) { var o = dObj(i); return String(o.getUTCDate()).padStart(2, '0') + '/' + String(o.getUTCMonth() + 1).padStart(2, '0') + '/' + o.getUTCFullYear(); }
};
if (typeof module !== 'undefined') module.exports = { parseCubo: parseCubo, funil: funil, porDim: porDim, vgv: vgv, linhas: linhas, distintos: distintos, dIdx: dIdx, serie: serie, semanasMes: semanasMes, fmt: fmt, MET: MET };
```