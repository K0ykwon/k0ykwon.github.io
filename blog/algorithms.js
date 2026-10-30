// Small, deterministic algorithms used by the article playgrounds.
export function queensSolutions(n){
 if(!Number.isInteger(n)||n<1||n>10)throw new RangeError('Board size must be 1–10');
 const full=(1<<n)-1,solutions=[];
 function dfs(columns,left,right,path){
  if(columns===full){solutions.push(path);return;}
  let available=full&~(columns|left|right);
  while(available){const bit=available&-available;available^=bit;dfs(columns|bit,((left|bit)<<1)&full,(right|bit)>>>1,[...path,31-Math.clz32(bit)]);}
 }
 dfs(0,0,0,[]);return solutions;
}
export function bishopPlacement(board){
 const n=board.length;
 if(n<1||n>10||board.some(row=>row.length!==n))throw new RangeError('Invalid board');
 const diagonals=Array.from({length:2*n-1},()=>[]);
 board.forEach((row,r)=>row.forEach((allowed,c)=>{if(allowed)diagonals[r+c].push({r,c,bit:1<<(r-c+n-1)});}));
 function solve(color){
  const rows=diagonals.filter((_,i)=>i%2===color),memo=new Map();
  function dfs(row,used){
   if(row===rows.length)return 0;
   const key=`${row}:${used}`;if(memo.has(key))return memo.get(key);
   let best=dfs(row+1,used);
   for(const cell of rows[row])if(!(used&cell.bit))best=Math.max(best,1+dfs(row+1,used|cell.bit));
   memo.set(key,best);return best;
  }
  const count=dfs(0,0),positions=[];let used=0;
  for(let row=0;row<rows.length;row++){
   const best=dfs(row,used);
   const chosen=rows[row].find(cell=>!(used&cell.bit)&&1+dfs(row+1,used|cell.bit)===best);
   if(chosen){positions.push([chosen.r,chosen.c]);used|=chosen.bit;}
  }
  return {count,positions};
 }
 const black=solve(0),white=solve(1);return {count:black.count+white.count,black:black.count,white:white.count,positions:[...black.positions,...white.positions]};
}
export function towerStages(blocks){
 if(blocks.length>10||blocks.some(h=>!Number.isInteger(h)||h<1||h>100))throw new RangeError('Use up to 10 positive blocks, at most 100 each');
 const limit=Math.floor(blocks.reduce((a,b)=>a+b,0)/2),stages=[new Map([[0,{tall:0,high:[],low:[]} ]])];
 for(const block of blocks){
  const next=new Map(stages.at(-1));
  const update=(difference,state)=>{if(state.tall<=limit&&(!next.has(difference)||next.get(difference).tall<state.tall))next.set(difference,state);};
  for(const [difference,state] of stages.at(-1)){
   update(difference+block,{tall:state.tall+block,high:[...state.high,block],low:state.low});
   update(Math.abs(difference-block),block>difference?{tall:state.tall+block-difference,high:[...state.low,block],low:state.high}:{tall:state.tall,high:state.high,low:[...state.low,block]});
  }
  stages.push(next);
 }
 return stages;
}
export function polygonCounts(n){
 if(!Number.isInteger(n)||n<3||n>30)throw new RangeError('Use 3–30 vertices');
 const triangles=Array(n+1).fill(0n);triangles[2]=1n;
 for(let size=3;size<=n;size++)for(let left=2;left<size;left++)triangles[size]+=triangles[left]*triangles[size+1-left];
 const quadrangles=Array(n+1).fill(0n);quadrangles[2]=1n;
 for(let size=4;size<=n;size+=2)for(let a=1;a<size-1;a+=2)for(let b=a+1;b<size-1;b+=2)quadrangles[size]+=quadrangles[a+1]*quadrangles[b-a+1]*quadrangles[size-b];
 return {triangles,quadrangles};
}
export function modPow(base,exponent,modulus){let result=1n;for(base%=modulus;exponent>0n;exponent>>=1n,base=base*base%modulus)if(exponent&1n)result=result*base%modulus;return result;}
export function factorialComparison(n,p){
 if(!Number.isInteger(n)||!Number.isInteger(p)||n<0||n>=p||p>997||p<2||Array.from({length:Math.max(0,Math.floor(Math.sqrt(p))-1)},(_,i)=>i+2).some(d=>p%d===0))throw new RangeError('Use a prime P ≤ 997 and 0 ≤ N < P');
 const prime=BigInt(p),tail=p-n-1;
 const factorial=count=>{let value=1n;for(let i=2;i<=count;i++)value=value*BigInt(i)%prime;return value;};
 const tailFactorial=factorial(tail),inverse=modPow(tailFactorial,prime-2n,prime),sign=tail%2?1n:prime-1n;
 return {direct:factorial(n),wilson:sign*inverse%prime,tail,tailFactorial,inverse,chosen:n<=tail?'direct':'wilson'};
}
