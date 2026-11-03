import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mindmap,neighborhood,connectionLayout,NODE_WIDTH,NODE_HEIGHT} from '../apps/p2imap/layout.js';
const graph=JSON.parse(readFileSync(new URL('../apps/p2imap/catalog.json',import.meta.url)));
function valid(layout){
 const keys=new Set(layout.items.map(n=>n.key));assert.equal(keys.size,layout.items.length);
 for(const item of layout.items){assert.ok(Number.isFinite(item.x)&&Number.isFinite(item.y));assert.ok(item.x>=NODE_WIDTH/2&&item.y>=NODE_HEIGHT/2);}
 for(let i=0;i<layout.items.length;i++)for(let j=i+1;j<layout.items.length;j++){
  const a=layout.items[i],b=layout.items[j];assert.ok(Math.abs(a.x-b.x)>=NODE_WIDTH||Math.abs(a.y-b.y)>=NODE_HEIGHT,`${a.key} overlaps ${b.key}`);
 }
 for(const edge of [...layout.edges,...layout.branches]){assert.ok(keys.has(edge.source));assert.ok(keys.has(edge.target));}
}
test('all catalog models appear once, stable tidy trees, including every new family',()=>{
 const layout=mindmap(graph);valid(layout);assert.equal(layout.modelCount,graph.nodes.filter(n=>n.kind==='model').length);
 assert.deepEqual(layout.items.filter(n=>n.node.kind==='model').map(n=>n.node.id).sort(),graph.nodes.filter(n=>n.kind==='model').map(n=>n.id).sort());
 assert.deepEqual(mindmap(graph),layout);
 for(const family of new Set(graph.nodes.filter(n=>n.kind==='model').map(n=>n.family))){const filtered=mindmap(graph,family);valid(filtered);assert.ok(filtered.items.filter(n=>n.node.kind==='model').every(n=>n.node.family===family));}
});
test('dependency view: referenced foundations on left, users and extensions on right',()=>{
 for(const node of graph.nodes){const result=neighborhood(graph,node.id),layout=connectionLayout(result,node.id);valid(layout);
  const points=new Map(layout.items.map(n=>[n.key,n]));assert.equal(layout.edges.length,result.edges.length);
  for(const {edge,source,target}of layout.edges){if(edge.source===edge.target)continue;
   if(edge.target===node.id)assert.ok(points.get(source).x>points.get(target).x);
   if(edge.source===node.id)assert.ok(points.get(source).x>points.get(target).x);
  }
 }
});
test('all 2-hop neighbors and induced edges survive, including mixed direction paths',()=>{
 for(const node of graph.nodes){const result=neighborhood(graph,node.id,2),layout=connectionLayout(result,node.id);valid(layout);
  assert.deepEqual(new Set(layout.items.map(n=>n.node.id)),new Set(result.nodes.map(n=>n.id)));assert.equal(layout.edges.length,result.edges.length);
 }
});
test('high-degree hubs have no 40 or 200 node cap; reciprocal relationships use both sides',()=>{
 const nodes=[{id:'hub',kind:'concept',label:'Hub'},...Array.from({length:260},(_,i)=>({id:'n'+i,kind:'model',family:'new-family',label:'Node '+i}))];
 const edges=nodes.slice(1).map(n=>({source:n.id,target:'hub',relation:'uses'}));edges.push({source:'hub',target:'n0',relation:'uses'});
 const result=neighborhood({nodes,edges},'hub'),layout=connectionLayout(result,'hub');valid(layout);
 assert.equal(result.nodes.length,261);assert.equal(layout.edges.length,261);assert.equal(layout.items.filter(n=>n.node.id==='n0').length,2);
});
test('relation filter, isolated nodes, cyclic models and empty family remain valid',()=>{
 const node=graph.nodes.find(n=>n.kind==='model');const result=neighborhood(graph,node.id,2,'documented_in');assert.ok(result.edges.every(e=>e.relation==='documented_in'));valid(connectionLayout(result,node.id));valid(mindmap(graph,'missing'));
 const cycle={nodes:[{id:'a',kind:'model',family:'x',label:'A',reference_year:1},{id:'b',kind:'model',family:'x',label:'B',reference_year:1}],edges:[{source:'a',target:'b',relation:'extends'},{source:'b',target:'a',relation:'extends'}]};valid(mindmap(cycle));valid(connectionLayout(neighborhood(cycle,'a',2),'a'));
});
