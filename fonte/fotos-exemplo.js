/* Fotos ILUSTRATIVAS para a demonstração: rostos gerados por IA (StyleGAN, thispersondoesnotexist.com),
   publicados pelo projeto acadêmico Which Face Is Real (whichfaceisreal.com). São pessoas que não existem.
   Na versão final, troque pelas fotos reais do Vista embutidas na página. */
(function () {
  var B = 'https://whichfaceisreal.blob.core.windows.net/public/fakeimages/';
  var F = {
    'Maya': 'image-2019-02-17_040334.jpeg', 'Paloma Piteri': 'image-2019-02-19_020706.jpeg',
    'Daniela Simões': 'image-2019-02-17_034042.jpeg', 'Paloma Moura': 'image-2019-02-17_054348.jpeg',
    'Viviane': 'image-2019-02-17_033302.jpeg', 'Cátia': 'image-2019-02-17_201227.jpeg',
    'Lilian': 'image-2019-02-18_202522.jpeg', 'Natália': 'image-2019-02-18_003738.jpeg',
    'Tayse Barros': 'image-2019-02-18_124111.jpeg', 'Thaina': 'image-2019-02-18_234427.jpeg',
    'Vanessa': 'image-2019-02-18_072307.jpeg', 'Priscila': 'image-2019-02-19_043547.jpeg',
    'Igor': 'image-2019-02-18_052652.jpeg', 'Eduardo': 'image-2019-02-18_201506.jpeg',
    'Arthur': 'image-2019-02-18_170842.jpeg', 'Erick': 'image-2019-02-18_043012.jpeg',
    'Mitsu': 'image-2019-02-18_090318.jpeg', 'Montero': 'image-2019-02-17_151148.jpeg',
    'Gustavo': 'image-2019-02-17_065455.jpeg', 'Matheus': 'image-2019-02-19_033458.jpeg'
  };
  window.__poloFotos = {};
  Object.keys(F).forEach(function (k) { window.__poloFotos[k] = B + F[k]; });
  var nm = document.getElementById('optname');
  if (nm && nm.parentNode) {
    var tag = document.createElement('span');
    tag.textContent = 'Fotos ilustrativas · rostos gerados por IA';
    tag.style.cssText = 'padding:6px 10px;border-radius:999px;border:1px solid #3a3a3d;font:600 12px/1 Manrope,sans-serif;color:#d4b46a;letter-spacing:.04em;white-space:nowrap';
    nm.parentNode.insertBefore(tag, nm.nextSibling);
  }
})();
