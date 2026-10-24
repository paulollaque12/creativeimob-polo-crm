"""Cifra o resultado de uma consulta para o site.

  DASH_SENHA='...' python3 tools/cifrar.py --painel resultado.json     # Dashboard Polo -> docs/data.enc.json (site publicado)
  DASH_SENHA='...' python3 tools/cifrar.py resultado.json              # ranking da TV  -> ranking/data.enc.json (fora do site)

`resultado.json` pode ser o retorno do conector do BigQuery ({"rows":[{"f":[{"v":..}]}]})
ou uma lista simples [[...], ...]. Ranking: sql/ranking-tv.sql. Painel: sql/painel-cubo.sql.
A senha vem só da variável de ambiente DASH_SENHA: nunca a grave em arquivo, commit ou mensagem.
"""
import base64
import datetime
import json
import os
import pathlib
import sys
import zlib

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

R = pathlib.Path(__file__).resolve().parent.parent
IT = 250000

args = sys.argv[1:]
painel = '--painel' in args
args = [a for a in args if a not in ('--painel', '--sem-comparar')]
senha = os.environ.get('DASH_SENHA')
if not senha:
    sys.exit('Defina DASH_SENHA no ambiente.')
if len(args) != 1:
    sys.exit(__doc__)
bruto = json.loads(pathlib.Path(args[0]).read_text())
rows = [[c.get('v') for c in r['f']] for r in bruto['rows']] if isinstance(bruto, dict) else bruto

if painel:
    chaves = {r[0]: r for r in rows}
    faltam = {'ref', 'k_cor', 'm0', 'm3', 'm7', 'm8'} - set(chaves)
    assert not faltam, 'faltam linhas do cubo: %s (a consulta é a sql/painel-cubo.sql?)' % sorted(faltam)
    ultimo = chaves['ref'][2]
    resumo = ' · '.join('%s=%s' % (k, chaves[k][1]) for k in sorted(chaves) if k.startswith('m'))
    destino = R / 'docs/data.enc.json'
    # ---- conferência antes de publicar (rotina diária) ----
    E0 = datetime.date(2025, 1, 1)
    def ult_dia(m):
        s = chaves.get(m, [None, 0, ''])[2] or ''
        return max((int(t.split('|', 1)[0]) for t in s.split(';') if t), default=None)
    hoje = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3))).date()
    assert ultimo == hoje.isoformat(), 'ref do cubo (%s) não é hoje (%s): resultado antigo?' % (ultimo, hoje)
    dias = {m: ult_dia(m) for m in ('m0', 'm3', 'm7')}
    ld = {m: (E0 + datetime.timedelta(days=v)).isoformat() if v is not None else '-' for m, v in dias.items()}
    print('último dia com dado: leads %s · atendimento %s · venda %s' % (ld['m0'], ld['m3'], ld['m7']))
    ontem = (hoje - datetime.timedelta(days=1)).isoformat()
    if ld['m0'] != ontem:
        print('AVISO: leads só até %s (esperado %s): carga do Vista atrasada?' % (ld['m0'], ontem))
    assert all(ld[m] <= ontem for m in ld if ld[m] != '-'), 'há dados depois de ontem: a consulta é a sql/painel-cubo.sql v4?'
    if destino.exists() and '--sem-comparar' not in sys.argv:
        try:
            ant = json.loads(destino.read_text()); d = lambda k: base64.b64decode(ant[k])
            k0 = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=d('salt'), iterations=ant['it']).derive(senha.encode())
            cl = AESGCM(k0).decrypt(d('iv'), d('ct'), None)
            cl = zlib.decompress(cl) if ant.get('z') else cl
            velho = {r[0]: r for r in json.loads(cl)['rows']}
        except Exception as e:
            sys.exit('não consegui abrir o arquivo publicado com esta senha (%s): senha errada? nada foi gravado.' % e)
        for m in ['m%d' % i for i in range(10)]:
            a, b = int(velho.get(m, [0, 0])[1] or 0), int(chaves.get(m, [0, 0])[1] or 0)
            if a >= 50 and b < a * 0.98:
                sys.exit('queda de linhas em %s: %d -> %d (mais de 2%%). Nada foi gravado.' % (m, a, b))
        print('comparado com o publicado: ' + ' · '.join('%s %s->%s' % (m, velho.get(m, [0, '-'])[1], chaves.get(m, [0, '-'])[1]) for m in ['m0', 'm3', 'm7', 'm8']))
else:
    periodos = {r[0]: r[2] for r in rows if r[1] == '_per'}
    assert {'ano', 'mes', 'mes_ant', 'sem', 'sem_ant'} <= set(periodos), 'faltam os períodos: a consulta é a sql/ranking-tv.sql?'
    assert any(r[1] != '_per' for r in rows), 'consulta sem nenhuma métrica'
    ultimo = periodos['ano'].split('|')[1]
    resumo = '%d linhas' % len(rows)
    destino = R / 'ranking/data.enc.json'

dados = {'gerado': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'rows': rows}
claro = json.dumps(dados, ensure_ascii=False, separators=(',', ':')).encode()
z = 0  # sem compressão: DecompressionStream não existe em navegadores antigos (iOS < 16.4)
if z:
    claro = zlib.compress(claro, 9)
salt, iv = os.urandom(16), os.urandom(12)
chave = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=IT).derive(senha.encode())
ct = AESGCM(chave).encrypt(iv, claro, None)
b = lambda x: base64.b64encode(x).decode()
destino.parent.mkdir(parents=True, exist_ok=True)
destino.write_text(json.dumps({'v': 1, 'it': IT, 'z': z, 'salt': b(salt), 'iv': b(iv), 'ct': b(ct)}))
print('ok:', destino.relative_to(R), '·', ('referência ' if painel else 'dados até ') + ultimo, '·', resumo, '·', destino.stat().st_size // 1024, 'KB')
