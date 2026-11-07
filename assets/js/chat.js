/* Tribia — assistant du site (Claude via la fonction Supabase « site-chat »). FR/EN, liens vers les sections, demande de contact. */
(function () {
  'use strict';
  var ENDPOINT = 'https://enbvrrltsdddkzuuxqgz.supabase.co/functions/v1/site-chat';
  var KEY = 'sb_publishable_huNTxR2Xq2NHXbksOc0ILw_51_C56fB';
  var STORE = 'tribia-site-chat';
  function lang() { return document.documentElement.lang === 'en' ? 'en' : 'fr'; }
  function tx(fr, en) { return lang() === 'en' ? en : fr; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load() { try { return JSON.parse(sessionStorage.getItem(STORE) || '[]'); } catch (e) { return []; } }
  function save(m) { try { sessionStorage.setItem(STORE, JSON.stringify(m.slice(-30))); } catch (e) { } }
  var msgs = load(); var busy = false;

  /* Petit rendu Markdown sûr : gras, liens, listes, retours à la ligne. */
  function md(s) {
    var h = esc(s);
    h = h.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    h = h.replace(/\[([^\]]+)\]\((#[\w-]+|https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+)\)/g, function (_, t, u) { var ext = /^https?:/.test(u); return '<a href="' + u + '"' + (ext ? ' target="_blank" rel="noopener"' : ' data-chat-link') + '>' + t + '</a>'; });
    h = h.replace(/(^|\n)[-•] (.+)/g, '$1<span class="cb-li">• $2</span>');
    h = h.replace(/\n?(<span class="cb-li">[^]*?<\/span>)\n?/g, '$1');
    return h.replace(/\n/g, '<br>');
  }

  var SUGG = {
    fr: ['Quel forfait me conseilles-tu ?', 'C’est quoi l’énergie ⚡ ?', 'Que fait Tribia à la maison ?', 'Mes données sont-elles au Canada ?', 'Je veux une démo'],
    en: ['Which plan should I pick?', 'What is energy ⚡?', 'What does Tribia do at home?', 'Is my data in Canada?', 'I’d like a demo']
  };

  var root = document.createElement('div'); root.className = 'cb'; root.innerHTML =
    '<button class="cb-fab" type="button" aria-expanded="false" aria-controls="cb-panel"><span class="cb-fab-ico" aria-hidden="true">💬</span><span class="cb-fab-txt"></span></button>' +
    '<section class="cb-panel" id="cb-panel" role="dialog" aria-modal="false" hidden>' +
      '<header class="cb-head"><span class="cb-ava" aria-hidden="true">👑</span><div class="cb-ttl"><b>Tribia</b><small></small></div><button class="cb-x" type="button">✕</button></header>' +
      '<div class="cb-log" aria-live="polite"></div>' +
      '<div class="cb-sugg"></div>' +
      '<form class="cb-form"><textarea rows="1" maxlength="1000"></textarea><button type="submit" class="cb-send">➤</button></form>' +
      '<p class="cb-note"></p>' +
    '</section>';
  document.body.appendChild(root);
  var fab = root.querySelector('.cb-fab'), panel = root.querySelector('.cb-panel'), log = root.querySelector('.cb-log'), sugg = root.querySelector('.cb-sugg'), form = root.querySelector('.cb-form'), input = form.querySelector('textarea');

  function texts() {
    root.querySelector('.cb-fab-txt').textContent = tx('Une question ?', 'Questions?');
    root.querySelector('.cb-ttl small').textContent = tx('Assistant · répond en français et en anglais', 'Assistant · answers in English and French');
    root.querySelector('.cb-x').setAttribute('aria-label', tx('Fermer', 'Close'));
    panel.setAttribute('aria-label', tx('Assistant Tribia', 'Tribia assistant'));
    input.placeholder = tx('Écris ta question…', 'Type your question…');
    root.querySelector('.cb-send').setAttribute('aria-label', tx('Envoyer', 'Send'));
    root.querySelector('.cb-note').textContent = tx('Réponses générées par IA (Claude). Ne partage pas de mot de passe ni de carte.', 'AI-generated answers (Claude). Never share passwords or card numbers.');
    render();
  }
  function render() {
    var hello = { role: 'assistant', content: tx('Salut ! 👋 Je suis l’assistant de Tribia. Pose-moi n’importe quelle question : forfaits, énergie, Business ou Maison, sécurité… Je peux aussi te mettre en contact avec l’équipe AVA.', 'Hi! 👋 I’m Tribia’s assistant. Ask me anything: plans, energy, Business or Home, security… I can also put you in touch with the AVA team.') };
    log.innerHTML = [hello].concat(msgs).map(function (m) { return '<div class="cb-m cb-' + (m.role === 'user' ? 'me' : 'bot') + '">' + (m.role === 'user' ? esc(m.content).replace(/\n/g, '<br>') : md(m.content)) + '</div>'; }).join('') + (busy ? '<div class="cb-m cb-bot cb-typing"><i></i><i></i><i></i></div>' : '');
    sugg.innerHTML = msgs.length ? '' : SUGG[lang()].map(function (s) { return '<button type="button">' + esc(s) + '</button>'; }).join('');
    log.scrollTop = log.scrollHeight;
  }
  function open(v) {
    panel.hidden = !v; fab.setAttribute('aria-expanded', String(v)); root.classList.toggle('open', v);
    if (v) { render(); setTimeout(function () { input.focus(); }, 50); }
  }
  async function send(text) {
    text = (text || '').trim(); if (!text || busy) return;
    msgs.push({ role: 'user', content: text.slice(0, 1000) }); busy = true; save(msgs); render(); input.value = ''; grow();
    try {
      var r = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json', apikey: KEY, authorization: 'Bearer ' + KEY }, body: JSON.stringify({ messages: msgs.slice(-12), lang: lang(), page: location.pathname + location.hash }) });
      var j = await r.json();
      msgs.push({ role: 'assistant', content: j.reply || j.error || tx('Oups, réessaie dans un instant.', 'Oops, try again in a moment.') });
    } catch (e) {
      msgs.push({ role: 'assistant', content: tx('Je n’arrive pas à me connecter. Écris-nous à [aiagent@assistantvirtualai.com](mailto:aiagent@assistantvirtualai.com) ou appelle le [514-216-3359](tel:+15142163359).', 'I can’t connect right now. Email [aiagent@assistantvirtualai.com](mailto:aiagent@assistantvirtualai.com) or call [514-216-3359](tel:+15142163359).') });
    }
    busy = false; save(msgs); render();
  }
  function grow() { input.style.height = 'auto'; input.style.height = Math.min(120, input.scrollHeight) + 'px'; }

  fab.addEventListener('click', function () { open(panel.hidden); });
  root.querySelector('.cb-x').addEventListener('click', function () { open(false); fab.focus(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); } });
  input.addEventListener('input', grow);
  sugg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) send(b.textContent); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) open(false); });
  /* Lien vers une section : ouvre la bonne partie (Business / Maison) puis défile. */
  log.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-chat-link]'); if (!a) return; e.preventDefault();
    var el = document.querySelector(a.getAttribute('href')); if (!el) return;
    var zone = el.closest('.zone[data-part]');
    if (zone && zone.hidden) { var b = document.querySelector('#parts [data-part="' + zone.getAttribute('data-part') + '"]'); if (b) b.click(); }
    setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    if (window.matchMedia('(max-width: 640px)').matches) open(false);
  });
  /* Suit le changement de langue du site. */
  new MutationObserver(texts).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  texts();
  /* Lien direct : #assistant ouvre la fenêtre. */
  if (location.hash === '#assistant') open(true);
  window.TribiaChat = { open: function () { open(true); } };
})();
