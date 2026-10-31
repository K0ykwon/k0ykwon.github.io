import {mountEvidenceDemo} from './historical-battle-records/demo.js?v=20261031-research-posts';
import {mountTransmissionDemo} from './mission-aware-hyperspectral/demo.js?v=20261031-research-posts';
import {mountCCTVDemo} from './ship-fire-smoke/demo.js?v=20261031-research-posts';
export function activateResearch(container){
 const controller=new AbortController();
 const mounts={'hbr-ie':mountEvidenceDemo,hyperspectral:mountTransmissionDemo,cctv:mountCCTVDemo};
 for(const root of container.querySelectorAll('[data-research-demo]'))mounts[root.dataset.researchDemo]?.(root,controller.signal);
 container.addEventListener('click',event=>{const button=event.target.closest('button[data-scroll-to]');if(button){const target=container.querySelector('[id="'+button.dataset.scrollTo+'"]');target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});}},{signal:controller.signal});
 return ()=>controller.abort();
}
