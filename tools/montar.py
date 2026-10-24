"""Monta as páginas a partir das fontes.

  python3 tools/montar.py

Gera:
  dist/ranking-tv-artefato.html  -> ranking ao vivo (artefato do claude.ai, consulta o BigQuery pelo conector)
  dist/painel-artefato.html      -> Dashboard Polo ao vivo (artefato do claude.ai)
  docs/index.html                -> ranking da TV estático (GitHub Pages), lê docs/data.enc.json
  docs/painel/index.html         -> Dashboard Polo estático (GitHub Pages), lê docs/painel/data.enc.json
"""
import json
import pathlib

R = pathlib.Path(__file__).resolve().parent.parent
core = (R / 'fonte/core.js').read_text()


def juntar(ui, sql):
    out = ui.replace('/*@@CORE@@*/', core).replace('/*@@SQL@@*/""', json.dumps(sql, ensure_ascii=False))
    assert '@@CORE@@' not in out and '@@SQL@@' not in out
    return out


def estatica(corpo, extra_js, destino):
    """Documento completo: o leitor do arquivo cifrado entra antes dos scripts da página."""
    i = corpo.index('<script>\n')
    corpo = corpo[:i] + '<script>\n' + extra_js + '\n</script>\n' + corpo[i:]
    pagina = ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
              '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
              '<meta name="robots" content="noindex,nofollow">\n</head>\n<body>\n' + corpo + '\n</body>\n</html>\n')
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(pagina)
    print('ok:', destino.relative_to(R), len(pagina), 'bytes')


tv = juntar((R / 'fonte/ranking-tv-ui.html').read_text(), (R / 'sql/ranking-tv.sql').read_text())
painel = juntar((R / 'fonte/painel-ui.html').read_text(), (R / 'sql/painel-cubo.sql').read_text())
(R / 'dist').mkdir(exist_ok=True)
(R / 'dist/ranking-tv-artefato.html').write_text(tv)
(R / 'dist/painel-artefato.html').write_text(painel)

leitor = (R / 'fonte/estatico.js').read_text()
# Ranking da TV. Demonstração: fotos ilustrativas (remover esta linha quando houver as fotos reais)
estatica(tv, leitor + '\n' + (R / 'fonte/fotos-exemplo.js').read_text(), R / 'docs/index.html')
# Dashboard Polo
estatica(painel, (R / 'fonte/estatico-painel.js').read_text() + '\n' + leitor, R / 'docs/painel/index.html')

(R / 'docs/.nojekyll').write_text('')
(R / 'docs/robots.txt').write_text('User-agent: *\nDisallow: /\n')
