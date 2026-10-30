import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {queensSolutions,bishopPlacement,towerStages,polygonCounts,factorialComparison} from '../blog/algorithms.js';
import {POSTS} from '../blog/posts.js';

test('All five migrated articles retain their source and downloadable Python code',()=>{
 const original=JSON.parse(readFileSync(new URL('../blog/source/velog-originals.json',import.meta.url)));
 assert.equal(POSTS.length,5);assert.equal(new Set(POSTS.map(p=>p.slug)).size,5);
 for(const post of POSTS){assert.ok(original.posts.some(p=>p.url===post.source));assert.equal(post.published,'2026-04-20');assert.equal(post.code,readFileSync(new URL('../'+post.codePath,import.meta.url),'utf8'));assert.ok(post.sections.length>=4);}
});
test('Queen playground enumerates the known counts and only non-attacking boards',()=>{
 const counts=[1,0,0,2,10,4,40,92];
 for(let n=1;n<=8;n++){const solutions=queensSolutions(n);assert.equal(solutions.length,counts[n-1]);for(const path of solutions){assert.equal(new Set(path).size,n);assert.equal(new Set(path.map((c,r)=>r+c)).size,n);assert.equal(new Set(path.map((c,r)=>r-c)).size,n);}}
});
function bruteBishops(board){
 const cells=[];board.forEach((row,r)=>row.forEach((v,c)=>{if(v)cells.push([r,c]);}));let best=0;
 for(let mask=0;mask<1<<cells.length;mask++){const left=new Set(),right=new Set();let valid=true,count=0;for(let i=0;i<cells.length;i++)if(mask&(1<<i)){const [r,c]=cells[i];if(left.has(r+c)||right.has(r-c)){valid=false;break;}left.add(r+c);right.add(r-c);count++;}if(valid)best=Math.max(best,count);}
 return best;
}
test('Bishop playground matches exhaustive placement on every 3×3 allowed-cell board',()=>{
 for(let mask=0;mask<512;mask++){const board=Array.from({length:3},(_,r)=>Array.from({length:3},(_,c)=>(mask>>(r*3+c))&1));const answer=bishopPlacement(board);assert.equal(answer.count,bruteBishops(board));assert.equal(answer.positions.length,answer.count);assert.equal(new Set(answer.positions.map(([r,c])=>r+c)).size,answer.count);assert.equal(new Set(answer.positions.map(([r,c])=>r-c)).size,answer.count);for(const [r,c] of answer.positions)assert.equal(board[r][c],1);}
});
function bruteTowers(blocks){let answer=0;function dfs(i,a,b){if(i===blocks.length){if(a===b)answer=Math.max(answer,a);return;}dfs(i+1,a,b);dfs(i+1,a+blocks[i],b);dfs(i+1,a,b+blocks[i]);}dfs(0,0,0);return answer;}
test('Tower state merging and pruning agree with the full three-choice search',()=>{
 let seed=17;for(let trial=0;trial<30;trial++){const blocks=Array.from({length:1+trial%7},()=>{seed=seed*16807%2147483647;return 1+seed%9;});const stages=towerStages(blocks),last=stages.at(-1);assert.equal(last.get(0).tall,bruteTowers(blocks));for(const states of stages)for(const [d,s] of states){assert.equal(s.high.reduce((a,b)=>a+b,0),s.tall);assert.equal(s.high.reduce((a,b)=>a+b,0)-s.low.reduce((a,b)=>a+b,0),d);}}
});
function choose(n,k){let answer=1n;for(let i=1;i<=k;i++)answer=answer*BigInt(n-k+i)/BigInt(i);return answer;}
test('Polygon playground matches Catalan and quadrangulation closed forms',()=>{
 for(let n=3;n<=24;n++){const result=polygonCounts(n),k=n-2;assert.equal(result.triangles[n],choose(2*k,k)/BigInt(k+1));const m=(n-2)/2;assert.equal(result.quadrangles[n],n%2?0n:choose(3*m,m)/BigInt(2*m+1));}
});
test('Both factorial paths agree for all residues of the demo primes, including zero',()=>{
 for(const p of [2,3,5,7,11,17,31,97]){let expected=1n;for(let n=0;n<p;n++){if(n)expected=expected*BigInt(n)%BigInt(p);const answer=factorialComparison(n,p);assert.equal(answer.direct,expected);assert.equal(answer.wilson,expected);}}
 assert.throws(()=>factorialComparison(3,9),RangeError);
});
test('The actual downloadable Python solutions pass independent oracle checks',()=>{
 const result=spawnSync('python',['tests/blog_code_checks.py'],{cwd:new URL('..',import.meta.url),encoding:'utf8',timeout:30000});assert.equal(result.status,0,result.stderr||result.stdout);assert.match(result.stdout,/Python solution checks passed/);
});
