import metadata from './meta.js?v=20261113-desk-documents';
import ko from './ko.js?v=20261113-desk-documents';
import en from './en.js?v=20261113-desk-documents';
const {sourceText,...fields}=ko;
const post={...metadata,...fields,sources:metadata.sources?.map((source,index)=>({...source,...sourceText?.[index]}))};
export {en};
export default post;
