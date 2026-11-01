(() => {
  'use strict';

  const KEY = 'challengeTracker.v1';
  const MAX_RULES = 12;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const state = { data: null, selected: 0, mode: 'new', view: 'dash', overlay: null, lastFocus: null, toastTimer: 0, quoteOffset: 0 };

  /* ---------------- dates ---------------- */
  const pad = (n) => String(n).padStart(2, '0');
  function parseDate(value) {
    const [y, m, d] = String(value).split('-').map(Number);
    return new Date(y, m - 1, d, 12);
  }
  const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n, 12);
  function todayNoon() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  }
  function todayISO() {
    const now = todayNoon();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }
  const diffDays = (a, b) => Math.round((a - b) / 86400000);

  const fmt = {
    short: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }),
    full: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    month: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }),
  };

  /* ---------------- data ---------------- */
  const challenge = () => state.data.challenge;
  const ruleCount = () => challenge().rules.length;
  const dayDate = (i) => addDays(parseDate(challenge().start), i);

  function entry(i) {
    const day = state.data?.days?.[i];
    if (day) return day;
    return { checks: [], note: '', photo: '' };
  }
  function ensureEntry(i) {
    const days = state.data.days;
    if (!days[i] || !Array.isArray(days[i].checks)) {
      days[i] = { checks: Array(ruleCount()).fill(false), note: days[i]?.note || '', photo: days[i]?.photo || '' };
    }
    while (days[i].checks.length < ruleCount()) days[i].checks.push(false);
    return days[i];
  }
  const isComplete = (i) => {
    const day = state.data?.days?.[i];
    if (!day || !Array.isArray(day.checks)) return false;
    return day.checks.length === ruleCount() && ruleCount() > 0 && day.checks.every(Boolean);
  };
  const GRACE_HOURS = 24;
  function dayEndTime(i) {
    const d = dayDate(i);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0).getTime();
  }
  function graceMsLeft(i) {
    return GRACE_HOURS * 3600000 - (Date.now() - dayEndTime(i));
  }
  const inGrace = (i) => graceMsLeft(i) > 0;
  function dayPhase(i) {
    const idx = currentIndex();
    if (i > idx) return 'future';
    if (i === idx) return 'today';
    return inGrace(i) ? 'grace' : 'past';
  }
  const isEditableDay = (i) => {
    const phase = dayPhase(i);
    return phase === 'today' || phase === 'grace';
  };
  function graceText(i) {
    const minutes = Math.max(1, Math.ceil(graceMsLeft(i) / 60000));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours <= 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  }
  const doneCount = (i) => {
    const day = state.data?.days?.[i];
    return day && Array.isArray(day.checks) ? day.checks.filter(Boolean).length : 0;
  };
  const currentIndex = () => diffDays(todayNoon(), parseDate(challenge().start));
  const clampIndex = (i) => Math.max(0, Math.min(challenge().duration - 1, i));

  function streakCount() {
    const length = challenge().duration;
    const idx = currentIndex();
    if (idx < 0) return 0;
    let i = Math.min(idx, length - 1);
    let count = 0;
    if (!isComplete(i)) i -= 1;
    for (; i >= 0; i -= 1) {
      if (isComplete(i)) count += 1;
      else break;
    }
    return count;
  }
  const completedCount = () => {
    let n = 0;
    for (let i = 0; i < challenge().duration; i += 1) if (isComplete(i)) n += 1;
    return n;
  };

  function loadData() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const c = parsed?.challenge;
      if (!c || typeof c.name !== 'string' || !c.name.trim()) return null;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(c.start))) return null;
      if (!Number.isFinite(Number(c.duration)) || Number(c.duration) < 1 || Number(c.duration) > 365) return null;
      if (!Array.isArray(c.rules) || !c.rules.length) return null;
      return {
        challenge: {
          name: c.name.trim().slice(0, 50),
          start: c.start,
          duration: Math.round(Number(c.duration)),
          rules: c.rules.slice(0, MAX_RULES).map((r) => ({
            name: String(r?.name || '').slice(0, 70),
            desc: String(r?.desc || '').slice(0, 120),
          })).filter((r) => r.name),
        },
        days: parsed.days && typeof parsed.days === 'object' ? parsed.days : {},
      };
    } catch (error) {
      return null;
    }
  }

  let quotaWarned = false;
  function persist(notify = true) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.data));
      return true;
    } catch (error) {
      if (notify && !quotaWarned) {
        quotaWarned = true;
        toast('Storage is full. Try a smaller photo.');
      }
      return false;
    }
  }

  /* ---------------- chrome helpers ---------------- */
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => el.classList.remove('show'), 3200);
  }

  function celebrate() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = $('#confetti');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['#ffc34e', '#fa7048', '#c7ff6b', '#6e65ec', '#f3f1f4'];
    const parts = Array.from({ length: 90 }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.38,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 12 - 3,
      w: 4 + Math.random() * 6,
      h: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.32,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
    }));
    let start = performance.now();
    let frame = 0;
    function tick(now) {
      const dt = Math.min(2, (now - start) / 16.67);
      start = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      for (const p of parts) {
        p.vy += 0.33 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.life += dt;
        if (p.y < window.innerHeight + 60) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - p.life / 120);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) frame = requestAnimationFrame(tick);
      else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        cancelAnimationFrame(frame);
      }
    }
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  }

  /* ---------------- overlays ---------------- */
  function openOverlay(name) {
    if (state.overlay === name) return;
    if (state.overlay) closeOverlay(false);
    state.lastFocus = document.activeElement;
    state.overlay = name;
    $('#scrim').classList.add('open');
    const el = $(`#${name}`);
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      el.focus({ preventScroll: true });
    }, 60);
  }

  function closeOverlay(restore = true) {
    if (!state.overlay) return;
    const el = $(`#${state.overlay}`);
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    $('#scrim').classList.remove('open');
    const was = state.overlay;
    state.overlay = null;
    document.body.style.overflow = '';
    if (restore) state.lastFocus?.focus?.({ preventScroll: true });
    if (state.data && was === 'sheet') renderDashboard();
  }

  function openDay(i) {
    if (!state.data) return;
    state.selected = clampIndex(i);
    if (state.overlay !== 'sheet') openOverlay('sheet');
    renderSheet();
    $('#sheet').scrollTop = 0;
  }

  /* ---------------- setup ---------------- */
  function ruleRow(name = '', desc = '') {
    const row = document.createElement('div');
    row.className = 'rule-edit';
    row.innerHTML = `<div class="fields"><input class="rule-name" maxlength="70" aria-label="Rule name" placeholder="Rule name"><input class="rule-desc" maxlength="120" aria-label="Rule instructions" placeholder="Short instructions (optional)"></div><button class="icon-button" type="button" aria-label="Remove rule">×</button>`;
    row.querySelector('.rule-name').value = name;
    row.querySelector('.rule-desc').value = desc;
    row.querySelector('button').addEventListener('click', () => {
      if ($('#ruleFields').children.length > 1) row.remove();
      else $('#formError').textContent = 'Keep at least one daily rule.';
      syncChips();
    });
    $('#ruleFields').append(row);
    return row;
  }

  function syncChips() {
    const value = Number($('#formDuration').value);
    $$('#durationChips .chip').forEach((chip) => {
      chip.setAttribute('aria-pressed', String(Number(chip.dataset.days) === value));
    });
  }

  function setupChrome() {
    const editing = state.mode === 'edit' && state.data;
    $('#setupEyebrow').textContent = editing ? 'Challenge settings' : 'New challenge';
    $('#setupTitle').textContent = editing ? 'Adjust the plan.' : 'Build your challenge.';
    $('#setupLede').textContent = editing
      ? 'Change the name, dates, length or rules. The days you already logged stay where they are.'
      : 'Choose how many days you are committing to, then write the rules that make a day count.';
    $('#setupSubmit').textContent = editing ? 'Save changes' : 'Start challenge';
    $('#setupCancel').hidden = !editing;
    $('#newChallenge').hidden = !editing;
  }

  function openSetup(mode) {
    state.mode = mode;
    closeOverlay();
    const editing = mode === 'edit' && state.data;
    const c = state.data?.challenge;
    $('#formError').textContent = '';
    $('#formName').value = editing ? c.name : '';
    $('#formDate').value = editing ? c.start : todayISO();
    $('#formDuration').value = editing ? c.duration : 30;
    $('#ruleFields').innerHTML = '';
    const rules = editing ? c.rules : [{ name: '', desc: '' }];
    rules.forEach((r) => ruleRow(r.name, r.desc));
    syncChips();
    renderGuide();
    setupChrome();
    $('#setupView').hidden = false;
    $('#dashView').hidden = true;
    $('#settingsBtn').hidden = true;
    state.view = 'setup';
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function reconcileDays() {
    const length = challenge().duration;
    const count = ruleCount();
    const days = state.data.days;
    Object.keys(days).forEach((key) => {
      const i = Number(key);
      if (!Number.isInteger(i) || i < 0 || i >= length) {
        delete days[key];
        return;
      }
      const existing = Array.isArray(days[key].checks) ? days[key].checks : [];
      days[key] = {
        checks: Array.from({ length: count }, (_, j) => Boolean(existing[j])),
        note: typeof days[key].note === 'string' ? days[key].note : '',
        photo: typeof days[key].photo === 'string' ? days[key].photo : '',
      };
    });
  }

  /* ---------------- dashboard ---------------- */
  function eyebrowText() {
    const idx = currentIndex();
    const length = challenge().duration;
    if (idx < 0) {
      const away = -idx;
      return away === 1 ? 'Your challenge · Starts tomorrow' : `Your challenge · Starts in ${away} days`;
    }
    if (idx >= length) return `Your challenge · ${length} days on record`;
    return `Your challenge · Day ${idx + 1} of ${length}`;
  }

  function renderQuote() {
    const list = window.CHALLENGE_QUOTES || [];
    if (!list.length) return;
    const ordinal = Math.floor(todayNoon().getTime() / 86400000);
    const quote = list[(((ordinal + state.quoteOffset) % list.length) + list.length) % list.length];
    $('#quoteLabel').textContent = "Today's fuel";
    $('#quoteText').textContent = quote.t;
    $('#quoteAuthor').textContent = quote.a;
  }

  function renderGuide() {
    const presets = window.CHALLENGE_PRESETS || [];
    const tips = window.CHALLENGE_TIPS || [];
    $('#presets').innerHTML = presets.map((preset) => `<button class="preset" type="button" data-preset="${esc(preset.id)}"><strong>${esc(preset.name)}</strong><p>${esc(preset.desc)}</p><span class="preset-meta">${esc(`${preset.rules.length} rules · suggests ${preset.days} days`)}</span></button>`).join('');
    $('#tipList').innerHTML = tips.map((tip) => `<li><div><strong>${esc(tip.title)}</strong>${esc(tip.body)}</div></li>`).join('');
  }

  function applyPreset(id) {
    const preset = (window.CHALLENGE_PRESETS || []).find((item) => item.id === id);
    if (!preset) return;
    $('#ruleFields').innerHTML = '';
    preset.rules.forEach((rule) => ruleRow(rule.name, rule.desc));
    $('#formDuration').value = preset.days;
    syncChips();
    $('#formError').textContent = '';
    setupChrome();
    toast(`${preset.name} loaded — adjust anything.`);
    const target = $('#ruleFields');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.querySelector('input')?.focus({ preventScroll: true });
  }

  function renderDashboard() {
    if (!state.data) return;
    const c = challenge();
    const length = c.duration;
    const idx = currentIndex();
    const done = completedCount();
    const pct = Math.round((done / length) * 100);

    $('#setupView').hidden = true;
    $('#dashView').hidden = false;
    $('#settingsBtn').hidden = false;
    state.view = 'dash';

    $('#challengeLabel').textContent = eyebrowText();
    $('#challengeTitle').textContent = c.name;
    $('#challengeDetail').textContent = ruleCount() === 1
      ? 'One daily rule. One day at a time.'
      : `${ruleCount()} daily rules. One day at a time.`;
    const todayIndex = Math.min(Math.max(idx, 0), length - 1);
    if (idx < 0) {
      $('#todaySub').textContent = `Starts ${fmt.short.format(dayDate(0))}`;
    } else if (idx >= length) {
      $('#todaySub').textContent = `${length} days on record`;
    } else {
      const doneToday = doneCount(todayIndex);
      $('#todaySub').textContent = isComplete(todayIndex)
        ? `Day ${todayIndex + 1} · all rules checked`
        : `Day ${todayIndex + 1} · ${doneToday} of ${ruleCount()} done`;
    }
    $('#streak').textContent = streakCount();
    $('#finished').textContent = done;
    $('#percent').textContent = `${pct}%`;
    $('#progressFill').style.width = `${(done / length) * 100}%`;
    $('#progressNote').textContent = `${done} of ${length} days complete`;

    const groups = [];
    for (let i = 0; i < length; i += 1) {
      const key = fmt.month.format(dayDate(i));
      const last = groups[groups.length - 1];
      if (!last || last.key !== key) groups.push({ key, items: [i] });
      else last.items.push(i);
    }

    $('#calendar').innerHTML = groups.map((group) => {
      const from = group.items[0] + 1;
      const to = group.items[group.items.length - 1] + 1;
      const tiles = group.items.map((i) => {
        const complete = isComplete(i);
        const count = doneCount(i);
        let cls = 'day';
        if (complete) cls += ' done';
        else if (count > 0) cls += ' partial';
        else if (idx >= 0 && i < idx) cls += ' missed';
        else if (i > idx) cls += ' future';
        if (i === Math.min(idx, length - 1) && idx >= 0 && idx < length) cls += ' current';
        if (state.overlay === 'sheet' && i === state.selected) cls += ' selected';
        const status = complete
          ? 'complete'
          : count
            ? `${count} of ${ruleCount()} tasks done`
            : 'nothing checked yet';
        const label = `Day ${i + 1}, ${fmt.short.format(dayDate(i))}, ${status}`;
        const meta = complete ? '✓' : count ? `${count}/${ruleCount()}` : '';
        return `<button class="${cls}" type="button" data-day="${i}" aria-label="${esc(label)}"><strong>${String(i + 1).padStart(2, '0')}</strong><small>${esc(meta)}</small></button>`;
      }).join('');
      return `<div class="month"><div class="month-label"><span>${esc(group.key)}</span><span class="month-range">${esc(`Days ${from}–${to}`)}</span></div><div class="tiles">${tiles}</div></div>`;
    }).join('');

    renderQuote();
  }

  function renderSheet() {
    if (!state.data || state.overlay !== 'sheet') return;
    const c = challenge();
    const day = entry(state.selected);
    const checks = Array.isArray(day.checks) ? day.checks : [];
    const count = checks.filter(Boolean).length;
    const complete = isComplete(state.selected);
    const phase = dayPhase(state.selected);
    const locked = !isEditableDay(state.selected);

    $('#sheetEyebrow').textContent = fmt.full.format(dayDate(state.selected)).toUpperCase();
    $('#sheetTitle').textContent = `Day ${state.selected + 1}`;
    $('#sheetSub').textContent = promisesText(count);
    $('#prevDay').disabled = state.selected === 0;
    $('#nextDay').disabled = state.selected === c.duration - 1;

    $('#taskList').innerHTML = c.rules.map((rule, i) => `<label class="task${locked ? ' locked' : ''}"><input type="checkbox" data-task="${i}" ${checks[i] ? 'checked' : ''} ${locked ? 'disabled' : ''}><span class="check" aria-hidden="true"></span><span class="task-text"><strong>${esc(rule.name)}</strong>${rule.desc ? `<small>${esc(rule.desc)}</small>` : ''}</span></label>`).join('');

    const editable = !locked;
    const noteEditable = phase !== 'future';
    $('#taskList').classList.toggle('is-locked', locked);

    $('#reflection').value = day.note || '';
    $('#reflection').readOnly = !noteEditable;
    $('#reflection').classList.toggle('is-locked', !noteEditable);
    $('#reflection').placeholder = noteEditable ? 'How did today feel? What did you learn?' : 'Not open yet.';
    $('#noteLabelText').textContent = noteEditable ? 'A note to your future self' : 'This note opens on the day';

    const notice = $('#dayNotice');
    notice.classList.toggle('is-grace', phase === 'grace');
    if (phase === 'grace') {
      notice.textContent = `Still open for ${graceText(state.selected)} — fix anything you missed before it closes.`;
      notice.hidden = false;
    } else if (phase === 'past') {
      notice.textContent = 'This day is closed and progress is locked. The note is still yours to write.';
      notice.hidden = false;
    } else if (phase === 'future') {
      notice.textContent = `This day hasn't started yet. Come back on ${fmt.full.format(dayDate(state.selected))} to check in.`;
      notice.hidden = false;
    } else {
      notice.hidden = true;
      notice.textContent = '';
    }

    $('#doneBanner').hidden = !complete;
    $('#completionMessage').textContent = complete ? 'Day complete ✦' : '';
    $('#photoImage').src = day.photo || '';
    $('#photoImage').alt = day.photo ? 'Progress photo for this day' : '';
    $('#photoPreview').hidden = !day.photo;
    $('#photoRemove').hidden = !day.photo || !editable;
    $('#photoAdd').hidden = !editable;
    $('#photoAdd').textContent = day.photo ? 'Change photo' : 'Add photo';
    $('#photoHint').textContent = editable
      ? (day.photo ? "Saved with this day's log." : 'Stored on this device only.')
      : 'Photos can be added on the day.';
  }

  /* ---------------- actions ---------------- */
  function promisesText(done) {
    const total = ruleCount();
    return total === 1 ? `${done} of 1 task done` : `${done} of ${total} tasks done`;
  }

  function updateSheetSummary() {
    const checks = entry(state.selected).checks || [];
    const complete = isComplete(state.selected);
    $('#sheetSub').textContent = promisesText(checks.filter(Boolean).length);
    $('#doneBanner').hidden = !complete;
    $('#completionMessage').textContent = complete ? 'Day complete ✦' : '';
  }

  function handleTaskChange(input) {
    const i = Number(input.dataset.task);
    if (!Number.isInteger(i)) return;
    if (!isEditableDay(state.selected)) {
      input.checked = !input.checked;
      toast(dayPhase(state.selected) === 'future'
        ? "This day hasn't started yet."
        : 'That day is closed. You had 24 hours to fix it — now only the note can change.');
      return;
    }
    const wasComplete = isComplete(state.selected);
    const day = ensureEntry(state.selected);
    day.checks[i] = input.checked;
    persist();
    updateSheetSummary();
    renderDashboard();
    if (!wasComplete && isComplete(state.selected)) {
      celebrate();
      toast(`Day ${state.selected + 1} complete · ${streakCount()}-day streak`);
    }
  }

  function resizeImage(file, maxSize = 1100, quality = 0.72) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('image decode failed'));
      };
      img.src = url;
    });
  }

  async function handlePhoto(file) {
    if (!isEditableDay(state.selected)) return;
    if (!file.type.startsWith('image/')) {
      toast('That image could not be loaded.');
      return;
    }
    $('#photoHint').textContent = 'Preparing photo…';
    try {
      const dataUrl = await resizeImage(file);
      const day = ensureEntry(state.selected);
      const previous = day.photo;
      day.photo = dataUrl;
      if (!persist()) {
        day.photo = previous;
        renderSheet();
        return;
      }
      renderSheet();
      renderDashboard();
      toast('Photo saved to this day.');
    } catch (error) {
      toast('That image could not be loaded.');
      renderSheet();
    }
  }

  function openConfirm() {
    if (!state.data) {
      openSetup('new');
      return;
    }
    openOverlay('confirm');
  }

  /* ---------------- wiring ---------------- */
  function bindEvents() {
    $('#calendar').addEventListener('click', (event) => {
      const tile = event.target.closest('[data-day]');
      if (tile) openDay(Number(tile.dataset.day));
    });
    $('#goToday').addEventListener('click', () => {
      const idx = currentIndex();
      openDay(idx < 0 ? 0 : idx);
    });
    $('#closeSheet').addEventListener('click', () => closeOverlay());
    $('#prevDay').addEventListener('click', () => openDay(state.selected - 1));
    $('#nextDay').addEventListener('click', () => openDay(state.selected + 1));
    $('#scrim').addEventListener('click', () => closeOverlay());
    $('#confirmCancel').addEventListener('click', () => closeOverlay());
    $('#confirmGo').addEventListener('click', () => {
      try { localStorage.removeItem(KEY); } catch (error) { /* storage unavailable */ }
      state.data = null;
      state.selected = 0;
      closeOverlay(false);
      openSetup('new');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeOverlay();
        return;
      }
      if (state.overlay === 'sheet' && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        if (event.target.closest('textarea, input')) return;
        const next = state.selected + (event.key === 'ArrowRight' ? 1 : -1);
        if (next >= 0 && next < challenge().duration) {
          event.preventDefault();
          openDay(next);
        }
      }
    });

    $('#taskList').addEventListener('change', (event) => {
      const input = event.target.closest('input[data-task]');
      if (input) handleTaskChange(input);
    });

    $('#reflection').addEventListener('input', (event) => {
      if (dayPhase(state.selected) === 'future') {
        event.target.value = entry(state.selected).note || '';
        return;
      }
      const day = ensureEntry(state.selected);
      day.note = event.target.value.slice(0, 1200);
      persist();
    });

    $('#photoAdd').addEventListener('click', () => {
      if (!isEditableDay(state.selected)) return;
      $('#photoInput').click();
    });
    $('#photoInput').addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (file) handlePhoto(file);
    });
    $('#photoRemove').addEventListener('click', () => {
      if (!isEditableDay(state.selected)) return;
      const day = ensureEntry(state.selected);
      const previous = day.photo;
      day.photo = '';
      if (!persist()) day.photo = previous;
      renderSheet();
      renderDashboard();
    });

    $('#quoteNext').addEventListener('click', () => {
      state.quoteOffset += 1;
      renderQuote();
    });
    $('#settingsBtn').addEventListener('click', () => openSetup(state.data ? 'edit' : 'new'));
    $('#newChallenge').addEventListener('click', openConfirm);
    $('#setupCancel').addEventListener('click', () => {
      if (!state.data) return;
      state.mode = 'edit';
      $('#setupView').hidden = true;
      renderDashboard();
      window.scrollTo({ top: 0, behavior: 'auto' });
    });

    $('#formDuration').addEventListener('input', syncChips);
    $('#durationChips').addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (!chip) return;
      $('#formDuration').value = chip.dataset.days;
      syncChips();
    });

    $('#addRule').addEventListener('click', () => {
      if ($('#ruleFields').children.length >= MAX_RULES) {
        $('#formError').textContent = `Limit: ${MAX_RULES} daily rules.`;
        return;
      }
      $('#formError').textContent = '';
      const row = ruleRow();
      row.querySelector('.rule-name').focus();
    });

    $('#presets').addEventListener('click', (event) => {
      const button = event.target.closest('[data-preset]');
      if (button) applyPreset(button.dataset.preset);
    });

    $('#ideaChips').addEventListener('click', (event) => {
      const chip = event.target.closest('.idea-chip');
      if (!chip) return;
      if ($('#ruleFields').children.length >= MAX_RULES) {
        $('#formError').textContent = `Limit: ${MAX_RULES} daily rules.`;
        return;
      }
      const empty = $$('.rule-edit').find((row) => !row.querySelector('.rule-name').value.trim() && !row.querySelector('.rule-desc').value.trim());
      const target = empty || ruleRow();
      target.querySelector('.rule-name').value = chip.textContent.trim();
      target.querySelector('.rule-name').focus();
    });

    $('#setupForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('#formName').value.trim();
      const start = $('#formDate').value;
      const duration = Math.round(Number($('#formDuration').value));
      const rules = $$('.rule-edit')
        .map((row) => ({ name: row.querySelector('.rule-name').value.trim().slice(0, 70), desc: row.querySelector('.rule-desc').value.trim().slice(0, 120) }))
        .filter((rule) => rule.name);
      const error = $('#formError');

      if (!name) {
        error.textContent = 'Give your challenge a name.';
        $('#formName').focus();
        return;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) {
        error.textContent = 'Pick a valid start date.';
        $('#formDate').focus();
        return;
      }
      if (!Number.isFinite(duration) || duration < 1 || duration > 365) {
        error.textContent = 'Choose between 1 and 365 days.';
        $('#formDuration').focus();
        return;
      }
      if (!rules.length) {
        error.textContent = 'Add at least one named daily rule.';
        return;
      }
      error.textContent = '';

      if (state.mode === 'edit' && state.data) {
        state.data.challenge = { name, start, duration, rules };
        reconcileDays();
        state.selected = clampIndex(state.selected);
        persist();
        $('#setupView').hidden = true;
        renderDashboard();
        toast('Challenge updated.');
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      state.data = { challenge: { name, start, duration, rules }, days: {} };
      state.quoteOffset = 0;
      persist();
      state.selected = clampIndex(currentIndex());
      renderDashboard();
      toast('Challenge started. Day 1 is waiting.');
      window.scrollTo({ top: 0, behavior: 'auto' });
      openDay(state.selected);
    });
  }

  /* ---------------- boot ---------------- */
  function showSetupView() {
    $('#setupView').hidden = false;
    $('#dashView').hidden = true;
    $('#settingsBtn').hidden = true;
    state.view = 'setup';
  }

  function boot() {
    state.data = loadData();
    bindEvents();
    if (state.data) {
      renderDashboard();
    } else {
      state.mode = 'new';
      openSetup('new');
    }
  }

  boot();
})();
