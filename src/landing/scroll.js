function smoothstep(edge0, edge1, x){
  const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(1e-6, (edge1 - edge0))));
  return t * t * (3 - 2 * t);
}

let scrollP = 0;
export function getScrollP(){
  return scrollP;
}

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

function onScroll(){
  const vh = window.innerHeight || 1;
  const y = window.scrollY || window.pageYOffset || 0;
  let p = y / vh;
  if(p<0)p=0; if(p>1)p=1;
  scrollP = p;
  updateBrandCSS(p);
}

export function initScroll(){
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

