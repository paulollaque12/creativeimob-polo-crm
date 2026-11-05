# Polo Residencial · CRM (CreativeImob · Data & BI)

Painéis da Polo Residencial alimentados pelo Vista CRM no BigQuery (`vistaprocessos.nitro_dados`, `imobiliaria_id = 1005`).

## Dashboard Polo (o site)

- **Endereço:** https://polo.creativeimob.app (domínio na GoDaddy: CNAME `polo` → `paulollaque12.github.io`; arquivo `docs/CNAME`; HTTPS ativo). O github.io e o antigo `/painel/` redirecionam para cá. Tela de senha em tela cheia, no estilo da marca, pedida a cada abertura (a senha só fica na aba). Tema escuro padrão; gráficos em vermelho Polo; ícone da CreativeImob.
- **Abas:** Visão Geral (funil de 8 etapas + resultado do período + evolução), Performance (corretor × semana), Exploração (funil por corretor, veículo, bairro, tipologia, dormitórios, área), Comparativo (dois períodos) e Financeiro (vendas, VGV, ticket, negócios ganhos).
- **Dados:** de **01/01/2026 até D-1**. `sql/painel-cubo.sql` → `tools/cifrar.py --painel` (confere antes de gravar) → `docs/data.enc.json` (AES-GCM, sem compressão para funcionar em navegadores antigos, ~291 KB). Atualização diária às 06:37 pela tarefa agendada "Atualizar Dashboard Polo" (passo a passo em `ATUALIZAR.md`). Todo o cálculo é feito no navegador por `fonte/core.js`. Comparação com período anterior que caia antes de 2026 aparece como "sem base".
- **Regras:** vendas = `Negócio ganho` + `Negocio Ganho via API`; Proposta = etapa 7, como no DAX do cliente.

## Ranking de corretores para a TV

- **Endereço:** https://polo.creativeimob.app/ranking (mesma senha do dashboard; na TV a senha fica salva no aparelho).
- **Layout:** Opção 1, Pódio Noir (escolhida pelo cliente): top 3 em pódio com taças ouro/prata/bronze, do 4º ao 10º em lista à direita, setas de posição e diferença vs. os mesmos dias do mês anterior.
- **Sem filtros:** gira sozinho entre **Leads → Visitas → Vendas a cada 60 s** (pedido do cliente em 04/11/2026), sempre no **mês atual até ontem**. Palco 1920×1080 que se ajusta a qualquer TV, sem rolagem; duplo clique ou tecla F = tela cheia; o cursor some depois de 3 s parado. Recarrega os dados a cada 30 min.
- **Fotos:** as reais do Vista (`vista_usuarios.foto`, vêm nos dados como linhas `_foto`); sem foto, mostra as iniciais.
- **Dados:** `sql/ranking-tv.sql` → `tools/cifrar.py` → `docs/ranking/data.enc.json`, na mesma rotina diária das 06:37.

## Arquivos

| Caminho | O que é |
|---|---|
| `fonte/ranking-tv-ui.html` | Interface do ranking da TV (Pódio, rotação de métricas) |
| `fonte/estatico.js` | Leitor do arquivo cifrado (Web Crypto), comum às duas páginas |
| `fonte/estatico-painel.js` | Tela de senha do Dashboard Polo (tela cheia, estilo da marca) |
| `fonte/painel-ui.html` | Interface do Dashboard Polo (5 abas) |
| `fonte/core.js` | Motor de cálculo do Dashboard Polo |
| `sql/ranking-tv.sql` | Consulta agregada do ranking |
| `sql/painel-cubo.sql` | Cubo do Dashboard Polo, de 01/01/2026 até D-1 (~225 KB de resultado) |
| `skill/SKILL.md` | Cópia da skill `dashboard-vista-polo` (contexto completo do projeto) |
| `tools/montar.py` | Gera `docs/index.html` (painel), `docs/ranking/index.html` (TV) e as versões de artefato em `dist/` |
| `tools/cifrar.py` | Confere e cifra o cubo em `docs/data.enc.json` (`--painel`) ou o ranking em `docs/ranking/data.enc.json` (`DASH_SENHA` no ambiente) |
| `docs/` | O que o GitHub Pages publica: Dashboard Polo na raiz e ranking em `ranking/` |

## Publicar no GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → Branch `main`, pasta `/docs`.

## Regras de negócio

Ver a skill `dashboard-vista-polo` (regras validadas contra o Power BI do cliente: funil de 8 etapas por `EtapaAcaoId`, VGV somando um valor por imóvel vendido, etc.).
