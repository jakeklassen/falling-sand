import { Loader } from 'resource-loader';
import visitorFontUrl from './assets/fonts/visitor/visitor1.ttf';
import { CanvasRecorder } from './lib/canvas-recorder';
import { Grid } from './lib/grid';
import { getResolution } from './lib/screen';

const GAME_WIDTH = 256;
const GAME_HEIGHT = 144;
const SAND_COLOR = '#dcb159';

const loader = new Loader();

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const uiCanvas = document.querySelector<HTMLCanvasElement>('#ui-canvas')!;
const ctx = canvas.getContext('2d', {
  alpha: false,
}) as CanvasRenderingContext2D;
const uiCtx = uiCanvas.getContext('2d', {
  alpha: true,
}) as CanvasRenderingContext2D;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
canvas.style.width = `${GAME_WIDTH}px`;
canvas.style.height = `${GAME_HEIGHT}px`;
ctx.imageSmoothingEnabled = false;

uiCanvas.width = GAME_WIDTH;
uiCanvas.height = GAME_HEIGHT;
uiCanvas.style.width = `${GAME_WIDTH}px`;
uiCanvas.style.height = `${GAME_HEIGHT}px`;
uiCtx.imageSmoothingEnabled = false;

const canvasRecorder = new CanvasRecorder({
  canvases: [canvas, uiCanvas],
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  filename: 'sand.webm',
  frameRate: 60,
  download: true,
});

export const IDENTITY_MATRIX: DOMMatrix2DInit = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
};

const mouse = {
  down: false,
  position: { x: 0, y: 0 },
  update() {
    if (!this.down) {
      return;
    }

    const x = Math.floor(mouse.position.x);
    const y = Math.floor(mouse.position.y);

    grid.setWithinCircle(x, y, 3, 0.5);
  },
};

const grid = new Grid(GAME_WIDTH, GAME_HEIGHT);

uiCanvas.addEventListener('mousedown', (e: MouseEvent) => {
  e.preventDefault();
  mouse.down = true;
});

uiCanvas.addEventListener('mouseup', (e: MouseEvent) => {
  e.preventDefault();
  mouse.down = false;
});

uiCanvas.addEventListener('touchstart', (e) => e.preventDefault());
uiCanvas.addEventListener('touchend', (e) => e.preventDefault());
uiCanvas.addEventListener('touchmove', (e) => e.preventDefault());

uiCanvas.addEventListener('mouseleave', () => {
  mouse.down = false;
});

uiCanvas.addEventListener('mousemove', (e: MouseEvent) => {
  const rect = uiCanvas.getBoundingClientRect();
  mouse.position.x = (e.clientX - rect.left) * (uiCanvas.width / rect.width);
  mouse.position.y = (e.clientY - rect.top) * (uiCanvas.height / rect.height);
});

window.addEventListener('keypress', (e: KeyboardEvent) => {
  if (e.key === 'r') {
    if (canvasRecorder.recording) {
      canvasRecorder.stop();
    } else {
      canvasRecorder.start();
    }

    document
      .querySelector<HTMLSpanElement>('#recording-on')
      ?.classList.toggle('hidden');

    document
      .querySelector<HTMLSpanElement>('#recording-off')
      ?.classList.toggle('hidden');
  }
});

const resize = () => {
  // Scale canvas to fit window while maintaining 16x9
  const { innerWidth, innerHeight } = window;
  const { factor } = getResolution(
    innerWidth,
    innerHeight,
    GAME_WIDTH,
    GAME_HEIGHT,
  );

  canvas.style.transform = `scale(${factor})`;
  uiCanvas.style.transform = `scale(${factor})`;
};

resize();

window.addEventListener('resize', resize);

loader.add(visitorFontUrl).load(async (loader, resources) => {
  const font = new FontFace('Visitor', `url(${visitorFontUrl})`);
  const visitorFont = await font.load();
  document.fonts.add(visitorFont);

  const TARGET_FPS = 60;
  const STEP = 1000 / TARGET_FPS;
  const dt = STEP / 1000;
  let last = performance.now();
  let deltaTimeAccumulator = 0;

  function frame(hrt: DOMHighResTimeStamp) {
    deltaTimeAccumulator += Math.min(1000, hrt - last);

    while (deltaTimeAccumulator >= STEP) {
      grid.update();
      mouse.update();

      deltaTimeAccumulator -= STEP;
    }

    grid.render(ctx);

    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

    uiCtx.fillStyle = SAND_COLOR;
    uiCtx.beginPath();
    uiCtx.arc(
      Math.floor(mouse.position.x),
      Math.floor(mouse.position.y),
      3,
      0,
      2 * Math.PI,
    );

    uiCtx.fill();

    uiCtx.fillStyle = 'white';
    uiCtx.font = '10px Visitor';

    uiCtx.setTransform(IDENTITY_MATRIX);

    canvasRecorder.frame();

    last = hrt;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
});
