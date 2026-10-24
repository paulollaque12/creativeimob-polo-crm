# Polo Residencial · CRM (CreativeImob · Data & BI)

Painéis da Polo Residencial alimentados pelo Vista CRM no BigQuery (`vistaprocessos.nitro_dados`, `imobiliaria_id = 1005`).

## Dashboard Polo (o site)

- **Endereço:** https://paulollaque12.github.io/creativeimob-polo-crm/ (o antigo `/painel/` redireciona para cá). Tela de senha em tela cheia, no estilo da marca; a senha fica salva no navegador.
- **Abas:** Visão Geral (funil de 8 etapas + resultado do período + evolução), Performance (corretor × semana), Exploração (funil por corretor, veículo, bairro, tipologia, dormitórios, área), Comparativo (dois períodos) e Financeiro (vendas, VGV, ticket, negócios ganhos).
- **Dados:** só a partir de **01/01/2026**. `sql/painel-cubo.sql` → `tools/cifrar.py --painel` → `docs/data.enc.json` (AES-GCM + zlib, ~65 KB). Todo o cálculo é feito no navegador por `fonte/core.js`. Comparação com período anterior que caia antes de 2026 aparece como "sem base".
- **Regras:** vendas = `Negócio ganho` + `Negocio Ganho via API`; Proposta = etapa 7, como no DAX do cliente.

## Ranking de corretores para a TV (fora do site, para depois)

- Guardado em `ranking/` (não é publicado: o GitHub Pages só serve `docs/`). Para voltar a publicar, gerar em `docs/ranking/` no `tools/montar.py`.

- **Página:** `ranking/index.html` lê `ranking/data.enc.json`, cifrado com AES-GCM (chave PBKDF2-SHA256, 250 mil iterações), com a mesma senha do painel. A senha **nunca** vai para o repositório.
- **Teste de layout:** barra no topo com Opção 1 (Pódio), 2 (Placar), 3 (Torre) e 4 (Destaque); em cada uma, métrica (Leads, Atendimento, Agendamento, Visitas, Vendas, VGV, Agenciamentos) e período (Anual, Mensal, Semanal). Mensal e semanal comparam com o mesmo nº de dias do período anterior (setas ▲ ▼, "=" e "NOVO"); o anual não compara. Taças ouro, prata e bronze no top 3.
- **Tela:** palco 1920×1080 que se ajusta a qualquer TV, sem rolagem; botão "Tela cheia" esconde a barra. Recarrega os dados a cada 30 minutos.
- **Dados:** `sql/ranking-tv.sql` devolve os rankings já agregados (~4 KB) para os períodos `ano`, `mes`, `mes_ant`, `sem`, `sem_ant`, sempre até D-1. Ficam fora usuários "(Excluído)", "Administrativo" e "Creative".
- **Atualização:** manual, pelo `ATUALIZAR.md` (sem tarefa agendada).

## Arquivos

| Caminho | O que é |
|---|---|
| `fonte/ranking-tv-ui.html` | Interface do ranking (marcadores `/*@@CORE@@*/` e `/*@@SQL@@*/""`) |
| `fonte/estatico.js` | Leitor do arquivo cifrado (Web Crypto + zlib), comum às duas páginas |
| `fonte/estatico-painel.js` | Tela de senha do Dashboard Polo (tela cheia, estilo da marca) |
| `fonte/painel-ui.html` | Interface do Dashboard Polo (5 abas) |
| `fonte/core.js` | Motor de cálculo do Dashboard Polo |
| `sql/ranking-tv.sql` | Consulta agregada do ranking |
| `sql/painel-cubo.sql` | Cubo do Dashboard Polo, desde 01/01/2026 (~225 KB de resultado) |
| `tools/montar.py` | Gera `docs/index.html` (painel), `ranking/index.html` e as versões de artefato em `dist/` |
| `tools/cifrar.py` | Cifra o cubo em `docs/data.enc.json` (`--painel`) ou o ranking em `ranking/data.enc.json` (`DASH_SENHA` no ambiente) |
| `docs/` | O que o GitHub Pages publica (só o Dashboard Polo) |
| `ranking/` | Ranking da TV, fora do site |

## Publicar no GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → Branch `main`, pasta `/docs`.

## Regras de negócio

Ver a skill `dashboard-vista-polo` (regras validadas contra o Power BI do cliente: funil de 8 etapas por `EtapaAcaoId`, VGV somando um valor por imóvel vendido, etc.).
