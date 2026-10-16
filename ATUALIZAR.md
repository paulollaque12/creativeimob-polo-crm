# Rotina diária do ranking (dados do site)

Executada pela tarefa agendada. Em qualquer falha, **pare sem publicar** e relate o erro.

1. Clonar: `git clone --depth 1 https://github.com/paulollaque12/creativeimob-polo-crm` e entrar na pasta.
2. Rodar o conteúdo de `sql/ranking-tv.sql` com o conector do BigQuery (`execute_sql_readonly`, `projectId: vistaprocessos`, `timeoutMs: 90000`). Se vier `jobComplete: false`, buscar com `get_query_results` (`location: us-east1`).
3. Gravar as linhas do resultado (são ~30, uns 4 KB) num arquivo temporário fora do repositório, no formato `[["k","m","s"], ...]`, na ordem das colunas `k`, `m`, `s`.
4. Cifrar: `DASH_SENHA='<senha da tarefa>' python3 tools/cifrar.py <arquivo>` (precisa de `pip install cryptography --break-system-packages` se faltar). Conferir na saída que "dados até" é ontem.
5. Publicar só o arquivo de dados:
   `git add docs/data.enc.json && git commit -m "dados: <data de ontem>" && git push origin main`
   (com as linhas Co-Authored-By exigidas).

Regras: nunca gravar a senha em arquivo, commit ou mensagem; nunca commitar o resultado em claro; não mexer em outros arquivos na rotina.
