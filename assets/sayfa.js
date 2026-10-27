/* Tılsım Perisi · prompt sayfaları: kopyalama, sekmeler, içindekiler */
document.documentElement.classList.add('js');

(function () {
  function eskiYolla(metin) {
    var t = document.createElement('textarea');
    t.value = metin;
    t.setAttribute('readonly', '');
    t.style.position = 'fixed'; t.style.top = '0'; t.style.opacity = '0';
    document.body.appendChild(t);
    t.focus(); t.select();
    var oldu = false;
    try { oldu = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(t);
    return oldu;
  }

  function goster(d, yazi, sinif) {
    var etiket = d.querySelector('.yazi');
    clearTimeout(d._zaman);
    d.classList.remove('tamam', 'olmadi');
    d.classList.add(sinif);
    etiket.textContent = yazi;
    d._zaman = setTimeout(function () {
      d.classList.remove('tamam', 'olmadi');
      etiket.textContent = 'Kopyala';
    }, 2000);
  }

  document.querySelectorAll('.kopyala').forEach(function (d) {
    d.addEventListener('click', function () {
      var hedef = document.getElementById(d.getAttribute('data-hedef'));
      if (!hedef) return;
      var metin = hedef.innerText.replace(/\s+$/, '') + (hedef.hasAttribute('data-son-satir') ? '\n' : '');
      var basari = function () { goster(d, 'Kopyalandı', 'tamam'); };
      var hata = function () {
        if (eskiYolla(metin)) { basari(); return; }
        goster(d, 'Seçip kopyalayın', 'olmadi');
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(metin).then(basari, hata);
      } else { hata(); }
    });
  });

  // Sekmeler (Google E-Tablolar / Excel)
  document.querySelectorAll('.sekmeler').forEach(function (grup) {
    var dugmeler = Array.prototype.slice.call(grup.querySelectorAll('[role="tab"]'));
    function sec(secilen, odakla) {
      dugmeler.forEach(function (b) {
        var acik = b === secilen;
        b.setAttribute('aria-selected', acik ? 'true' : 'false');
        b.tabIndex = acik ? 0 : -1;
        document.getElementById(b.getAttribute('aria-controls')).hidden = !acik;
      });
      if (odakla) secilen.focus();
      try { localStorage.setItem('tp-sekme', secilen.getAttribute('data-ad')); } catch (e) {}
    }
    dugmeler.forEach(function (b, i) {
      b.addEventListener('click', function () { sec(b); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          var yon = e.key === 'ArrowRight' ? 1 : -1;
          sec(dugmeler[(i + yon + dugmeler.length) % dugmeler.length], true);
          e.preventDefault();
        }
      });
    });
    var kayitli = null;
    try { kayitli = localStorage.getItem('tp-sekme'); } catch (e) {}
    var ilk = dugmeler.filter(function (b) { return b.getAttribute('data-ad') === kayitli; })[0] || dugmeler[0];
    sec(ilk);
  });

  // İçindekiler: görünen adımı işaretle
  var baglantilar = document.querySelectorAll('.icindekiler a');
  if (baglantilar.length && 'IntersectionObserver' in window) {
    var harita = {};
    baglantilar.forEach(function (a) { harita[a.getAttribute('href').slice(1)] = a; });
    var gozcu = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (g.isIntersecting) {
          baglantilar.forEach(function (a) { a.classList.remove('etkin'); });
          var a = harita[g.target.id];
          if (a) a.classList.add('etkin');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(harita).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) gozcu.observe(el);
    });
  }
})();
