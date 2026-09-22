const STORAGE = {
  theme: 'launchpad.theme',
  engine: 'launchpad.engine',
  customEngines: 'launchpad.custom-engines',
  customLinks: 'launchpad.custom-links'
};

const builtInEngines = [
  { id: 'kagi', name: 'Kagi', template: 'https://kagi.com/search?q={query}' },
  { id: 'google', name: 'Google', template: 'https://www.google.com/search?q={query}' },
  { id: 'duckduckgo', name: 'DuckDuckGo', template: 'https://duckduckgo.com/?q={query}' },
  { id: 'brave', name: 'Brave', template: 'https://search.brave.com/search?q={query}' },
  { id: 'bing', name: 'Bing', template: 'https://www.bing.com/search?q={query}' },
  { id: 'startpage', name: 'Startpage', template: 'https://www.startpage.com/sp/search?query={query}' }
];

const builtInFavorites = [
  { name: 'Kagi Assistant', domain: 'kagi.com', url: 'https://kagi.com/assistant' },
  { name: 'YouTube', domain: 'youtube.com', url: 'https://www.youtube.com/' },
  { name: 'Hacker News', domain: 'news.ycombinator.com', url: 'https://news.ycombinator.com/' },
  { name: 'TMDB', domain: 'themoviedb.org', url: 'https://www.themoviedb.org/' },
  { name: 'Gmail', domain: 'mail.google.com', url: 'https://mail.google.com/' },
  { name: 'Proton Mail', domain: 'mail.proton.me', url: 'https://mail.proton.me/' },
  { name: 'iCloud', domain: 'icloud.com', url: 'https://www.icloud.com/' }
];

const fallbackQuotes = [
  { content: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { content: 'What you do every day matters more than what you do once in a while.', author: 'Gretchen Rubin' },
  { content: 'The present moment is filled with joy and happiness. If you are attentive, you will see it.', author: 'Thich Nhat Hanh' },
  { content: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { content: 'The best way out is always through.', author: 'Robert Frost' },
  { content: 'Small steps every day add up to miles over a lifetime.', author: 'Unknown' }
];

const state = {
  theme: getStorage(STORAGE.theme, 'light'),
  activeEngine: getStorage(STORAGE.engine, 'kagi'),
  customEngines: readCustomEngines(),
  customLinks: readCustomLinks(),
  quoteIndex: Math.floor(Math.random() * fallbackQuotes.length)
};

const $ = (selector) => document.querySelector(selector);

function getStorage(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch (error) { return fallback; }
}

function setStorage(key, value) {
  try { localStorage.setItem(key, value); } catch (error) { return false; }
  return true;
}

function readCustomEngines() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE.customEngines) || '[]');
    return Array.isArray(parsed) ? parsed.filter((engine) => engine && engine.name && engine.template) : [];
  } catch (error) { return []; }
}

function readCustomLinks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE.customLinks) || '[]');
    return Array.isArray(parsed) ? parsed.filter((link) => link && link.name && link.url) : [];
  } catch (error) { return []; }
}

function getEngines() {
  return [...builtInEngines, ...state.customEngines];
}

function setTheme(theme) {
  const allowedThemes = ['light', 'dark', 'fun', 'academia'];
  state.theme = allowedThemes.includes(theme) ? theme : 'light';
  document.documentElement.dataset.theme = state.theme;
  setStorage(STORAGE.theme, state.theme);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', state.theme === 'dark' || state.theme === 'academia' ? '#171817' : state.theme === 'fun' ? '#fff3cf' : '#f6f4ef');
}

function renderEngines() {
  const select = $('#engine-select');
  if (!select) return;
  select.replaceChildren();
  getEngines().forEach((engine) => {
    const option = new Option(engine.name, engine.id);
    select.add(option);
  });
  if (!getEngines().some((engine) => engine.id === state.activeEngine)) state.activeEngine = 'kagi';
  select.value = state.activeEngine;
}

function renderFavorites() {
  const grid = $('#favorites-grid');
  if (!grid) return;
  grid.replaceChildren();
  [...builtInFavorites, ...state.customLinks].forEach((site) => {
    const tile = document.createElement('a');
    tile.className = 'app-tile';
    tile.href = site.url;
    tile.target = '_blank';
    tile.rel = 'noopener';
    const icon = document.createElement('span');
    icon.className = 'app-icon';
    const image = document.createElement('img');
    image.src = `https://icons.duckduckgo.com/ip3/${site.domain}.ico`;
    image.alt = '';
    image.loading = 'lazy';
    image.onerror = () => {
      image.remove();
      const fallback = document.createElement('span');
      fallback.className = 'app-fallback';
      fallback.textContent = site.name.charAt(0);
      icon.append(fallback);
    };
    icon.append(image);
    const label = document.createElement('span');
    label.className = 'app-label';
    label.textContent = site.name;
    const domain = document.createElement('span');
    domain.className = 'app-domain';
    domain.textContent = site.domain.replace('www.', '');
    tile.append(icon, label, domain);
    grid.append(tile);
  });
}

function submitSearch(event) {
  event.preventDefault();
  const query = $('#search-input').value.trim();
  if (!query) {
    $('#search-input').focus();
    return;
  }
  const engine = getEngines().find((item) => item.id === state.activeEngine) || builtInEngines[0];
  const destination = engine.template.replace('{query}', encodeURIComponent(query));
  window.location.assign(destination);
}

function renderThemeOptions() {
  const options = [
    ['light', 'Light'], ['dark', 'Dark'], ['fun', 'Fun'], ['academia', 'Dark academia']
  ];
  $('#theme-options').replaceChildren(...options.map(([value, label]) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'theme';
    input.id = `theme-${value}`;
    input.value = value;
    input.checked = state.theme === value;
    input.addEventListener('change', () => setTheme(value));
    const labelElement = document.createElement('label');
    labelElement.htmlFor = input.id;
    labelElement.textContent = label;
    wrapper.append(input, labelElement);
    return wrapper;
  }));
}

function renderCustomEngines() {
  const list = $('#custom-engine-list');
  if (!list) return;
  list.replaceChildren();
  if (!state.customEngines.length) {
    const empty = document.createElement('p');
    empty.className = 'field-hint';
    empty.textContent = 'No custom engines yet.';
    list.append(empty);
    return;
  }
  state.customEngines.forEach((engine) => {
    const row = document.createElement('div');
    row.className = 'custom-engine-row';
    const label = document.createElement('span');
    label.textContent = `${engine.name} / ${engine.template}`;
    const remove = document.createElement('button');
    remove.className = 'remove-engine';
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      state.customEngines = state.customEngines.filter((item) => item.id !== engine.id);
      setStorage(STORAGE.customEngines, JSON.stringify(state.customEngines));
      if (state.activeEngine === engine.id) {
        state.activeEngine = 'kagi';
        setStorage(STORAGE.engine, state.activeEngine);
      }
      renderCustomEngines();
      renderEngines();
    });
    row.append(label, remove);
    list.append(row);
  });
}

function renderCustomLinks() {
  const list = $('#custom-link-list');
  if (!list) return;
  list.replaceChildren();
  if (!state.customLinks.length) {
    const empty = document.createElement('p');
    empty.className = 'field-hint';
    empty.textContent = 'No custom links yet.';
    list.append(empty);
    return;
  }
  state.customLinks.forEach((link) => {
    const row = document.createElement('div');
    row.className = 'custom-engine-row';
    const label = document.createElement('span');
    label.textContent = `${link.name} / ${link.url}`;
    const remove = document.createElement('button');
    remove.className = 'remove-engine';
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      state.customLinks = state.customLinks.filter((item) => item.id !== link.id);
      setStorage(STORAGE.customLinks, JSON.stringify(state.customLinks));
      renderCustomLinks();
      renderFavorites();
    });
    row.append(label, remove);
    list.append(row);
  });
}

function addCustomEngine(event) {
  event.preventDefault();
  const name = $('#custom-engine-name').value.trim();
  const template = $('#custom-engine-url').value.trim();
  if (!name || !template.includes('{query}')) {
    $('#custom-engine-url').setCustomValidity('Use a URL containing {query}.');
    $('#custom-engine-url').reportValidity();
    return;
  }
  try { new URL(template.replace('{query}', 'test')); } catch (error) {
    $('#custom-engine-url').setCustomValidity('Enter a valid URL template.');
    $('#custom-engine-url').reportValidity();
    return;
  }
  $('#custom-engine-url').setCustomValidity('');
  const id = `custom-${Date.now()}`;
  state.customEngines.push({ id, name, template });
  setStorage(STORAGE.customEngines, JSON.stringify(state.customEngines));
  event.target.reset();
  renderCustomEngines();
  renderEngines();
  $('#engine-select').value = id;
  state.activeEngine = id;
  setStorage(STORAGE.engine, id);
}

function addCustomLink(event) {
  event.preventDefault();
  const name = $('#custom-link-name').value.trim();
  const url = $('#custom-link-url').value.trim();
  try { new URL(url); } catch (error) {
    $('#custom-link-url').setCustomValidity('Enter a valid website URL.');
    $('#custom-link-url').reportValidity();
    return;
  }
  if (!name) {
    $('#custom-link-name').setCustomValidity('Enter a name for this link.');
    $('#custom-link-name').reportValidity();
    return;
  }
  $('#custom-link-name').setCustomValidity('');
  $('#custom-link-url').setCustomValidity('');
  state.customLinks.push({ id: `link-${Date.now()}`, name, url, domain: new URL(url).hostname });
  setStorage(STORAGE.customLinks, JSON.stringify(state.customLinks));
  event.target.reset();
  renderCustomLinks();
  renderFavorites();
}

function showQuote(quote, source) {
  $('#quote-text').textContent = `“${quote.content}”`;
  $('#quote-author').textContent = `— ${quote.author || 'Unknown'}`;
  $('#quote-status').textContent = source === 'remote' ? 'From a free quote service' : 'From your local fallback collection';
}

async function loadQuote() {
  if (!$('#quote-status')) return;
  $('#quote-status').textContent = 'Finding a thought';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch('https://dummyjson.com/quotes/random', { signal: controller.signal });
    if (!response.ok) throw new Error('Quote request failed');
    const quote = await response.json();
    if (!quote.quote || !quote.author) throw new Error('Quote response was incomplete');
    showQuote({ content: quote.quote, author: quote.author }, 'remote');
  } catch (error) {
    const quote = fallbackQuotes[state.quoteIndex % fallbackQuotes.length];
    state.quoteIndex += 1;
    showQuote(quote, 'local');
  } finally {
    clearTimeout(timeout);
  }
}

function createUtilityCard(title, eyebrow, description, content) {
  const card = document.createElement('article');
  card.className = 'utility-card';
  card.innerHTML = `<p class="section-kicker">${eyebrow}</p><h3>${title}</h3><p>${description}</p>`;
  card.append(content);
  return card;
}

function createBase64Utility() {
  const form = document.createElement('form');
  form.className = 'utility-form';
  form.innerHTML = '<label><span>Text</span><textarea name="value" placeholder="Paste text or Base64 here"></textarea></label><div class="utility-row"><button class="button button-dark" data-action="encode" type="button">Encode</button><button class="button button-dark" data-action="decode" type="button">Decode</button></div><div class="utility-result" aria-live="polite"></div>';
  const result = form.querySelector('.utility-result');
  const input = form.elements.value;
  form.addEventListener('click', (event) => {
    if (!event.target.dataset.action) return;
    try {
      if (event.target.dataset.action === 'encode') result.textContent = btoa(unescape(encodeURIComponent(input.value)));
      else result.textContent = decodeURIComponent(escape(atob(input.value.trim())));
      result.classList.remove('utility-error');
    } catch (error) {
      result.textContent = 'That does not look like valid Base64.';
      result.classList.add('utility-error');
    }
  });
  return createUtilityCard('Base64', '01 / Text tools', 'Translate text to and from Base64 without sending it anywhere.', form);
}

function createBmiUtility() {
  const form = document.createElement('form');
  form.className = 'utility-form';
  form.innerHTML = '<div class="utility-row"><label><span>Height</span><input name="height" type="number" min="1" step="any" placeholder="70"></label><label><span>Weight</span><input name="weight" type="number" min="1" step="any" placeholder="150"></label></div><div class="utility-row"><label><span>Units</span><select name="units"><option value="imperial">in / lbs</option><option value="metric">cm / kg</option></select></label><button class="button button-dark" type="submit">Calculate</button></div><div class="utility-result" aria-live="polite"></div>';
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const height = Number(form.elements.height.value);
    const weight = Number(form.elements.weight.value);
    const imperial = form.elements.units.value === 'imperial';
    const heightInMeters = imperial ? height * 0.0254 : height / 100;
    const weightInKg = imperial ? weight * 0.45359237 : weight;
    const result = form.querySelector('.utility-result');
    if (!height || !weight || heightInMeters <= 0 || weightInKg <= 0) {
      result.textContent = 'Enter a height and weight to calculate.';
      return;
    }
    const bmi = weightInKg / (heightInMeters ** 2);
    const heightSquared = heightInMeters ** 2;
    const ranges = [
      { label: 'Underweight', min: 0, max: 18.5 },
      { label: 'Healthy', min: 18.5, max: 25 },
      { label: 'Overweight', min: 25, max: 30 },
      { label: 'Obese', min: 30, max: 35 },
      { label: 'Severely obese', min: 35, max: 40 },
      { label: 'Morbidly obese', min: 40, max: null }
    ];
    const low = 18.5 * heightSquared;
    const high = 24.9 * heightSquared;
    const unit = imperial ? 'lb' : 'kg';
    const category = ranges.find((range) => bmi >= range.min && bmi < range.max) || ranges[ranges.length - 1];
    let distance = 'Inside the healthy range.';
    if (bmi < 18.5) distance = `${(low - weightInKg).toFixed(1)} ${unit} to the lower healthy boundary.`;
    if (bmi >= 25) distance = `${(weightInKg - high).toFixed(1)} ${unit} to the upper healthy boundary.`;
    const displayWeight = (kilograms) => imperial ? `${(kilograms * 2.20462).toFixed(1)} lb` : `${kilograms.toFixed(1)} kg`;
    const rangeRows = ranges.map((range) => {
      const start = range.min === 0 ? 0 : range.min * heightSquared;
      const end = range.max === null ? null : range.max * heightSquared;
      const active = category.label === range.label ? ' range-active' : '';
      const weightRange = end === null ? `≥ ${displayWeight(start)}` : `${displayWeight(start)}–${displayWeight(end)}`;
      return `<div class="bmi-range${active}"><span>${range.label}</span><span>${weightRange}</span></div>`;
    }).join('');
    const marker = Math.min(Math.max(bmi, 0), 50) * 2;
    result.innerHTML = `<strong>BMI ${bmi.toFixed(1)}</strong> / ${category.label.toLowerCase()}<div class="bmi-scale"><span style="left: ${marker}%"></span></div><div class="bmi-ranges">${rangeRows}</div><p class="bmi-note">Healthy weight: ${displayWeight(low)}–${displayWeight(high)}<br>${distance}</p>`;
  });
  return createUtilityCard('BMI', '02 / Body check', 'See your BMI category and the healthy weight band for your height.', form);
}

function createMicrowaveUtility() {
  const form = document.createElement('form');
  form.className = 'utility-form';
  form.innerHTML = '<div class="utility-row"><label><span>Minutes</span><input name="minutes" type="number" min="0" step="1" placeholder="3"></label><label><span>Seconds</span><input name="seconds" type="number" min="0" max="59" step="1" placeholder="30"></label></div><div class="utility-row"><label><span>From watts</span><input name="from" type="number" min="1" step="1" value="1000"></label><label><span>To watts</span><input name="to" type="number" min="1" step="1" value="800"></label></div><button class="button button-dark" type="submit">Convert time</button><div class="utility-result" aria-live="polite"></div>';
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const minutes = Number(form.elements.minutes.value) || 0;
    const seconds = Number(form.elements.seconds.value) || 0;
    const from = Number(form.elements.from.value);
    const to = Number(form.elements.to.value);
    const result = form.querySelector('.utility-result');
    if (from <= 0 || to <= 0 || (minutes === 0 && seconds === 0)) {
      result.textContent = 'Enter a cooking time and both wattages.';
      return;
    }
    const totalSeconds = (minutes * 60 + seconds) * from / to;
    const outputMinutes = Math.floor(totalSeconds / 60);
    const outputSeconds = Math.round(totalSeconds % 60);
    result.innerHTML = `<strong>${outputMinutes}m ${String(outputSeconds).padStart(2, '0')}s</strong><br>Approximate time at ${to} watts.`;
  });
  return createUtilityCard('Microwave math', '03 / Kitchen helper', 'Convert a package time from one microwave wattage to another.', form);
}

function renderUtilities() {
  $('#utilities-grid').append(createBase64Utility(), createBmiUtility(), createMicrowaveUtility());
}

function setupSettings() {
  const dialog = $('#settings-dialog');
  if (!dialog) return;
  $('#settings-button').addEventListener('click', () => dialog.showModal());
  $('#close-settings').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  $('#custom-engine-form')?.addEventListener('submit', addCustomEngine);
  $('#custom-link-form')?.addEventListener('submit', addCustomLink);
  $('#manage-links-button')?.addEventListener('click', () => {
    dialog.showModal();
    $('#custom-link-name').focus();
  });
}

function init() {
  setTheme(state.theme);
  renderEngines();
  renderFavorites();
  renderThemeOptions();
  renderCustomEngines();
  renderCustomLinks();
  if ($('#utilities-grid')) renderUtilities();
  setupSettings();
  $('#search-form')?.addEventListener('submit', submitSearch);
  $('#engine-select')?.addEventListener('change', (event) => {
    state.activeEngine = event.target.value;
    setStorage(STORAGE.engine, state.activeEngine);
  });
  $('#quote-refresh')?.addEventListener('click', loadQuote);
  loadQuote();
}

document.addEventListener('DOMContentLoaded', init);
