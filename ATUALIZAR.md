# Atualização dos dados do site

Hoje a atualização é manual (sem tarefa agendada). Em qualquer falha, **pare sem publicar** e relate o erro.

1. Clonar: `git clone --depth 1 https://github.com/paulollaque12/creativeimob-polo-crm` e entrar na pasta. `pip install cryptography --break-system-packages` se faltar.
2. **Dashboard Polo:** rodar `sql/painel-cubo.sql` com o conector do BigQuery (`execute_sql_readonly`, `projectId: vistaprocessos`, `timeoutMs: 90000`). O resultado (~470 mil caracteres) é grande: o conector o salva em arquivo e informa o caminho. Copiar esse arquivo para fora do repositório e rodar
   `DASH_SENHA='<senha>' python3 tools/cifrar.py --painel <arquivo>`
   Conferir na saída a data de referência (hoje) e as contagens m0..m8 (nenhuma pode cair a zero de um dia para o outro).
3. **Ranking da TV:** rodar `sql/ranking-tv.sql` (resultado pequeno, ~30 linhas), gravar as linhas como `[["k","m","s"], ...]` num arquivo fora do repositório e rodar
   `DASH_SENHA='<senha>' python3 tools/cifrar.py <arquivo>`
   Conferir que "dados até" é ontem.
4. Publicar só os arquivos de dados:
   `git add docs/data.enc.json docs/painel/data.enc.json && git commit -m "dados ate AAAA-MM-DD" && git push origin main`
   (com as linhas Co-Authored-By exigidas).

Se mudar alguma fonte (`fonte/`, `sql/`), rodar antes `python3 tools/montar.py` e commitar também `docs/index.html` e `docs/painel/index.html`.

Regras: nunca gravar a senha em arquivo, commit ou mensagem; nunca commitar resultados em claro.
