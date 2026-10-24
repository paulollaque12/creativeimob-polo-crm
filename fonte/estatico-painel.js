/* Tela de senha do Dashboard Polo (versão estática). Usa as classes e tokens do próprio painel. */
window.__poloCfg = {
  alvo: '#view',
  tela: function (erro) {
    return '<form id="fsenha" class="state" style="max-width:440px">' +
      '<h2>Dashboard Polo</h2>' +
      '<p>Digite a senha da Polo para abrir o painel. Ela fica salva neste navegador.</p>' +
      '<label class="fld" for="isenha" style="width:100%"><span>Senha</span>' +
        '<input id="isenha" class="ctl" type="password" autocomplete="current-password" style="width:100%;height:44px;font-size:16px"></label>' +
      (erro ? '<p role="alert" style="color:var(--red);font-weight:600">Senha incorreta. Tente de novo.</p>' : '') +
      '<button class="btn" type="submit">Entrar</button>' +
    '</form>';
  }
};
