# Polo Residencial · CRM (CreativeImob · Data & BI)

Painéis da Polo Residencial alimentados pelo Vista CRM no BigQuery (`vistaprocessos.nitro_dados`, `imobiliaria_id = 1005`).

## Dashboard Polo (`docs/painel/`)

- **Site (GitHub Pages, com senha):** `/painel/`. Cinco abas: Visão Geral (funil de 8 etapas + resultado do período + evolução), Performance (corretor × semana), Exploração (funil por corretor, veículo, bairro, tipologia, dormitórios, área), Comparativo (dois períodos) e Financeiro (vendas, VGV, ticket, negócios ganhos).
- **Dados:** `sql/painel-cubo.sql` (o "cubo", desde 01/01/2025) → `tools/cifrar.py --painel` → `docs/painel/data.enc.json` (AES-GCM + zlib, ~130 KB). Todo o cálculo é feito no navegador por `fonte/core.js`.
- **Senha:** a mesma do ranking; digitada uma vez num navegador, abre as duas páginas.
- **Regras:** vendas = `Negócio ganho` + `Negocio Ganho via API` (decisão de 24/10/2026); Proposta = etapa 7, como no DAX do cliente.

## Ranking de corretores para a TV

- **Site (GitHub Pages, com senha):** `docs/index.html` lê `docs/data.enc.json`, cifrado com AES-GCM (chave PBKDF2-SHA256, 250 mil iterações). A senha é pedida uma vez e fica salva naquela tela. A senha **nunca** vai para o repositório.
- **Teste de layout:** barra no topo com Opção 1 (Pódio), 2 (Placar), 3 (Torre) e 4 (Destaque); em cada uma, métrica (Leads, Atendimento, Agendamento, Visitas, Vendas, VGV, Agenciamentos) e período (Anual, Mensal, Semanal). Mensal e semanal comparam com o mesmo nº de dias do período anterior (setas ▲ ▼, "=" e "NOVO"); o anual não compara. Taças ouro, prata e bronze no top 3.
- **Tela:** palco 1920×1080 que se ajusta a qualquer TV, sem rolagem; botão "Tela cheia" esconde a barra. Recarrega os dados a cada 30 minutos.
- **Dados:** `sql/ranking-tv.sql` devolve os rankings já agregados (~4 KB) para os períodos `ano`, `mes`, `mes_ant`, `sem`, `sem_ant`, sempre até D-1. Ficam fora usuários "(Excluído)", "Administrativo" e "Creative".
- **Atualização diária:** tarefa agendada segue `ATUALIZAR.md`.

## Arquivos

| Caminho | O que é |
|---|---|
| `fonte/ranking-tv-ui.html` | Interface do ranking (marcadores `/*@@CORE@@*/` e `/*@@SQL@@*/""`) |
| `fonte/estatico.js` | Leitor do arquivo cifrado + tela de senha (só na versão do Pages) |
| `fonte/painel-ui.html` | Interface do Dashboard Polo (5 abas) |
| `fonte/core.js` | Motor de cálculo do Dashboard Polo |
| `sql/ranking-tv.sql` | Consulta agregada do ranking |
| `sql/painel-cubo.sql` | Cubo do Dashboard Polo (~465 KB de resultado) |
| `tools/montar.py` | Gera `docs/index.html` e as versões de artefato em `dist/` |
| `tools/cifrar.py` | Cifra o resultado da consulta em `docs/data.enc.json` (`DASH_SENHA` no ambiente) |
| `docs/` | O que o GitHub Pages publica |

## Publicar no GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → Branch `main`, pasta `/docs`.

## Regras de negócio

Ver a skill `dashboard-vista-polo` (regras validadas contra o Power BI do cliente: funil de 8 etapas por `EtapaAcaoId`, VGV somando um valor por imóvel vendido, etc.).
