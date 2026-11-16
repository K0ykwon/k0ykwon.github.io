const search=document.querySelector('#search');
if(search){
 const buttons=[...document.querySelectorAll('[data-filter]')];const cards=[...document.querySelectorAll('.card')];
 const params=new URLSearchParams(location.hash.slice(1));let category=['DEV','AI','QPU'].includes(params.get('category'))?params.get('category'):'ALL';search.value=params.get('q')||'';
 function filter(save=true){const q=search.value.trim().toLocaleLowerCase();let count=0;for(const card of cards){card.hidden=!((category==='ALL'||card.dataset.category===category)&&card.dataset.search.toLocaleLowerCase().includes(q));if(!card.hidden)count++;}for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.filter===category));document.querySelector('#empty').hidden=count!==0;document.querySelector('#count').textContent=`${count}개의 글`;if(save){const p=new URLSearchParams();if(category!=='ALL')p.set('category',category);if(q)p.set('q',search.value);history.replaceState(null,'',location.pathname+location.search+(p.size?'#'+p.toString():''));}}
 buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;filter();}));search.addEventListener('input',()=>filter());filter(false);
 window.addEventListener('hashchange',()=>{const p=new URLSearchParams(location.hash.slice(1));category=['DEV','AI','QPU'].includes(p.get('category'))?p.get('category'):'ALL';search.value=p.get('q')||'';filter(false);});
}
