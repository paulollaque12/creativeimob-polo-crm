"""Cifra o resultado de uma consulta para o site.

  DASH_SENHA='...' python3 tools/cifrar.py resultado.json              # ranking da TV  -> docs/data.enc.json
  DASH_SENHA='...' python3 tools/cifrar.py --painel resultado.json     # Dashboard Polo -> docs/painel/data.enc.json

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
args = [a for a in args if a != '--painel']
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
    destino = R / 'docs/painel/data.enc.json'
else:
    periodos = {r[0]: r[2] for r in rows if r[1] == '_per'}
    assert {'ano', 'mes', 'mes_ant', 'sem', 'sem_ant'} <= set(periodos), 'faltam os períodos: a consulta é a sql/ranking-tv.sql?'
    assert any(r[1] != '_per' for r in rows), 'consulta sem nenhuma métrica'
    ultimo = periodos['ano'].split('|')[1]
    resumo = '%d linhas' % len(rows)
    destino = R / 'docs/data.enc.json'

dados = {'gerado': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'rows': rows}
claro = json.dumps(dados, ensure_ascii=False, separators=(',', ':')).encode()
z = 1 if painel else 0
if z:
    claro = zlib.compress(claro, 9)
salt, iv = os.urandom(16), os.urandom(12)
chave = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=IT).derive(senha.encode())
ct = AESGCM(chave).encrypt(iv, claro, None)
b = lambda x: base64.b64encode(x).decode()
destino.parent.mkdir(parents=True, exist_ok=True)
destino.write_text(json.dumps({'v': 1, 'it': IT, 'z': z, 'salt': b(salt), 'iv': b(iv), 'ct': b(ct)}))
print('ok:', destino.relative_to(R), '·', ('referência ' if painel else 'dados até ') + ultimo, '·', resumo, '·', destino.stat().st_size // 1024, 'KB')
