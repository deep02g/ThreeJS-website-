import { initShader } from './shader.js';
import { initOverlays } from './overlays.js';
import { initScroll, getScrollP } from './scroll.js';
import { initLazyLoad } from './lazy-load.js';

initShader();
initScroll();
initOverlays(getScrollP);
initLazyLoad();
