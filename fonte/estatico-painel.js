/* Tela de senha do Dashboard Polo (versão estática): mesma linguagem da tela do ranking —
   tela cheia preta, monograma da Polo, título em Sora, campo centralizado e botão vermelho.
   Some sozinha quando os dados abrem (painel-ui.html remove #portao). */
(function () {
  var css =
    '#portao{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:#0b0b0c;color:#f2f0ed;' +
      'padding-block:max(24px,env(safe-area-inset-top,0px)) max(24px,env(safe-area-inset-bottom,0px));' +
      'padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));font-family:var(--body)}' +
    '#portao[hidden]{display:none}' +
    '#portao form{width:min(440px,100%);display:flex;flex-direction:column;align-items:center;gap:24px;text-align:center}' +
    '#portao .pm{width:64px;height:64px;display:grid;grid-template-columns:1fr 1fr;gap:3px;position:relative}' +
    '#portao .pm i{display:block}#portao .pm .k{background:#000;box-shadow:inset 0 0 0 1px #2c2c2e}#portao .pm .r{background:#b0121c}' +
    '#portao .pm b{position:absolute;inset:16px;background:#fff;color:#151515;display:flex;align-items:center;justify-content:center;font:600 17px/1 var(--display)}' +
    '#portao .pm b span{color:#b0121c}' +
    '#portao .ey{font:600 12px/1 var(--display);letter-spacing:.26em;color:#8f8b86}' +
    '#portao h1{margin:10px 0 0;font:600 clamp(32px,5vw,42px)/1.08 var(--display);letter-spacing:-.02em}' +
    '#portao p{margin:0;font:500 16px/1.5 var(--body);color:#8f8b86;max-width:34ch}' +
    '#portao input{width:100%;height:60px;padding:0 20px;border-radius:12px;border:1px solid #2c2c2f;background:#151517;color:#f2f0ed;' +
      'font:600 20px var(--body);text-align:center;letter-spacing:.08em;outline:none;transition:border-color .15s}' +
    '#portao input:focus{border-color:#e2353e;box-shadow:0 0 0 3px rgba(226,53,62,.18)}' +
    '#portao button{all:unset;cursor:pointer;width:100%;height:60px;border-radius:12px;background:#b0121c;color:#fff;font:700 18px/60px var(--body);text-align:center;transition:background .15s}' +
    '#portao button:hover{background:#c8323a}#portao button:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '#portao .er{margin:-8px 0 0;font:600 15px var(--body);color:#ff6b57}' +
    '#portao .rod{position:absolute;left:0;right:0;bottom:max(20px,env(safe-area-inset-bottom,0px));font:500 12px var(--body);color:#5f5b57;text-align:center}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var portao = document.createElement('div');
  portao.id = 'portao'; portao.hidden = true;
  document.body.appendChild(portao);

  window.__poloCfg = {
    alvo: '#portao',
    tela: function (erro) {
      portao.hidden = false; document.documentElement.style.overflow = 'hidden';
      return '<form id="fsenha" autocomplete="on">' +
        '<div class="pm" aria-hidden="true"><i class="k"></i><i class="r"></i><i class="r"></i><i class="k"></i><b>P<span>R</span></b></div>' +
        '<div><div class="ey">POLO RESIDENCIAL</div><h1>Dashboard Polo</h1></div>' +
        '<p>Digite a senha da Polo para abrir o painel. Ela fica salva neste navegador.</p>' +
        '<label for="isenha" style="position:absolute;left:-9999px">Senha</label>' +
        '<input id="isenha" type="password" autocomplete="current-password">' +
        (erro === true ? '<p class="er" role="alert">Senha incorreta. Tente de novo.</p>' : '') +
        '<button type="submit">Entrar</button>' +
      '</form>' +
      '<div class="rod">CreativeImob · Data &amp; BI</div>';
    }
  };
})();
