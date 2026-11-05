# Atualização diária do Dashboard Polo (https://polo.creativeimob.app)

Roda todo dia às 06:37 (America/Sao_Paulo) pela tarefa agendada "Atualizar Dashboard Polo". Também pode ser rodada à mão com os mesmos passos.
Dados: de 01/01/2026 até D-1 (ontem, horário de São Paulo). Em qualquer falha, **pare sem publicar** e explique.

1. **Repositório:** `add_repo` (owner `paulollaque12`, repo `creativeimob-polo-crm`, access `push`), `git clone --depth 1 https://github.com/paulollaque12/creativeimob-polo-crm /home/claude/creativeimob-polo-crm` (timeout ~10 min; se der 429, espere 10 s e tente uma vez) e `register_repo_root`. `pip install --break-system-packages cryptography` se faltar.
2. **Consulta:** rodar o conteúdo de `sql/painel-cubo.sql` (inteiro, sem mudar nada) com o conector Google Cloud BigQuery `execute_sql_readonly` (`projectId: vistaprocessos`, `timeoutMs: 90000`). Se vier `jobComplete: false`, buscar com `get_query_results` (`location: us-east1`). O resultado (~225 mil caracteres) é grande: o conector o salva em arquivo e informa o caminho na mensagem "exceeds maximum allowed tokens". Copiar esse arquivo para `/tmp/claude-0/cubo.json`. Nunca colar o conteúdo na conversa.
3. **Cifrar e conferir:**
   `cd /home/claude/creativeimob-polo-crm && DASH_SENHA='<senha>' python3 tools/cifrar.py --painel /tmp/claude-0/cubo.json`
   O script só grava `docs/data.enc.json` se:
   - a linha `ref` do cubo for a data de hoje (resultado novo);
   - nenhum dado passar de ontem;
   - abrir o arquivo publicado com a mesma senha (senha errada = para);
   - nenhuma métrica m0..m9 cair mais de 2% em número de linhas em relação ao publicado.
   Ele mostra o último dia com leads, atendimento e venda. Se aparecer "AVISO: leads só até …", a carga do Vista está atrasada: publicar mesmo assim e avisar na resposta.
4. **Ranking da TV (polo.creativeimob.app/ranking):** rodar o conteúdo inteiro de `sql/ranking-tv.sql` (sem alterar nada) com o mesmo conector. A última linha da consulta (`zz`) existe só para o resultado passar de 300 mil caracteres e o conector salvá-lo em arquivo; copiar esse arquivo para `/tmp/claude-0/tv.json` e rodar
   `DASH_SENHA='<senha>' python3 tools/cifrar.py /tmp/claude-0/tv.json`
   Sai em `docs/ranking/data.enc.json` (o script descarta a linha `zz`). Ele só grava se os dados forem até ontem; mostra quantos corretores têm leads, visitas e vendas no mês e quantas fotos vieram.
5. **Publicar só os dados:**
   `git add docs/data.enc.json docs/ranking/data.enc.json && git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -m "dados ate AAAA-MM-DD" && git push origin main`
   (AAAA-MM-DD = ontem; a mensagem termina com a linha `Co-Authored-By: Claude <noreply@anthropic.com>`). Não alterar `fonte/`, `sql/`, `tools/` nem outros arquivos. Se só o ranking falhar, publicar o painel mesmo assim e avisar.
6. **Confirmar:** `gh api repos/paulollaque12/creativeimob-polo-crm/actions/runs?per_page=1` → o run "pages build and deployment" do novo commit termina com `success` (aguardar até ~3 min).

Se mudar alguma fonte (`fonte/`, `sql/`), rodar antes `python3 tools/montar.py` e commitar também `docs/index.html` e `docs/ranking/index.html`.

**Ranking da TV:** Pódio com os 10 primeiros do mês atual (até ontem), girando sozinho entre Leads, Visitas e Vendas a cada 60 s, com as fotos dos corretores cadastradas no Vista (a TV carrega as fotos direto do CDN do Vista).

Regras: nunca gravar a senha em arquivo, commit ou mensagem; nunca commitar resultados em claro; LGPD: o painel só usa códigos e agregados.
