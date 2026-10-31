import metadata from './meta.js?v=20261031-content-folders';
import ko from './ko.js?v=20261031-content-folders';
import en from './en.js?v=20261031-content-folders';
const {sourceText,...fields}=ko;
const post={...metadata,...fields,sources:metadata.sources?.map((source,index)=>({...source,...sourceText?.[index]}))};
export {en};
export default post;
