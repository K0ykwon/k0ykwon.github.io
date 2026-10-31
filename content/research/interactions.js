import {mountEvidenceDemo} from './historical-battle-records/demo.js?v=20261031-research-evidence';
export function activateResearch(container){
 const controller=new AbortController();
 for(const root of container.querySelectorAll('[data-research-demo="hbr-ie"]'))mountEvidenceDemo(root,controller.signal);
 return ()=>controller.abort();
}
