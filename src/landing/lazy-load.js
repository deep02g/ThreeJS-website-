export function initLazyLoad(){
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
}

