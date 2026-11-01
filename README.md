<div align="center">

<img src="https://capsule-render.vercel.app/api?type=blur&color=0:08090d,60:1b1508,100:ffc34e&height=240&section=header&text=Challenge%20Tracker&fontSize=60&fontColor=f3f1f4&fontAlignY=40&desc=Plan%20a%20daily%20challenge.%20Keep%20the%20streak.&descSize=18&descAlignY=62&animation=twinkling" alt="Challenge Tracker" width="100%">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=19&duration=3200&pause=900&color=ffc34e&center=true&vCenter=true&width=680&lines=75+Hard+or+something+entirely+yours;Define+the+rules+that+make+a+day+count;Check+in%2C+tick+the+boxes%2C+watch+the+wall+fill;Streaks%2C+notes+and+progress+photos" alt="Typing animation" />

<br />

<a href="https://jivaansh-yadav.github.io/Challenge-tracker/"><img src="https://img.shields.io/badge/%E2%96%B6%20Live%20App-ffc34e?style=for-the-badge&labelColor=13151d&logo=googlechrome&logoColor=ffc34e" alt="Live app" /></a>
</div>

<div align="center">

<img src="https://img.shields.io/badge/Vanilla_JS-ES2020-ffc34e?style=flat-square&labelColor=13151d" alt="Vanilla JS" />
<img src="https://img.shields.io/badge/Build_step-none-c7ff6b?style=flat-square&labelColor=13151d" alt="No build step" />
<img src="https://img.shields.io/badge/Dependencies-0-6e65ec?style=flat-square&labelColor=13151d" alt="Zero dependencies" />
<img src="https://img.shields.io/badge/Storage-localStorage-fa7048?style=flat-square&labelColor=13151d" alt="localStorage" />
<img src="https://img.shields.io/badge/Layout-mobile_first-ffc34e?style=flat-square&labelColor=13151d" alt="Mobile first" />

</div>

<br />

<div align="center">

### <a href="https://jivaansh-yadav.github.io/Challenge-tracker/">jivaansh-yadav.github.io/Challenge-tracker</a>

<sub>No install, no account, no server. Open it and start a challenge.</sub>

</div>

---

<div align="center">

## What it is

</div>

**Challenge Tracker** is a daily challenge planner and logger for people committing to a fixed run of days — a 75 Hard style program, a 30 day reset, a week of morning runs. You write the challenge once: a name, a start date, a length, and the rules that make a day count. Then you check in day by day from a wall of day tiles that fill in as the streak grows.

It is deliberately narrow. There is no feed, no social layer, no gamified point economy — just the commitment you wrote, the days already behind you, and the one question that matters each evening: *did today count?*

> "Your rules, your definition of a good day." Everything is written and stored on your own device.

<div align="center">

<sub>It is <b>75 Hard inspired</b>, not 75 Hard locked — any length from 1 to 365 days, any rules, your own wording.</sub>

</div>

---

<div align="center">

## The loop

</div>

<ol>
<li><b>Write it.</b> Name the challenge, pick a start date and a length from 1 to 365 days. Add each daily rule with a short line of instructions, so future-you knows exactly what counts.</li>
<li><b>Or load a preset.</b> Four rule libraries arrive with their own guidance — <b>75 Hard classic</b>, <b>75 Soft</b>, <b>Morning reset</b>, <b>Momentum 30</b> — and every loaded rule stays editable afterwards.</li>
<li><b>Check in daily.</b> One large button jumps straight to today. Tick the rules, add a note, optionally attach a progress photo, and finish the day with a confetti pop.</li>
</ol>

<div align="center">

## What is inside

</div>

<ul>
<li><b>Heatmap wall of days</b> — every day of the challenge as a tile, coloured <b>complete</b>, <b>in progress</b>, <b>upcoming</b> or <b>missed</b>. Open any tile to see that day.</li>
<li><b>Streak and completion counters</b> — a live day streak and a total of days completed, with a progress bar and a percentage for the whole run.</li>
<li><b>Per-day notes</b> — a short journal entry per day that stays writable even after the day is locked, because the writing is the part worth keeping.</li>
<li><b>Progress photos</b> — one optional photo per day, downscaled in the browser before storage and never uploaded anywhere.</li>
<li><b>Day lifecycle rules</b> — days cannot be ticked before they begin, stay editable through a 24 hour grace window, then freeze their checkboxes while keeping the note.</li>
<li><b>Quotes and guidance</b> — a hundred short lines on showing up, rotated so the same one does not greet you twice, plus five habits for surviving a bad week.</li>
</ul>

---

<div align="center">

## How a day behaves

</div>

<table align="center">
<tr>
<th align="left">Phase</th>
<th align="left">When</th>
<th align="left">What you can do</th>
</tr>
<tr>
<td><b>Future</b></td>
<td>Before the day's date</td>
<td>Read-only preview. The check-in button says when it opens.</td>
</tr>
<tr>
<td><b>Today</b></td>
<td>During the day</td>
<td>Tick and untick rules, write the note, attach or change the photo.</td>
</tr>
<tr>
<td><b>Grace</b></td>
<td>24 hours after the day ends</td>
<td>Still fully editable — a live countdown shows how long is left (e.g. <code>18h 17m</code>).</td>
</tr>
<tr>
<td><b>Locked</b></td>
<td>After the grace window</td>
<td>Checkboxes are frozen, the photo is hidden, the note stays editable.</td>
</tr>
</table>

<div align="center"><sub>The rule is simple: a day you slept through is not a day you can quietly rewrite a week later — but a late-night fix the next morning is fair.</sub></div>

---

<div align="center">

## Stack

</div>

<table align="center">
<tr>
<th align="left">Layer</th>
<th align="left">Choice</th>
<th align="left">Why</th>
</tr>
<tr>
<td>Markup</td>
<td><code>index.html</code></td>
<td>One document, semantic sections, real <code>&lt;form&gt;</code> controls with labels.</td>
</tr>
<tr>
<td>Styling</td>
<td><code>styles.css</code></td>
<td>Hand written CSS, custom properties for the palette, native nesting-free media queries, no framework or utility classes.</td>
</tr>
<tr>
<td>Logic</td>
<td><code>app.js</code></td>
<td>An IIFE in strict mode: plain DOM APIs, template strings, one <code>state</code> object, no virtual DOM.</td>
</tr>
<tr>
<td>Content</td>
<td><code>quotes.js</code>, <code>presets.js</code></td>
<td>Data as globals — 100 quotes, 4 rule presets, 5 habits — so the app ships as five static files.</td>
</tr>
<tr>
<td>Fonts</td>
<td>Google Fonts</td>
<td><b>Space Grotesk</b> for display, <b>DM Sans</b> for body, loaded with <code>preconnect</code> and a system fallback.</td>
</tr>
<tr>
<td>Persistence</td>
<td><code>localStorage</code></td>
<td>One JSON key. No backend, no auth, no network calls at runtime.</td>
</tr>
<tr>
<td>Hosting</td>
<td>GitHub Pages</td>
<td>Static output straight from the branch root — no build pipeline to keep alive.</td>
</tr>
</table>

<div align="center">

<img src="https://skillicons.dev/icons?i=html,css,js,git,github" alt="HTML, CSS, JavaScript, Git, GitHub" />

</div>

<br />

<div align="center">

**Zero dependencies means zero of these:** <code>npm install</code> · <code>node_modules</code> · bundler · transpiler · polyfill · runtime API key.

</div>

---

<div align="center">

## Under the hood

</div>

<details>
<summary><b>Storage shape</b> — one key, one object, validated on every load</summary>

<br />

<p>Everything the user owns lives under <code>localStorage["challengeTracker.v1"]</code>:</p>

<pre><code>{
  "challenge": {
    "name": "30 days of morning runs",
    "start": "2026-11-01",
    "duration": 30,
    "rules": [{ "name": "Move 30 minutes", "desc": "Any pace, outdoors if possible." }]
  },
  "days": {
    "0": { "checks": [true], "note": "Cold, but done.", "photo": "data:image/jpeg;base64,…" }
  }
}</code></pre>

<p>On boot the payload is treated as hostile: the name must be a non-empty string, the start date must match <code>YYYY-MM-DD</code>, the duration must sit inside 1–365, and at least one rule must exist. Anything failing validation is discarded rather than half-rendered. Writes are wrapped in <code>try/catch</code> — a full quota surfaces a toast instead of a broken screen, and photo writes roll back to the previous value.</p>

</details>

<details>
<summary><b>Time gating without timezone bugs</b></summary>

<br />

<p>Date maths is the part of a streak tracker that quietly breaks. Every date here is constructed at <b>local noon</b>:</p>

<pre><code>const parseDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const addDays  = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n, 12);</code></pre>

<p>Anchoring at 12:00 means a daylight-saving shift of ±1 hour, or a user opening the app at 00:10 on a flight, can never roll a day over into the wrong index. Day <code>i</code> is simply <code>diffDays(today, start)</code>, and its lifecycle comes from a four-state machine:</p>

<pre><code>dayPhase(i) = i &gt; today  → "future"
              i === today → "today"
              within 24h of the day's midnight → "grace"
              otherwise → "past"</code></pre>

<p>The grace deadline is computed from the <em>end</em> of that specific day, not from the current clock, so a user who returns at 23:59 the next day sees a live countdown rather than an inconsistent state.</p>

</details>

<details>
<summary><b>Photo pipeline</b> — client side, before storage</summary>

<br />

<ol>
<li><code>&lt;input type="file" accept="image/*"&gt;</code> gives a <code>File</code>; the app reads it with an <code>Image</code> element and a blob URL.</li>
<li>It is drawn onto an offscreen <code>&lt;canvas&gt;</code>, scaled so the longest edge is <b>1100px</b>.</li>
<li>The canvas is exported with <code>toDataURL('image/jpeg', 0.72)</code> — a few hundred kilobytes becomes tens.</li>
<li>The data URL is written into that day's record; if <code>localStorage</code> throws on quota, the previous value is restored and the user is told why.</li>
</ol>

<p>No upload, no image CDN, no privacy policy to write — a phone photo never leaves the device.</p>

</details>

<details>
<summary><b>Rendering, motion and accessibility</b></summary>

<br />

<ul>
<li><b>Rendering</b> — the heatmap is a CSS grid of tiles; each tile carries a state class and the legend mirrors exactly those states. User text is escaped through a single helper before it reaches <code>innerHTML</code>.</li>
<li><b>Confetti</b> — a fixed, <code>pointer-events:none</code> canvas fires a short particle burst when the last rule of the day is ticked, and is skipped entirely under <code>prefers-reduced-motion</code>.</li>
<li><b>Dialogs</b> — the day sheet and the replace-challenge confirm use <code>role="dialog"</code> + <code>aria-modal="true"</code>, move focus inside, trap Tab, close on <code>Esc</code>, and restore focus to the element that opened them.</li>
<li><b>Announcements</b> — toasts and form errors are <code>aria-live="polite"</code> regions instead of silent visual flashes.</li>
<li><b>Keyboard and touch</b> — visible <code>:focus-visible</code> rings on every interactive element, disabled states styled rather than merely inert, and tap targets sized for thumbs first.</li>
</ul>

</details>

<details>
<summary><b>Responsive behaviour</b></summary>

<br />

<p>Mobile-first: a single column, full-width cards, a bottom sheet for the day, and safe-area padding via <code>env(safe-area-inset-*)</code> so nothing hides under a notch or home bar. From <b>700px</b> the grid widens and padding grows; from <b>1000px</b> the setup screen becomes a two-column layout with the intro pinned beside the form — the pin releases on its own column boundary so it can never slide over the rule library below it. The presets go two-up at <b>560px</b> and four-up at <b>1180px</b>.</p>

</details>

---

<div align="center">

## Project structure

</div>

<pre><code>Challenge-tracker/
├── index.html    # markup for both views: setup and dashboard
├── styles.css    # palette, layout, media queries, motion rules
├── app.js        # state, date maths, render, dialogs, photos
├── quotes.js     # 100 short lines, rotated per session
├── presets.js    # 4 rule libraries + 5 habits for keeping up
└── README.md</code></pre>

<div align="center"><sub>Five files, no folders, no config. The whole app is smaller than a single hero image on most sites.</sub></div>

---

<div align="center">

## Run it

</div>

<div align="center">

**Easiest path — nothing to install:**

### <a href="https://jivaansh-yadav.github.io/Challenge-tracker/">Open jivaansh-yadav.github.io/Challenge-tracker</a>

</div>

**Or run it locally:**

<pre><code>git clone https://github.com/Jivaansh-Yadav/Challenge-tracker.git
cd Challenge-tracker

# any static server works, pick one
python3 -m http.server 8000
# npx serve .

# then open http://localhost:8000</code></pre>

<p>There is no <code>npm install</code> step and no build output — the files in the repository <em>are</em> the app. Serve them over HTTP rather than opening <code>index.html</code> from the filesystem, since some browsers restrict <code>localStorage</code> on <code>file://</code> URLs.</p>

<div align="center">

<sub>Data lives in the browser profile that saved it — switching browsers or clearing site data starts a fresh log. There is no cloud copy by design.</sub>

</div>

---

<div align="center">

## Design tokens

</div>

<table align="center">
<tr>
<td align="center"><b>Background</b><br /><code>#08090d</code></td>
<td align="center"><b>Panel</b><br /><code>#13151d</code></td>
<td align="center"><b>Tile</b><br /><code>#1d2029</code></td>
<td align="center"><b>Hairline</b><br /><code>#30333c</code></td>
</tr>
<tr>
<td align="center"><b>Ink</b><br /><code>#f3f1f4</code></td>
<td align="center"><b>Muted</b><br /><code>#92939f</code></td>
<td align="center"><b>Amber</b><br /><code>#ffc34e</code></td>
<td align="center"><b>Green</b><br /><code>#c7ff6b</code></td>
</tr>
</table>

<div align="center"><sub>Near-black canvas, amber for progress and primary actions, violet and orange reserved for state accents. Display type is tight-tracked Space Grotesk; body copy is DM Sans at small sizes with generous line height. Motion is short and physical — quick fades, a sliding sheet, one confetti pop.</sub></div>

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1b1508,60:ffc34e,100:08090d&height=120&section=footer&text=Built%20by%20Jivaansh%20Yadav&fontSize=18&fontColor=f3f1f4&fontAlignY=72&animation=twinkling" alt="footer" width="100%">
