const WORD = 'POLYCARBON';
const PANEL = getComputedStyle(document.documentElement).getPropertyValue('--panel').trim() || '#0c0d13';

function smoothstep(edge0, edge1, x){
  const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(1e-6, (edge1 - edge0))));
  return t * t * (3 - 2 * t);
}

export function initOverlays(getScrollP){
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

  function raf(){
    makeNoise(); drawGrain();
    drawMatte(Math.min(getScrollP(), 1)); // keep the word-hole mask active at the top
    // drawCutout(getScrollP()); // ← disable this overlay
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

