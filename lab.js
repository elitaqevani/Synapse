const canvasState = {
  color: '#5ee7ff',
  particleCount: 180,
  shape: 'orbit',
  speed: 1.2,
  particles: []
};

const defaultConfig = {
  color: '#5ee7ff',
  particleCount: 180,
  shape: 'orbit',
  speed: 1.2
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: randomBetween(-1.2, 1.2) * canvasState.speed,
    vy: randomBetween(-1.2, 1.2) * canvasState.speed,
    radius: randomBetween(1.5, 4),
    phase: Math.random() * Math.PI * 2,
    hue: canvasState.color
  };
}

function buildParticles() {
  const canvas = document.getElementById('artCanvas');
  if (!canvas) return;

  const width = canvas.width;
  const height = canvas.height;
  canvasState.particles = Array.from({ length: canvasState.particleCount }, () => createParticle(width, height));
}

function drawScene() {
  const canvas = document.getElementById('artCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
  bg.addColorStop(0, 'rgba(14, 20, 30, 0.75)');
  bg.addColorStop(1, 'rgba(2, 6, 12, 1)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  canvasState.particles.forEach((particle, index) => {
    particle.x += particle.vx * (canvasState.speed + 0.2);
    particle.y += particle.vy * (canvasState.speed + 0.2);

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    const t = performance.now() * 0.001 + particle.phase;
    const orbitX = Math.cos(t * 1.8 + index) * 25;
    const orbitY = Math.sin(t * 1.4 + index) * 25;

    ctx.beginPath();
    ctx.fillStyle = canvasState.color;
    if (canvasState.shape === 'orbit') {
      ctx.arc(particle.x + orbitX, particle.y + orbitY, particle.radius, 0, Math.PI * 2);
    } else if (canvasState.shape === 'ripple') {
      ctx.arc(particle.x, particle.y + Math.sin(t + index) * 12, particle.radius + Math.sin(t) * 2, 0, Math.PI * 2);
    } else if (canvasState.shape === 'grid') {
      ctx.fillRect(particle.x, particle.y, particle.radius + 3, particle.radius + 3);
    } else {
      ctx.arc(particle.x + orbitX * 1.6, particle.y + orbitY * 1.6, particle.radius * 1.3, 0, Math.PI * 2);
    }
    ctx.fill();
  });

  const centerX = width / 2;
  const centerY = height / 2;
  const pulse = Math.sin(performance.now() * 0.0015) * 0.5 + 0.5;
  const gradient = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, 260 + pulse * 60);
  gradient.addColorStop(0, `${canvasState.color}99`);
  gradient.addColorStop(0.3, 'rgba(142,111,255,0.22)');
  gradient.addColorStop(1, 'rgba(2,6,12,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  window.requestAnimationFrame(drawScene);
}

function updateControlsFromState() {
  const colorPicker = document.getElementById('colorPicker');
  const particleRange = document.getElementById('particleRange');
  const shapeSelect = document.getElementById('shapeSelect');
  const speedRange = document.getElementById('speedRange');
  const particleValue = document.getElementById('particleValue');
  const speedValue = document.getElementById('speedValue');

  if (colorPicker) colorPicker.value = canvasState.color;
  if (particleRange) particleRange.value = String(canvasState.particleCount);
  if (shapeSelect) shapeSelect.value = canvasState.shape;
  if (speedRange) speedRange.value = String(canvasState.speed);
  if (particleValue) particleValue.textContent = String(canvasState.particleCount);
  if (speedValue) speedValue.textContent = `${Number(canvasState.speed).toFixed(1)}x`;
}

function updateStateFromInputs() {
  const colorPicker = document.getElementById('colorPicker');
  const particleRange = document.getElementById('particleRange');
  const shapeSelect = document.getElementById('shapeSelect');
  const speedRange = document.getElementById('speedRange');

  if (colorPicker) canvasState.color = colorPicker.value;
  if (particleRange) canvasState.particleCount = Number(particleRange.value);
  if (shapeSelect) canvasState.shape = shapeSelect.value;
  if (speedRange) canvasState.speed = Number(speedRange.value);

  buildParticles();
  updateControlsFromState();
}

function clearCanvas() {
  const canvas = document.getElementById('artCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showToast('Canvas cleared.', 'success');
}

function resetLabSettings() {
  Object.assign(canvasState, defaultConfig);
  buildParticles();
  updateControlsFromState();
  showToast('Lab settings reset.', 'success');
}

function exportCanvas() {
  const canvas = document.getElementById('artCanvas');
  if (!canvas) return;

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'synapse-artwork.png';
  link.click();
  showToast('Artwork exported as PNG.', 'success');
}

function saveArtwork() {
  const archive = JSON.parse(localStorage.getItem('synapse-archive') || '[]');
  const canvas = document.getElementById('artCanvas');
  if (!canvas) return;

  const artworkData = {
    id: Date.now(),
    type: 'artwork',
    title: 'Generative Composition',
    description: `Generated with ${canvasState.shape} pattern at ${canvasState.particleCount} particles.`,
    image: canvas.toDataURL('image/png'),
    createdAt: new Date().toISOString()
  };

  archive.push(artworkData);
  localStorage.setItem('synapse-archive', JSON.stringify(archive));
  showToast('Artwork saved to the archive.', 'success');
}

function setupLabControls() {
  const generateButton = document.getElementById('generateButton');
  const clearButton = document.getElementById('clearButton');
  const resetButton = document.getElementById('resetButton');
  const exportButton = document.getElementById('exportButton');
  const saveArtworkButton = document.getElementById('saveArtworkButton');

  if (generateButton) {
    generateButton.addEventListener('click', () => {
      buildParticles();
      showToast('New composition generated.', 'success');
    });
  }

  if (clearButton) clearButton.addEventListener('click', clearCanvas);
  if (resetButton) resetButton.addEventListener('click', resetLabSettings);
  if (exportButton) exportButton.addEventListener('click', exportCanvas);
  if (saveArtworkButton) saveArtworkButton.addEventListener('click', saveArtwork);

  const colorPicker = document.getElementById('colorPicker');
  const particleRange = document.getElementById('particleRange');
  const shapeSelect = document.getElementById('shapeSelect');
  const speedRange = document.getElementById('speedRange');

  colorPicker?.addEventListener('input', updateStateFromInputs);
  particleRange?.addEventListener('input', updateStateFromInputs);
  shapeSelect?.addEventListener('change', updateStateFromInputs);
  speedRange?.addEventListener('input', updateStateFromInputs);

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'n') {
      buildParticles();
      showToast('New composition generated.', 'success');
    }
    if (event.key.toLowerCase() === 'c') clearCanvas();
    if (event.key.toLowerCase() === 'e') exportCanvas();
    if (event.key.toLowerCase() === 'r') resetLabSettings();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'lab') return;
  buildParticles();
  updateControlsFromState();
  setupLabControls();
  drawScene();
});
