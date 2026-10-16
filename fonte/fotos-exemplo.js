/* Fotos ILUSTRATIVAS para a demonstração (banco de imagens livre randomuser.me).
   Não são os corretores. Na versão final, troque por FOTOS reais do Vista embutidas na página. */
(function () {
  var W = 'https://randomuser.me/api/portraits/women/', M = 'https://randomuser.me/api/portraits/men/';
  window.__poloFotos = {
    'Maya': W + '44.jpg', 'Paloma Piteri': W + '68.jpg', 'Daniela Simões': W + '65.jpg', 'Paloma Moura': W + '79.jpg',
    'Viviane': W + '50.jpg', 'Cátia': W + '90.jpg', 'Lilian': W + '33.jpg', 'Natália': W + '21.jpg', 'Tayse Barros': W + '12.jpg',
    'Thaina': W + '57.jpg', 'Vanessa': W + '26.jpg', 'Priscila': W + '72.jpg',
    'Igor': M + '32.jpg', 'Eduardo': M + '46.jpg', 'Arthur': M + '75.jpg', 'Erick': M + '22.jpg', 'Mitsu': M + '86.jpg',
    'Montero': M + '64.jpg', 'Gustavo': M + '52.jpg', 'Matheus': M + '11.jpg'
  };
  var nm = document.getElementById('optname');
  if (nm && nm.parentNode) {
    var tag = document.createElement('span');
    tag.textContent = 'Fotos ilustrativas';
    tag.style.cssText = 'padding:6px 10px;border-radius:999px;border:1px solid #3a3a3d;font:600 12px/1 Manrope,sans-serif;color:#d4b46a;letter-spacing:.06em;white-space:nowrap';
    nm.parentNode.insertBefore(tag, nm.nextSibling);
  }
})();
