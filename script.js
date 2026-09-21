/* ============================================================
   BEAR · Ceviches y Cervezas Frías — site interactivo
   ============================================================ */

(function () {
  'use strict';

  var WA_BASE = 'https://wa.me/529811332914';
  var WA_MSG_PEDIDO = '¡Hola BEAR! Quiero hacer mi pedido';

  /* ---------- Datos del menú ---------- */
  var MENU = {
    seviches: [
      { name: 'Ceviche de camarón', desc: 'El clásico, campechano, marinado al limón con cebolla morada y chile.', price: 150, featured: true, emoji: '🦐' },
      { name: 'Seviche de pescado', desc: 'Pescado fresco del día, bañado en jugo de limón con tiritas de cebolla.', price: 180, emoji: '🐟' },
      { name: 'Seviche mixto', desc: 'Mezcla de pescado y camarón en escabeche casero. Irresistible.', price: 220, emoji: '🦐🐟' },
      { name: 'Seviche de pulpo', desc: 'Pulpo tierno, jugo de cítricos y un toque de picante para valientes.', price: 280, emoji: '🐙' },
      { name: 'Coctel de mariscos', desc: 'Camaron y pescado en salsa roja bien fría, acompañar perfecto.', price: 250, emoji: '🍤' },
      { name: 'Tostadas de seviche', desc: 'Crujientes, con seviche fresco encima y aguacate.', price: 160, emoji: '🌮' },
      { name: 'Seviche de la casa', desc: 'La especialidad de BEAR con cítricos, mango y un toque especial.', price: 320, featured: true, emoji: '✨' },
      { name: 'Plato para compartir', desc: 'Para llegar y devorar entre varios. Bien cargado de mar.', price: 350, emoji: '🍽️' }
    ],
    cervezas: [
      { name: 'Cerveza bien fría', desc: 'Escarchada, al punto. Nuestra razón de existir.', price: 55, featured: true, emoji: '🍺' },
      { name: 'Six de cerveza', desc: 'Para que la fiesta no se acabe. Bien heladita.', price: 300, emoji: '🍺🍺' },
      { name: 'Cerveza + seviche', desc: 'El combo perfecto: fría y fresca, todo junto.', price: 200, emoji: '🤝' },
      { name: 'Cerveza de barril', desc: 'Tirada al momento, espuma perfecta.', price: 80, emoji: '🍻' }
    ]
  };

  /* ---------- Utilidades ---------- */
  function $ (sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$ (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

  function buildItem (item, category) {
    var node = document.createElement('article');
    node.className = 'menu-item ' + category;
    node.style.animationDelay = Math.random() * 0.18 + 's';

    var emoji = document.createElement('span');
    emoji.className = 'm-emoji';
    emoji.textContent = item.emoji;

    var body = document.createElement('div');
    body.className = 'm-body';

    var name = document.createElement('h3');
    name.className = 'm-name';
    name.textContent = item.name;

    var desc = document.createElement('p');
    desc.className = 'm-desc';
    desc.textContent = item.desc;

    body.appendChild(name);
    body.appendChild(desc);

    if (item.featured) {
      var badge = document.createElement('span');
      badge.className = 'm-featured';
      badge.textContent = '★ Favorito';
      body.appendChild(badge);
    }

    var price = document.createElement('span');
    price.className = 'm-price';
    price.textContent = money.format(item.price);

    node.appendChild(emoji);
    node.appendChild(body);
    node.appendChild(price);

    node.addEventListener('click', function () {
      showToast(item.name + ' · ' + money.format(item.price) + ' — ¡pídelo! 🍤');
    });

    return node;
  }

  function renderMenu (category) {
    var list = $('#menuList');
    if (!list) return;
    list.innerHTML = '';
    (MENU[category] || []).forEach(function (item) {
      list.appendChild(buildItem(item, category));
    });
  }

  /* ---------- Loader ---------- */
  function hideLoader () {
    var loader = $('#loader');
    if (loader) loader.classList.add('is-hidden');
    setTimeout(function () { if (loader) loader.remove(); }, 550);
  }

  /* ---------- Header scroll ---------- */
  function onScroll () {
    var header = $('#siteHeader');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 30);

    var links = $$('.nav-link');
    var sections = ['inicio', 'nosotros', 'menu', 'visitanos', 'contacto'];
    var pos = window.scrollY + 120;
    var current = 'inicio';

    sections.forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec && sec.offsetTop <= pos) current = id;
    });

    links.forEach(function (link) {
      var target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('is-active', target === current);
    });
  }

  /* ---------- Navegación móvil ---------- */
  function setupNav () {
    var toggle = $('#navToggle');
    var nav = $('#nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    $$('.nav-link', nav).forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Tabs del menú ---------- */
  function setupTabs () {
    var tabs = $$('.tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        renderMenu(tab.getAttribute('data-cat'));
      });
    });
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function showToast (msg) {
    var toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  function setupReveal () {
    var revealEls = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Footer year ---------- */
  function setYear () {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Inicio ---------- */
  function init () {
    renderMenu('seviches');
    setupNav();
    setupTabs();
    setupReveal();
    setYear();

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 2600);

    var waLink = $('#navCta');
    if (waLink) {
      waLink.addEventListener('click', function () {
        showToast('¡Abriendo WhatsApp! 👋');
      });
    }
    var waFloat = $('.wa-float');
    if (waFloat) {
      waFloat.addEventListener('click', function () {
        showToast('¡Tu pedido va en camino! 🍤');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();