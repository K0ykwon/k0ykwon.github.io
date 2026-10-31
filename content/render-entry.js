const escape=value=>String(value).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
export function renderEntry(metadata,template){return template.replace(/\{\{(\w+)\}\}/g,(_,key)=>{if(!(key in metadata))throw new Error(`Missing ${metadata.slug}.${key}`);return escape(metadata[key]);});}
