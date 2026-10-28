// Shared app setup for SYNAPSE pages.
const STORAGE_KEYS = {
  theme: 'synapse-theme',
  sound: 'synapse-sound',
  latestResult: 'synapse-latest-result',
  archive: 'synapse-archive',
  labArtwork: 'synapse-lab-artwork'
};

const PAGE_COMMANDS = [
  { label: 'Portal', path: 'index.html', shortcut: '⌘/Ctrl+1' },
  { label: 'Future DNA', path: 'identity.html', shortcut: '⌘/Ctrl+2' },
  { label: 'Timeline 2045', path: 'timeline.html', shortcut: '⌘/Ctrl+3' },
  { label: 'Reality Lab', path: 'lab.html', shortcut: '⌘/Ctrl+4' },
  { label: 'Memory Archive', path: 'archive.html', shortcut: '⌘/Ctrl+5' }
];

const pageName = document.body.dataset.page || 'home';

function safeReadStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.warn('Invalid localStorage payload for', key, error);
    return null;
  }
}

function safeWriteStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Could not write localStorage for', key, error);
    return false;
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2800);
}

function applyTheme(themeName) {
  document.body.classList.remove('theme-default', 'theme-violet', 'theme-aurora', 'theme-sunset');
  document.body.classList.add(themeName ? `theme-${themeName}` : 'theme-default');
  localStorage.setItem(STORAGE_KEYS.theme, themeName || 'default');

  const paletteButtons = document.querySelectorAll('.palette-option');
  paletteButtons.forEach((button) => {
    const isActive = button.dataset.theme === (themeName || 'default');
    button.classList.toggle('active', isActive);
  });
}

function handleThemeButton() {
  const themePalette = document.getElementById('themePalette');
  if (!themePalette) return;
  themePalette.classList.toggle('hidden');
}

function setupTheme() {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'default';
  applyTheme(storedTheme);

  const themeToggleButton = document.getElementById('themePickerToggle');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', handleThemeButton);
  }

  const paletteButtons = document.querySelectorAll('.palette-option');
  paletteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.theme);
      const themePalette = document.getElementById('themePalette');
      if (themePalette) themePalette.classList.add('hidden');
    });
  });
}

function setupSoundToggle() {
  const soundButton = document.getElementById('soundToggle');
  if (!soundButton) return;

  const storedState = localStorage.getItem(STORAGE_KEYS.sound) === 'true';
  soundButton.setAttribute('aria-pressed', storedState ? 'true' : 'false');
  soundButton.textContent = storedState ? 'Sound On' : 'Sound Off';

  soundButton.addEventListener('click', () => {
    const next = soundButton.getAttribute('aria-pressed') !== 'true';
    soundButton.setAttribute('aria-pressed', String(next));
    soundButton.textContent = next ? 'Sound On' : 'Sound Off';
    localStorage.setItem(STORAGE_KEYS.sound, String(next));
    showToast(next ? 'Audio enabled.' : 'Audio muted.', 'success');
  });
}

function setupMobileNav() {
  const toggle = document.getElementById('mobileNavToggle');
  const panel = document.getElementById('mobileNav');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('hidden');
  });
}

function setNavActiveState() {
  const navLinks = document.querySelectorAll('[data-nav]');
  navLinks.forEach((link) => {
    const isActive = link.dataset.nav === pageName;
    link.classList.toggle('active', isActive);
  });
}

function closeCommandPanel() {
  const panel = document.getElementById('commandPanel');
  if (panel) panel.classList.add('hidden');
}

function openCommandPanel() {
  const panel = document.getElementById('commandPanel');
  if (!panel) return;
  panel.classList.remove('hidden');
  const input = document.getElementById('commandInput');
  if (input) {
    setTimeout(() => input.focus(), 20);
  }
}

function setupCommandPanel() {
  const panel = document.getElementById('commandPanel');
  const input = document.getElementById('commandInput');
  const list = document.getElementById('commandList');
  if (!panel || !input || !list) return;

  const renderCommands = (query = '') => {
    const filtered = PAGE_COMMANDS.filter((item) => {
      const haystack = `${item.label} ${item.path}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });

    if (!filtered.length) {
      list.innerHTML = '<li><span>No matching command</span><span class="shortcut">—</span></li>';
      return;
    }

    list.innerHTML = filtered
      .map((item) => `
        <li data-path="${item.path}">
          <span>${item.label}</span>
          <span class="shortcut">${item.shortcut}</span>
        </li>
      `)
      .join('');

    list.querySelectorAll('li').forEach((item) => {
      item.addEventListener('click', () => {
        const path = item.dataset.path;
        if (path) {
          window.location.href = path;
        }
      });
    });
  };

  renderCommands();
  input.addEventListener('input', (event) => renderCommands(event.target.value));

  document.addEventListener('keydown', (event) => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const cmdOpen = (isMac && event.metaKey && event.key.toLowerCase() === 'k') || (!isMac && event.ctrlKey && event.key.toLowerCase() === 'k');
    if (cmdOpen) {
      event.preventDefault();
      openCommandPanel();
    }

    if (event.key === 'Escape') {
      closeCommandPanel();
      const themePalette = document.getElementById('themePalette');
      if (themePalette && !themePalette.classList.contains('hidden')) {
        themePalette.classList.add('hidden');
      }
      const mobileNav = document.getElementById('mobileNav');
      if (mobileNav && !mobileNav.classList.contains('hidden')) {
        mobileNav.classList.add('hidden');
      }
    }
  });

  const closeButton = panel.querySelector('[data-close="commandPanel"]');
  if (closeButton) {
    closeButton.addEventListener('click', closeCommandPanel);
  }
}

function initLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) return;

  window.setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 1800);
}

function setupHomePortalAesthetics() {
  if (pageName !== 'home') return;

  const canvas = document.getElementById('portalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const setCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  function drawPortal() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const time = performance.now() * 0.001;
    ctx.clearRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < 26; i += 1) {
      const radius = 90 + i * 8 + Math.sin(time * 1.8 + i) * 14;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(94, 231, 255, ${0.18 + i * 0.015})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    for (let i = 0; i < 90; i += 1) {
      const angle = (i / 90) * Math.PI * 2 + time * 0.7;
      const orbit = 130 + (i % 6) * 14 + Math.sin(time + i) * 8;
      const x = centerX + Math.cos(angle) * orbit;
      const y = centerY + Math.sin(angle) * orbit;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(94,231,255,0.9)' : 'rgba(142,111,255,0.8)';
      ctx.fill();
    }

    const gradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 220);
    gradient.addColorStop(0, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(0.25, 'rgba(94,231,255,0.28)');
    gradient.addColorStop(0.55, 'rgba(142,111,255,0.18)');
    gradient.addColorStop(1, 'rgba(2,5,12,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    window.requestAnimationFrame(drawPortal);
  }

  setCanvas();
  drawPortal();
  window.addEventListener('resize', setCanvas);
}

document.addEventListener('DOMContentLoaded', () => {
  setNavActiveState();
  setupTheme();
  setupSoundToggle();
  setupMobileNav();
  setupCommandPanel();
  initLoadingScreen();
  setupHomePortalAesthetics();

  const enterButton = document.getElementById('enterExperienceBtn');
  if (enterButton) {
    enterButton.addEventListener('click', () => {
      showToast('Portal opened — stepping into the future.', 'success');
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest('.close-dialog')) {
      const closeTarget = target.closest('.close-dialog');
      const panel = document.getElementById(closeTarget.dataset.close || 'commandPanel');
      if (panel) panel.classList.add('hidden');
    }
  });

  document.body.addEventListener('click', (event) => {
    const panel = document.getElementById('themePalette');
    const button = document.getElementById('themePickerToggle');
    if (panel && button && !panel.contains(event.target) && !button.contains(event.target)) {
      panel.classList.add('hidden');
    }
  });
});
