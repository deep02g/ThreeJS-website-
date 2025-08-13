import * as THREE from 'three';

export function initShader(){
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
}

