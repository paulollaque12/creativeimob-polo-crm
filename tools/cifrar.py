"""Cifra o resultado da consulta sql/ranking-tv.sql em docs/data.enc.json.

  DASH_SENHA='...' python3 tools/cifrar.py resultado.json

`resultado.json` pode ser o retorno do conector do BigQuery ({"rows":[{"f":[{"v":..}]}]})
ou uma lista simples [[k, m, s], ...]. A senha vem só da variável de ambiente DASH_SENHA:
nunca a grave em arquivo, commit ou mensagem.
"""
import base64
import datetime
import json
import os
import pathlib
import sys

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

R = pathlib.Path(__file__).resolve().parent.parent
IT = 250000

senha = os.environ.get('DASH_SENHA')
if not senha:
    sys.exit('Defina DASH_SENHA no ambiente.')
bruto = json.loads(pathlib.Path(sys.argv[1]).read_text())
if isinstance(bruto, dict):
    rows = [[c.get('v') for c in r['f']] for r in bruto['rows']]
else:
    rows = bruto
periodos = {r[0]: r[2] for r in rows if r[1] == '_per'}
assert {'ano', 'mes', 'mes_ant', 'sem', 'sem_ant'} <= set(periodos), 'faltam os períodos: a consulta não é a sql/ranking-tv.sql?'
assert any(r[1] != '_per' for r in rows), 'consulta sem nenhuma métrica'

dados = {'gerado': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'rows': rows}
salt, iv = os.urandom(16), os.urandom(12)
chave = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=IT).derive(senha.encode())
ct = AESGCM(chave).encrypt(iv, json.dumps(dados, ensure_ascii=False).encode(), None)
b = lambda x: base64.b64encode(x).decode()
(R / 'docs/data.enc.json').write_text(json.dumps({'v': 1, 'it': IT, 'salt': b(salt), 'iv': b(iv), 'ct': b(ct)}))
print('ok: docs/data.enc.json · dados até', periodos['ano'].split('|')[1], '·', len(rows), 'linhas')
