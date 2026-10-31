import {EXAMPLE,evidenceFor} from './example.js?v=20261031-research-evidence';
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let selection='all';
export function renderEvidenceDemo(language='en'){
 language=language==='ko'?'ko':'en';
 const copy=EXAMPLE[language];
 const source=copy.parts.map(part=>part.field?`<button type="button" class="hbr-span" data-evidence-field="${part.field}" data-highlight="true" aria-pressed="false" aria-controls="hbr-evidence-detail" aria-label="${EXAMPLE.labels[part.field]}: ${escape(part.text)}">${escape(part.text)}</button>`:escape(part.text)).join('');
 const cards=EXAMPLE.fields.map((field,index)=>{const record=evidenceFor(field,language);return `<button type="button" class="hbr-field" data-evidence-field="${field}" aria-pressed="false" aria-controls="hbr-evidence-detail"><span class="hbr-field-label"><span>${record.label}</span><span aria-hidden="true">0${index+1}</span></span><strong>${escape(record.value)}</strong></button>`;}).join('');
 return `<section id="hbr-evidence" class="hbr-demo" data-research-demo="hbr-ie" data-evidence-language="${language}" data-selected="all" aria-labelledby="hbr-evidence-title"><header class="hbr-demo-heading"><div><span class="entry-meta">HBR-IE / ILLUSTRATIVE EXAMPLE</span><h4 id="hbr-evidence-title">Evidence links</h4></div><button type="button" class="hbr-all" data-evidence-field="all" aria-pressed="true" aria-controls="hbr-evidence-detail">All fields</button></header><p class="hbr-instruction">${copy.instruction}</p><div class="hbr-workspace"><div class="hbr-source"><span class="hbr-label">SOURCE SENTENCE</span><p class="hbr-sentence">${source}</p><div class="hbr-source-ref"><span>example-01</span><span>sentence-01</span></div></div><div class="hbr-fields" role="group" aria-label="Extracted fields">${cards}</div></div><div id="hbr-evidence-detail" class="hbr-detail" role="status" aria-live="polite" aria-atomic="true"><div><span class="hbr-detail-label">Evidence link</span><p data-evidence-description>${copy.overview}</p></div><div class="hbr-evidence-quote"><span class="hbr-label">EVIDENCE SPAN</span><q data-evidence-quote>${copy.parts.map(part=>escape(part.text)).join('')}</q></div></div><p class="hbr-note">${copy.note}</p></section>`;
}
export function mountEvidenceDemo(root,signal){
 const language=root.dataset.evidenceLanguage==='ko'?'ko':'en';
 const copy=EXAMPLE[language];
 function select(field){
  if(field!=='all'&&!EXAMPLE.fields.includes(field))return;
  selection=field;root.dataset.selected=field;
  for(const button of root.querySelectorAll('[data-evidence-field]')){
   const active=button.dataset.evidenceField===field;
   button.setAttribute('aria-pressed',String(active));
   if(button.classList.contains('hbr-span'))button.dataset.highlight=String(active||field==='all');
  }
  const record=evidenceFor(field,language);
  root.querySelector('.hbr-detail-label').textContent=record?`${record.label} / ${record.value}`:'Evidence link';
  root.querySelector('[data-evidence-description]').textContent=record?.detail??copy.overview;
  root.querySelector('[data-evidence-quote]').textContent=record?.span??copy.parts.map(part=>part.text).join('');
 }
 root.addEventListener('click',event=>{const button=event.target.closest('button[data-evidence-field]');if(button&&root.contains(button))select(button.dataset.evidenceField);},{signal});
 select(selection);
}
