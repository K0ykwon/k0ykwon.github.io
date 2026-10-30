export function attentionExample({causal=false,scale=1}={}){
 const q=[[1,0],[0,1],[1,1]],keys=q,values=[[1,0],[0,2],[1,1]];
 const scores=q.map((query,row)=>keys.map((key,column)=>causal&&column>row?-Infinity:scale*(query[0]*key[0]+query[1]*key[1])/Math.sqrt(2)));
 const weights=scores.map(row=>{const max=Math.max(...row),exps=row.map(v=>Math.exp(v-max)),sum=exps.reduce((a,b)=>a+b,0);return exps.map(v=>v/sum);});
 const outputs=weights.map(row=>[0,1].map(d=>row.reduce((sum,weight,i)=>sum+weight*values[i][d],0)));
 return {q,keys,values,scores,weights,outputs};
}
export function sparseDistribution(probabilities,k){
 if(!Number.isInteger(k)||k<1||k>probabilities.length)throw new RangeError('Invalid top-k');
 const ranked=probabilities.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]),kept=new Set(ranked.slice(0,k).map(([,i])=>i));
 const residual=Math.max(0,1-ranked.slice(0,k).reduce((s,[p])=>s+p,0));
 return probabilities.map((p,i)=>kept.has(i)?p:residual/(probabilities.length-k));
}
export function chunkBudget(tokens,k,overhead){
 if(!Number.isInteger(tokens)||tokens<1||!Number.isInteger(k)||k<1||!Number.isFinite(overhead)||overhead<0)throw new RangeError('Invalid chunk budget');
 const steps=Math.ceil(tokens/k),cost=steps*(1+overhead);return {steps,cost,relative:tokens/cost};
}
export function memorySchedule(steps,periods=[1,4,16]){
 return periods.map(period=>({period,count:Math.floor(steps/period),updates:Array.from({length:32},(_,i)=>i<steps&&(i+1)%period===0)}));
}
