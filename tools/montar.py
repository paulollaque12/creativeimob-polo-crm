"""Monta as páginas a partir das fontes.

  python3 tools/montar.py

Gera:
  dist/ranking-tv-artefato.html  -> versão ao vivo (artefato do claude.ai, consulta o BigQuery pelo conector)
  dist/painel-artefato.html      -> Dashboard Polo (artefato do claude.ai)
  docs/index.html                -> versão estática do ranking (GitHub Pages), lê docs/data.enc.json
"""
import json
import pathlib

R = pathlib.Path(__file__).resolve().parent.parent
core = (R / 'fonte/core.js').read_text()


def juntar(ui, sql):
    out = ui.replace('/*@@CORE@@*/', core).replace('/*@@SQL@@*/""', json.dumps(sql, ensure_ascii=False))
    assert '@@CORE@@' not in out and '@@SQL@@' not in out
    return out


tv_ui = (R / 'fonte/ranking-tv-ui.html').read_text()
tv_sql = (R / 'sql/ranking-tv.sql').read_text()
(R / 'dist').mkdir(exist_ok=True)
(R / 'dist/ranking-tv-artefato.html').write_text(juntar(tv_ui, tv_sql))
(R / 'dist/painel-artefato.html').write_text(juntar((R / 'fonte/painel-ui.html').read_text(), (R / 'sql/painel-cubo.sql').read_text()))

# Versão estática: documento completo + leitor do arquivo cifrado antes dos scripts da página
estatico = (R / 'fonte/estatico.js').read_text()
corpo = juntar(tv_ui, tv_sql)
marca = '<script>\n'
i = corpo.index(marca)
corpo = corpo[:i] + '<script>\n' + estatico + '\n</script>\n' + corpo[i:]
pagina = ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
          '<meta name="robots" content="noindex,nofollow">\n</head>\n<body>\n' + corpo + '\n</body>\n</html>\n')
(R / 'docs').mkdir(exist_ok=True)
(R / 'docs/index.html').write_text(pagina)
(R / 'docs/.nojekyll').write_text('')
(R / 'docs/robots.txt').write_text('User-agent: *\nDisallow: /\n')
print('ok:', len(pagina), 'bytes em docs/index.html')
