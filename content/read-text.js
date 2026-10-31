// Read the same canonical source in the browser and in Node validation.
export async function readText(url){
 if(url.protocol==='file:'){const {readFile}=await import('node:fs/promises');return readFile(url,'utf8');}
 const response=await fetch(url);if(!response.ok)throw new Error(`Unable to load ${url.pathname}: ${response.status}`);return response.text();
}
