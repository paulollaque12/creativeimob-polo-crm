/* Polo · versão estática (GitHub Pages)
   Lê o arquivo cifrado (AES-GCM, chave PBKDF2-SHA256; opcionalmente comprimido com zlib),
   pede a senha uma vez e a guarda neste aparelho (a mesma para o ranking e o painel).
   Configuração opcional em window.__poloCfg = { alvo: seletor, tela: function (erro) { return html } }:
   a tela precisa ter um <form id="fsenha"> com um <input id="isenha">. Sem configuração, usa a tela do ranking da TV. */
(function () {
  var CHAVE = 'polo-tv-senha';
  function b64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  async function decifrar(pkg, senha) {
    var base = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(pkg.salt), iterations: pkg.it, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    if (pkg.z && typeof DecompressionStream === 'undefined') throw new Error('sem DecompressionStream');
    var claro = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(pkg.iv) }, key, b64(pkg.ct));
    var texto = pkg.z
      ? await new Response(new Blob([claro]).stream().pipeThrough(new DecompressionStream('deflate'))).text()
      : new TextDecoder().decode(claro);
    return JSON.parse(texto);
  }
  // Painel (lembrar:false): senha só nesta aba, pedida a cada abertura. TV: fica salva no aparelho.
  function loja() { var c = window.__poloCfg || {}; return c.lembrar === false ? sessionStorage : localStorage; }
  if ((window.__poloCfg || {}).lembrar === false) { try { localStorage.removeItem(CHAVE); } catch (e) {} }
  function lerSenha() { try { return loja().getItem(CHAVE); } catch (e) { return null; } }
  function guardar(s) { try { loja().setItem(CHAVE, s); } catch (e) {} }
  function esquecer() { try { loja().removeItem(CHAVE); } catch (e) {} }
  function telaTV(erro) {
    return '<div class="st" style="background:#0b0b0c;color:#f2f0ed;display:flex;align-items:center;justify-content:center">' +
      '<form id="fsenha" style="width:640px;display:flex;flex-direction:column;align-items:center;gap:26px;text-align:center">' +
        '<div class="mono" aria-hidden="true" style="width:72px;height:72px"><i class="k"></i><i class="r"></i><i class="r"></i><i class="k"></i><b style="inset:18px;font-size:19px">P<span>R</span></b></div>' +
        '<div style="display:flex;flex-direction:column;gap:12px"><h1 style="margin:0;font:600 48px/1.1 var(--sora);letter-spacing:-.02em">Top Corretores</h1>' +
        '<p style="margin:0;font:500 21px/1.4 var(--man);color:#8f8b86">Digite a senha da Polo para abrir o ranking. Ela fica salva nesta tela.</p></div>' +
        '<label for="isenha" style="position:absolute;left:-9999px">Senha</label>' +
        '<input id="isenha" type="password" autocomplete="current-password" style="width:100%;height:72px;padding:0 24px;border-radius:14px;border:1px solid #2c2c2f;background:#151517;color:#f2f0ed;font:600 26px var(--man);text-align:center;letter-spacing:.08em">' +
        (erro ? '<p role="alert" style="margin:-8px 0 0;font:600 19px var(--man);color:#ff6b57">Senha incorreta. Tente de novo.</p>' : '') +
        '<button type="submit" style="all:unset;cursor:pointer;width:100%;height:72px;border-radius:14px;background:#b0121c;color:#fff;font:700 24px/72px var(--man);text-align:center">Entrar</button>' +
      '</form></div>';
  }
  function pedirSenha(pkg, erro) {
    var cfg = window.__poloCfg || {};
    return new Promise(function (ok) {
      var alvo = document.querySelector(cfg.alvo || '#stage');
      alvo.innerHTML = (cfg.tela || telaTV)(erro);
      if (erro === 'nav') alvo.querySelector('#fsenha').insertAdjacentHTML('beforeend', '<p class="er" role="alert" style="color:#ff6b57">Este navegador não conseguiu abrir os dados. Atualize o navegador ou use Chrome, Edge ou Safari recente.</p>');
      var inp = document.getElementById('isenha'); setTimeout(function () { inp.focus(); }, 50);
      document.getElementById('fsenha').addEventListener('submit', function (ev) {
        ev.preventDefault();
        var s = inp.value; if (!s) return;
        decifrar(pkg, s).then(function (d) { guardar(s); ok(d); }).catch(function (e) {
          // OperationError = senha errada; qualquer outro erro é limitação do navegador
          pedirSenha(pkg, e && e.name === 'OperationError' ? true : 'nav').then(ok);
        });
      });
    });
  }
  window.__poloFonte = async function () {
    var r = await fetch('data.enc.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error('http ' + r.status);
    var pkg = await r.json();
    if (/[?&#]sair\b/.test(location.href)) esquecer();   // ?sair apaga a senha salva neste navegador
    var s = lerSenha();
    if (s) { try { return await decifrar(pkg, s); } catch (e) { esquecer(); } }
    return pedirSenha(pkg, false);
  };
})();
