// landing-entry.js — landing shader + transition + lazy-load scroller
import * as THREE from 'three';
const ENABLE_GRAIN = true;
const WORD = 'POLYCARBON';
const PANEL = getComputedStyle(document.documentElement).getPropertyValue('--panel').trim() || '#0c0d13';

function smoothstep(edge0, edge1, x){
  const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(1e-6, (edge1 - edge0))));
  return t * t * (3 - 2 * t);
}

// --- Three.js landing shader ---
const glCanvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const vertSrc = `attribute vec2 uv; attribute vec3 position; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position * 2.0, 1.0); }`;
const fragSrc = `precision highp float; varying vec2 vUv;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
uniform vec3 c0Target; uniform vec3 c1Target; uniform vec3 c2Target; uniform vec3 c3Target;
uniform float uProgress; uniform float uTime; uniform vec3 uBG; uniform vec2 uAspect; uniform float uVisibility;
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){ return a + b * cos(6.28318*(c*t + d)); }
void main(){
  float res = 0.0; const int size2 = 7; vec2 uv = vUv; uv -= 0.5; uv *= (1.0 / uAspect); uv /= 2.5; uv += 0.5;
  for(int iy=-2; iy<size2; iy++){
    for(int ix=-2; ix<size2; ix++){
      vec2 pos = vec2(float(ix)/5.0, float(iy)/5.0) + 0.1; vec2 rel = pos - uv; float len = length(rel);
      float angle = atan(rel.y, rel.x) + uTime * 0.0002; angle = cos(angle * 8.0 + length(uv - 0.5) * 25.1327)*0.5 + 0.5;
      res += smoothstep(1.0, 0.8, len) * 0.1 * angle;
    }
  }
  float t = res; vec3 color = mix(palette(t,c0,c1,c2,c3), palette(t,c0Target,c1Target,c2Target,c3Target), uProgress);
  gl_FragColor = vec4(color, 1.0);
}`;

const current = { c0:[0.35,0.10,0.10], c1:[0.65,0.30,0.35], c2:[0.90,0.85,0.80], c3:[0.05,0.05,0.00] };
const target  = { c0:[0.06,0.08,0.20], c1:[0.25,0.30,0.55], c2:[0.90,0.90,0.90], c3:[0.00,0.33,0.67] };
const uniforms = {
  c0: { value: new THREE.Vector3(...current.c0) },
  c1: { value: new THREE.Vector3(...current.c1) },
  c2: { value: new THREE.Vector3(...current.c2) },
  c3: { value: new THREE.Vector3(...current.c3) },
  c0Target: { value: new THREE.Vector3(...target.c0) },
  c1Target: { value: new THREE.Vector3(...target.c1) },
  c2Target: { value: new THREE.Vector3(...target.c2) },
  c3Target: { value: new THREE.Vector3(...target.c3) },
  uProgress: { value: 0 },
  uTime: { value: 0 },
  uBG: { value: new THREE.Vector3(0.02,0.02,0.03) },
  uAspect: { value: new THREE.Vector2(1,1) },
  uVisibility: { value: 1.0 }
};

const material = new THREE.RawShaderMaterial({ vertexShader: vertSrc, fragmentShader: fragSrc, uniforms });
const geometry = new THREE.PlaneGeometry(1, 1);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function setAspect(){
  const w = renderer.domElement.width, h = renderer.domElement.height;
  const aspect = [Math.max(h / w, 1), Math.max(w / h, 1)];
  uniforms.uAspect.value.set(aspect[0], aspect[1]);
}

function resizeRenderer(){
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cssW = glCanvas.clientWidth || window.innerWidth;
  const cssH = glCanvas.clientHeight || window.innerHeight;
  renderer.setPixelRatio(dpr);
  renderer.setSize(cssW, cssH, false);
  setAspect();
}
window.addEventListener('resize', resizeRenderer);
resizeRenderer();

const clock = new THREE.Clock();
function tick(){
  const t = clock.getElapsedTime();
  uniforms.uTime.value = t * 1000.0;
  uniforms.uProgress.value = 0.5 + 0.5 * Math.sin(t * 0.25);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// --- Grain overlay ---
const grain = document.getElementById('grain');
const gctx = grain.getContext('2d');
const tile = document.createElement('canvas'); tile.width = 128; tile.height = 128;
const tctx = tile.getContext('2d');
function resizeGrain(){ grain.width = window.innerWidth; grain.height = window.innerHeight; }
function makeNoise(){ const id = tctx.createImageData(tile.width, tile.height); const d = id.data; for(let i=0; i<d.length; i+=4){ const v = (Math.random()*255)|0; d[i]=v; d[i+1]=v; d[i+2]=v; d[i+3]=255; } tctx.putImageData(id, 0, 0); }
function drawGrain(){ const pattern = gctx.createPattern(tile, 'repeat'); gctx.clearRect(0,0,grain.width,grain.height); gctx.globalAlpha = 0.07; gctx.fillStyle = pattern; gctx.fillRect(0,0,grain.width,grain.height); gctx.globalAlpha = 1.0; }
function resizeUI(){ resizeGrain(); }
window.addEventListener('resize', resizeUI); resizeUI();

// --- Matte + top band cutout ---
const matte = document.getElementById('matte');
const mctx = matte.getContext('2d');
function resizeMatte(){ const dpr = Math.min(2, window.devicePixelRatio || 1); const w = Math.floor(window.innerWidth * dpr), h = Math.floor(window.innerHeight * dpr); matte.width = w; matte.height = h; matte.style.width = '100vw'; matte.style.height = '100vh'; mctx.setTransform(dpr, 0, 0, dpr, 0, 0); }

const cut = document.getElementById('cutout');
const cctx = cut.getContext('2d');
function resizeCut(){ const dpr = Math.min(2, window.devicePixelRatio || 1); cut.width = Math.floor(window.innerWidth * dpr); cut.height = Math.floor(window.innerHeight * dpr); cut.style.width = '100vw'; cut.style.height = '100vh'; cctx.setTransform(dpr, 0, 0, dpr, 0, 0); }

function drawCutout(p){
  const w = window.innerWidth, h = window.innerHeight;
  cctx.clearRect(0,0,w,h);
  const active = p > 0.6 ? (p - 0.6) / 0.4 : 0;
  if(active <= 0) return;
  const topMargin = Math.max(24, h * 0.06);
  const bandH = Math.max(140, topMargin + h * 0.18);
  cctx.globalAlpha = active;
  cctx.globalCompositeOperation = 'source-over';
  cctx.fillStyle = PANEL;
  cctx.fillRect(0, 0, w, bandH);

  // word hole
  const targetWidth = w * 0.92;
  const trialSize = 200; cctx.font = `700 ${trialSize}px Notable, system-ui`;
  const trialWidth = Math.max(1, cctx.measureText(WORD).width);
  const baseSize = trialSize * (targetWidth / trialWidth);
  const scale = 1 - 0.68 * p;
  const size = Math.max(32, baseSize * scale);
  const y = Math.max(24, h * 0.06);

  cctx.globalCompositeOperation = 'destination-out';
  cctx.fillStyle = '#000';
  cctx.textAlign = 'center'; cctx.textBaseline = 'middle';
  cctx.filter = 'blur(0.35px)';
  cctx.fillText(WORD, w/2, y);
  cctx.filter = 'none';
  cctx.globalCompositeOperation = 'source-over';
  cctx.globalAlpha = 1.0;
}

function drawMatte(p){
  const w = window.innerWidth, h = window.innerHeight;
  mctx.clearRect(0,0,w,h);
  const matteAlpha = smoothstep(0.12, 0.72, p);
  if(matteAlpha > 0) {
    mctx.globalAlpha = matteAlpha;
    mctx.globalCompositeOperation = 'source-over';
    mctx.fillStyle = PANEL; mctx.fillRect(0,0,w,h);
  }
  const hole = smoothstep(0.36, 0.78, p);
  if(hole > 0){
    const targetWidth = w * 0.92;
    const trialSize = 200; mctx.font = `700 ${trialSize}px Notable, system-ui`;
    const trialWidth = Math.max(1, mctx.measureText(WORD).width);
    const baseSize = trialSize * (targetWidth / trialWidth);
    const scale = 1 - 0.68 * p;
    const size = Math.max(32, baseSize * scale);
    const topMargin = Math.max(24, h * 0.06);
    const y = (1 - p) * (h * 0.5) + (p) * (topMargin);

    mctx.globalAlpha = hole;
    mctx.globalCompositeOperation = 'destination-out';
    mctx.fillStyle = '#000';
    mctx.font = `700 ${size}px Notable, system-ui`;
    mctx.textAlign = 'center'; mctx.textBaseline = 'middle';
    mctx.filter = 'blur(0.35px)';
    mctx.fillText(WORD, w/2, y);
    mctx.filter = 'none';
    mctx.globalAlpha = 1.0;
    mctx.globalCompositeOperation = 'source-over';
  }
}
function resizeAll(){ resizeMatte(); resizeCut(); }
window.addEventListener('resize', resizeAll); resizeAll();

// Scroll progress 0..1 across first viewport
let scrollP = 0;
function onScroll(){ const vh = window.innerHeight || 1; const y = window.scrollY || window.pageYOffset || 0; let p = y / vh; if(p<0)p=0; if(p>1)p=1; scrollP = p; updateBrandCSS(p); }
window.addEventListener('scroll', onScroll, { passive: true });

function updateBrandCSS(p){
  const root = document.documentElement;
  const scale = 1 - 0.68 * p;
  const topPct = 50 - 46 * p;
  const ty = -50 * (1 - p);
  const fill = 1 - smoothstep(0.24, 0.56, p);
  root.style.setProperty('--brandScale', scale.toFixed(4));
  root.style.setProperty('--brandTopPct', topPct.toFixed(2));
  root.style.setProperty('--brandTranslateY', ty.toFixed(2));
  root.style.setProperty('--fillAlpha', fill.toFixed(3));
}

// simple RAF loop for overlays
function raf(){
  makeNoise(); drawGrain();
  drawMatte(Math.min(scrollP, 1)); // keep the word-hole mask active at the top
  // drawCutout(scrollP); // ← disable this overlay
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// --- Lazy-load the scrolling demo once the second page is visible ---
let scrollerLoaded = false;
const scrollSection = document.getElementById('scroll');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(async (e)=>{
    if(e.isIntersecting && !scrollerLoaded){
      scrollerLoaded = true;
      try {
        await import('/src/demo.js');
      } catch (err){
        console.error('Failed to load scroller', err);
      }
    }
  });
}, { root: null, rootMargin: '0px', threshold: 0.2 });
io.observe(scrollSection);
