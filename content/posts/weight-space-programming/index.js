import metadata from './meta.js';
import ko from './ko.js';
import en from './en.js';
const {sourceText,...fields}=ko;
export {en};
export default {...metadata,...fields,sources:metadata.sources.map((source,index)=>({...source,...sourceText[index]}))};
