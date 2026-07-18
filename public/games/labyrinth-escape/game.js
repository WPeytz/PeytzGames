const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const boardWrap = document.getElementById('board-wrap');
const startScreen = document.getElementById('start-screen');
const levelScreen = document.getElementById('level-screen');
const finishScreen = document.getElementById('finish-screen');
const timerValue = document.getElementById('timer-value');
const levelValue = document.getElementById('level-value');
const themeValue = document.getElementById('theme-value');
const levelTitle = document.getElementById('level-title');
const levelCopy = document.getElementById('level-copy');
const finalTime = document.getElementById('final-time');
const bestTime = document.getElementById('best-time');

const themes = [
  { name: 'Moonlit Garden', intro: 'Slip between silver hedges.', bg: '#07111f', surface: '#0d2134', wall: '#79d7c6', path: '#091827', glow: '#b9fff1', accent: '#f5d96b', muted: '#83a1ad' },
  { name: 'Sunken Temple', intro: 'Ancient stone stirs below.', bg: '#071b1d', surface: '#0e302f', wall: '#59c3a5', path: '#092322', glow: '#b8ffdc', accent: '#ffb84d', muted: '#73a9a2' },
  { name: 'Ember Cavern', intro: 'Follow the sparks through the dark.', bg: '#1b0908', surface: '#351310', wall: '#e05a3f', path: '#240b09', glow: '#ff9f6d', accent: '#ffd166', muted: '#b47c70' },
  { name: 'Glass Tundra', intro: 'The frozen path fractures ahead.', bg: '#081528', surface: '#102b48', wall: '#7ac8ff', path: '#0a1c31', glow: '#d4f2ff', accent: '#fbf1a9', muted: '#789ab5' },
  { name: 'Violet Circuit', intro: 'Read the pulse. Find the signal.', bg: '#100821', surface: '#211142', wall: '#b875ff', path: '#160c2b', glow: '#e8c7ff', accent: '#58f5d0', muted: '#957cac' },
  { name: 'Crimson Keep', intro: 'The old fortress has no mercy.', bg: '#1c080d', surface: '#351018', wall: '#d94d67', path: '#250a10', glow: '#ff9aad', accent: '#f4c56a', muted: '#aa7480' },
  { name: 'Solar Archive', intro: 'Lost knowledge burns in gold.', bg: '#191204', surface: '#33270b', wall: '#e5b94f', path: '#241b07', glow: '#ffe9a6', accent: '#6fffd2', muted: '#a58d54' },
  { name: 'The Starless Deep', intro: 'One final light remains.', bg: '#03060d', surface: '#0b1021', wall: '#6475ff', path: '#050914', glow: '#b9c1ff', accent: '#ff63c3', muted: '#6f789d' },
];

let maze = [];
let columns = 9;
let rows = 9;
let player = { column: 0, row: 0, displayColumn: 0, displayRow: 0 };
let currentLevel = 0;
let startedAt = 0;
let accumulatedTime = 0;
let pausedAt = 0;
let pausedTime = 0;
let timerFrame = 0;
let running = false;
let transitioning = false;
let particles = [];
let touchStart = null;

function randomIndex(maximum) {
  return Math.floor(Math.random() * maximum);
}

function createMaze(width, height) {
  const cells = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, column) => ({
      column,
      row,
      visited: false,
      walls: { top: true, right: true, bottom: true, left: true },
    })),
  );
  const stack = [];
  let cell = cells[0][0];
  cell.visited = true;
  let visited = 1;

  while (visited < width * height) {
    const candidates = [
      { next: cells[cell.row - 1]?.[cell.column], direction: 'top', opposite: 'bottom' },
      { next: cells[cell.row]?.[cell.column + 1], direction: 'right', opposite: 'left' },
      { next: cells[cell.row + 1]?.[cell.column], direction: 'bottom', opposite: 'top' },
      { next: cells[cell.row]?.[cell.column - 1], direction: 'left', opposite: 'right' },
    ].filter(({ next }) => next && !next.visited);

    if (candidates.length) {
      const choice = candidates[randomIndex(candidates.length)];
      cell.walls[choice.direction] = false;
      choice.next.walls[choice.opposite] = false;
      stack.push(cell);
      cell = choice.next;
      cell.visited = true;
      visited += 1;
    } else {
      cell = stack.pop();
    }
  }

  return cells;
}

function applyTheme(theme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme)) {
    if (!['name', 'intro'].includes(key)) root.style.setProperty(`--theme-${key}`, value);
  }
  themeValue.textContent = theme.name;
  document.querySelector('meta[name="theme-color"]').content = theme.bg;
}

function setupLevel(level) {
  currentLevel = level;
  const size = 9 + level * 2;
  columns = size;
  rows = size;
  maze = createMaze(columns, rows);
  player = { column: 0, row: 0, displayColumn: 0, displayRow: 0 };
  particles = [];
  levelValue.textContent = `${level + 1} / ${themes.length}`;
  applyTheme(themes[level]);
  resizeCanvas();
}

function resizeCanvas() {
  const rectangle = boardWrap.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rectangle.width * scale);
  canvas.height = Math.round(rectangle.height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
  draw();
}

function getGeometry() {
  const width = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
  const height = canvas.height / Math.min(window.devicePixelRatio || 1, 2);
  const padding = Math.max(16, Math.min(width, height) * 0.045);
  const cellSize = Math.min((width - padding * 2) / columns, (height - padding * 2) / rows);
  return {
    cellSize,
    originX: (width - cellSize * columns) / 2,
    originY: (height - cellSize * rows) / 2,
    width,
    height,
  };
}

function roundedRectangle(x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function draw() {
  if (!maze.length) return;
  const theme = themes[currentLevel];
  const geometry = getGeometry();
  const { cellSize, originX, originY, width, height } = geometry;
  context.clearRect(0, 0, width, height);

  const background = context.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, Math.max(width, height) * 0.7);
  background.addColorStop(0, theme.surface);
  background.addColorStop(1, theme.path);
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const exitX = originX + (columns - 0.5) * cellSize;
  const exitY = originY + (rows - 0.5) * cellSize;
  const pulse = 0.9 + Math.sin(performance.now() / 380) * 0.1;
  context.save();
  context.shadowColor = theme.accent;
  context.shadowBlur = cellSize * 0.8;
  context.fillStyle = theme.accent;
  context.beginPath();
  context.arc(exitX, exitY, cellSize * 0.22 * pulse, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.strokeStyle = theme.wall;
  context.lineWidth = Math.max(1.5, cellSize * 0.09);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.shadowColor = theme.glow;
  context.shadowBlur = Math.min(8, cellSize * 0.2);
  context.beginPath();
  for (const row of maze) {
    for (const cell of row) {
      const x = originX + cell.column * cellSize;
      const y = originY + cell.row * cellSize;
      if (cell.walls.top) { context.moveTo(x, y); context.lineTo(x + cellSize, y); }
      if (cell.walls.left) { context.moveTo(x, y); context.lineTo(x, y + cellSize); }
      if (cell.row === rows - 1 && cell.walls.bottom) { context.moveTo(x, y + cellSize); context.lineTo(x + cellSize, y + cellSize); }
      if (cell.column === columns - 1 && cell.walls.right) { context.moveTo(x + cellSize, y); context.lineTo(x + cellSize, y + cellSize); }
    }
  }
  context.stroke();
  context.shadowBlur = 0;

  const targetX = originX + (player.displayColumn + 0.5) * cellSize;
  const targetY = originY + (player.displayRow + 0.5) * cellSize;
  context.save();
  context.shadowColor = '#ffffff';
  context.shadowBlur = cellSize * 0.65;
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.arc(targetX, targetY, Math.max(3.5, cellSize * 0.18), 0, Math.PI * 2);
  context.fill();
  context.restore();

  for (const particle of particles) {
    context.globalAlpha = particle.life;
    context.fillStyle = theme.glow;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
}

function move(direction) {
  if (!running || transitioning) return;
  const cell = maze[player.row][player.column];
  const movement = {
    up: { wall: 'top', column: 0, row: -1 },
    right: { wall: 'right', column: 1, row: 0 },
    down: { wall: 'bottom', column: 0, row: 1 },
    left: { wall: 'left', column: -1, row: 0 },
  }[direction];
  if (!movement || cell.walls[movement.wall]) return;

  player.column += movement.column;
  player.row += movement.row;
  spawnTrail();
  if (player.column === columns - 1 && player.row === rows - 1) completeLevel();
}

function spawnTrail() {
  const { cellSize, originX, originY } = getGeometry();
  for (let index = 0; index < 4; index += 1) {
    particles.push({
      x: originX + (player.column + 0.5) * cellSize + (Math.random() - 0.5) * cellSize * 0.3,
      y: originY + (player.row + 0.5) * cellSize + (Math.random() - 0.5) * cellSize * 0.3,
      size: Math.max(1, cellSize * (0.03 + Math.random() * 0.04)),
      life: 0.8,
    });
  }
}

function completeLevel() {
  transitioning = true;
  if (currentLevel === themes.length - 1) {
    finishGame();
    return;
  }
  pausedAt = performance.now();
  const nextTheme = themes[currentLevel + 1];
  document.getElementById('level-kicker').textContent = `Level ${currentLevel + 1} escaped`;
  levelTitle.textContent = nextTheme.name;
  levelCopy.textContent = nextTheme.intro;
  levelScreen.classList.remove('hidden');
  setTimeout(() => {
    setupLevel(currentLevel + 1);
    levelScreen.classList.add('hidden');
    pausedTime += performance.now() - pausedAt;
    transitioning = false;
  }, 1500);
}

function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = Math.floor(milliseconds % 1000);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

function finishGame() {
  running = false;
  accumulatedTime = performance.now() - startedAt - pausedTime;
  cancelAnimationFrame(timerFrame);
  const score = Math.round(accumulatedTime);
  finalTime.textContent = formatTime(score);
  const previousBest = Number(localStorage.getItem('labyrinth-escape-best'));
  if (!previousBest || score < previousBest) {
    localStorage.setItem('labyrinth-escape-best', String(score));
    bestTime.textContent = previousBest ? `New best — ${formatTime(previousBest - score)} faster.` : 'Your first escape is now your best.';
  } else {
    bestTime.textContent = `Best time: ${formatTime(previousBest)}`;
  }
  finishScreen.classList.remove('hidden');
  window.parent.postMessage(
    { type: 'labyrinth-escape:gameover', score },
    window.location.origin,
  );
}

function updateTimer() {
  if (!running) return;
  const currentPause = transitioning && pausedAt ? performance.now() - pausedAt : 0;
  timerValue.textContent = formatTime(performance.now() - startedAt - pausedTime - currentPause);
  timerFrame = requestAnimationFrame(updateTimer);
}

function animationLoop() {
  player.displayColumn += (player.column - player.displayColumn) * 0.28;
  player.displayRow += (player.row - player.displayRow) * 0.28;
  for (const particle of particles) {
    particle.life -= 0.025;
    particle.size *= 0.99;
  }
  particles = particles.filter((particle) => particle.life > 0);
  draw();
  requestAnimationFrame(animationLoop);
}

function startGame() {
  setupLevel(0);
  startScreen.classList.add('hidden');
  finishScreen.classList.add('hidden');
  transitioning = false;
  accumulatedTime = 0;
  pausedAt = 0;
  pausedTime = 0;
  startedAt = performance.now();
  running = true;
  cancelAnimationFrame(timerFrame);
  updateTimer();
}

const keyDirections = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowRight: 'right', d: 'right', D: 'right',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
};

window.addEventListener('keydown', (event) => {
  const direction = keyDirections[event.key];
  if (!direction) return;
  event.preventDefault();
  move(direction);
});

for (const button of document.querySelectorAll('[data-direction]')) {
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    move(button.dataset.direction);
  });
}

canvas.addEventListener('pointerdown', (event) => {
  touchStart = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener('pointerup', (event) => {
  if (!touchStart) return;
  const deltaX = event.clientX - touchStart.x;
  const deltaY = event.clientY - touchStart.y;
  touchStart = null;
  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 18) return;
  move(Math.abs(deltaX) > Math.abs(deltaY) ? (deltaX > 0 ? 'right' : 'left') : (deltaY > 0 ? 'down' : 'up'));
});

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('restart-button').addEventListener('click', startGame);
window.addEventListener('resize', resizeCanvas);

setupLevel(0);
requestAnimationFrame(animationLoop);

if (window.parent !== window) {
  window.parent.postMessage({ type: 'embed:height', height: document.documentElement.scrollHeight }, window.location.origin);
}
