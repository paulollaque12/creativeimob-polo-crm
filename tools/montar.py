"""Monta as páginas a partir das fontes.

  python3 tools/montar.py

Gera:
  dist/ranking-tv-artefato.html  -> ranking ao vivo (artefato do claude.ai, consulta o BigQuery pelo conector)
  dist/painel-artefato.html      -> Dashboard Polo ao vivo (artefato do claude.ai)
  docs/index.html                -> Dashboard Polo estático (GitHub Pages, publicado), lê docs/data.enc.json
  ranking/index.html             -> ranking da TV estático, FORA do site (guardado para depois), lê ranking/data.enc.json
"""
import json
import pathlib

R = pathlib.Path(__file__).resolve().parent.parent
core = (R / 'fonte/core.js').read_text()


def juntar(ui, sql):
    out = ui.replace('/*@@CORE@@*/', core).replace('/*@@SQL@@*/""', json.dumps(sql, ensure_ascii=False))
    assert '@@CORE@@' not in out and '@@SQL@@' not in out
    return out


# Ícone da CreativeImob (o mesmo do dashboard de performance); arquivos em docs/
ICONES = ('<link rel="icon" href="favicon.ico?v=1" sizes="any">\n'
          '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png?v=1">\n'
          '<link rel="apple-touch-icon" href="apple-touch-icon.png?v=1">\n')


def estatica(corpo, extra_js, destino):
    """Documento completo: o leitor do arquivo cifrado entra antes dos scripts da página."""
    i = corpo.index('<script>\n')
    corpo = corpo[:i] + '<script>\n' + extra_js + '\n</script>\n' + corpo[i:]
    pagina = ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
              '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
              '<meta name="robots" content="noindex,nofollow">\n' + ICONES + '</head>\n<body>\n' + corpo + '\n</body>\n</html>\n')
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(pagina)
    print('ok:', destino.relative_to(R), len(pagina), 'bytes')


tv = juntar((R / 'fonte/ranking-tv-ui.html').read_text(), (R / 'sql/ranking-tv.sql').read_text())
painel = juntar((R / 'fonte/painel-ui.html').read_text(), (R / 'sql/painel-cubo.sql').read_text())
(R / 'dist').mkdir(exist_ok=True)
(R / 'dist/ranking-tv-artefato.html').write_text(tv)
(R / 'dist/painel-artefato.html').write_text(painel)

leitor = (R / 'fonte/estatico.js').read_text()
# Dashboard Polo: é o site publicado
estatica(painel, (R / 'fonte/estatico-painel.js').read_text() + '\n' + leitor, R / 'docs/index.html')
# Endereço antigo /painel/ leva para a raiz
(R / 'docs/painel').mkdir(parents=True, exist_ok=True)
(R / 'docs/painel/index.html').write_text('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">'
                                          '<meta http-equiv="refresh" content="0; url=../"><title>Dashboard Polo</title><a href="../">Dashboard Polo</a>\n')
# Ranking da TV: fora do site por enquanto (para publicar de novo, gerar em docs/ranking/).
# Demonstração: fotos ilustrativas (remover quando houver as fotos reais)
estatica(tv, leitor + '\n' + (R / 'fonte/fotos-exemplo.js').read_text(), R / 'ranking/index.html')

(R / 'docs/.nojekyll').write_text('')
(R / 'docs/robots.txt').write_text('User-agent: *\nDisallow: /\n')
