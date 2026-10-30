export function positionalEncoding(position,dimension=16){
 return Array.from({length:dimension},(_,i)=>{const angle=position/10000**(2*Math.floor(i/2)/dimension);return i%2?Math.cos(angle):Math.sin(angle);});
}
export function twoModeEnergy(separation,probability){
 // Target mass is 1/2 at each of -a and +a; prediction has masses p and 1-p.
 const a=separation,p=probability;
 return {mixtureLoss:2*a-4*a*p*(1-p),pointLoss:2*a,mean:0,pointMSE:a*a};
}
function fourier(re,im,inverse=false){
 const n=re.length,outRe=new Array(n).fill(0),outIm=new Array(n).fill(0),scale=1/Math.sqrt(n),sign=inverse?1:-1;
 for(let k=0;k<n;k++)for(let j=0;j<n;j++){
  const angle=sign*2*Math.PI*k*j/n,c=Math.cos(angle),s=Math.sin(angle);
  outRe[k]+=(re[j]*c-im[j]*s)*scale;outIm[k]+=(re[j]*s+im[j]*c)*scale;
 }
 return {re:outRe,im:outIm};
}
export function costMixerExample({eta=.8,gamma=.35,shape='quadratic',n=128}={}){
 const dx=16/n,x=Array.from({length:n},(_,i)=>-8+i*dx),sigma=.8;
 const cost=x.map(v=>shape==='double-well'?(v*v-1)**2/4:v*v/2);
 const initial=x.map(v=>Math.exp(-v*v/(4*sigma*sigma)));
 const norm=Math.sqrt(initial.reduce((s,v)=>s+v*v*dx,0));initial.forEach((v,i)=>initial[i]=v/norm);
 const re=initial.map((v,i)=>v*Math.cos(eta*cost[i])),im=initial.map((v,i)=>-v*Math.sin(eta*cost[i]));
 const spectrum=fourier(re,im);
 for(let k=0;k<n;k++){
  const momentum=2*Math.PI*(k<n/2?k:k-n)/(n*dx),angle=-gamma*momentum*momentum/2,c=Math.cos(angle),s=Math.sin(angle),r=spectrum.re[k],v=spectrum.im[k];
  spectrum.re[k]=r*c-v*s;spectrum.im[k]=r*s+v*c;
 }
 const mixed=fourier(spectrum.re,spectrum.im,true),density=initial.map(v=>v*v),afterCost=re.map((v,i)=>v*v+im[i]*im[i]),afterMixer=mixed.re.map((v,i)=>v*v+mixed.im[i]*mixed.im[i]);
 const integrate=values=>values.reduce((sum,v)=>sum+v*dx,0);
 return {x,cost,initial,re,im,density,afterCost,afterMixer,norm:integrate(afterMixer),initialCost:integrate(density.map((v,i)=>v*cost[i])),finalCost:integrate(afterMixer.map((v,i)=>v*cost[i])),densityDrift:Math.max(...afterCost.map((v,i)=>Math.abs(v-density[i])))};
}
