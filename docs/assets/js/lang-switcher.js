// Language switcher for docs.opennhp.org
// Dropdown menu with English / 简体中文 / 한국어. Clicking an option
// navigates to the equivalent page in the other language when
// possible, or falls back to that language's root.

(function () {
  var PREFIXES = { 'zh-cn': '/zh-cn', 'ko': '/ko' };
  // There is no /zh-cn/ or /ko/ landing page — each language's "Overview"
  // equivalent lives at /<lang>/overview/. Map the English root ↔ that page.
  var OVERVIEW = { 'zh-cn': '/zh-cn/overview/', 'ko': '/ko/overview/' };

  /* Pages that exist in only one language. Selecting another language
     from one of these sends the user to that language's root/overview
     instead of a non-existent path. Keep these lists in sync with the
     docs/ filesystem. */
  var ENGLISH_ONLY_PATHS = [];
  var LANG_ONLY_PATHS = {
    'zh-cn': ['/zh-cn/claw-dhp-demo/'],
    'ko': []
  };

  function currentLang(path) {
    for (var lang in PREFIXES) {
      if (path.indexOf(PREFIXES[lang] + '/') === 0) return lang;
    }
    return 'en';
  }

  function targetUrl(lang) {
    var path = window.location.pathname;
    var onLang = currentLang(path);

    if (lang === 'en') {
      if (onLang === 'en') return path;
      if (path === OVERVIEW[onLang]) return '/';
      if ((LANG_ONLY_PATHS[onLang] || []).indexOf(path) !== -1) return '/';
      return path.slice(PREFIXES[onLang].length) || '/';
    }
    // lang is 'zh-cn' or 'ko'
    if (onLang === lang) return path;
    var basePath = onLang === 'en' ? path
      : (path.slice(PREFIXES[onLang].length) || '/');
    if (basePath === '/' || basePath === '') return OVERVIEW[lang];
    if (onLang === 'en' && ENGLISH_ONLY_PATHS.indexOf(basePath) !== -1) return OVERVIEW[lang];
    if (onLang !== 'en' && (LANG_ONLY_PATHS[onLang] || []).indexOf(path) !== -1) return OVERVIEW[lang];
    return PREFIXES[lang] + basePath;
  }

  function closeMenu(button, menu) {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  function openMenu(button, menu) {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  }

  function init() {
    var button = document.getElementById('opennhp-lang-button');
    var menu = document.getElementById('opennhp-lang-menu');
    if (!button || !menu) return;

    button.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) openMenu(button, menu); else closeMenu(button, menu);
    });

    menu.addEventListener('click', function (e) {
      var item = e.target.closest('[data-lang]');
      if (!item) return;
      window.location.href = targetUrl(item.getAttribute('data-lang'));
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== button) {
        closeMenu(button, menu);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        closeMenu(button, menu);
        button.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
