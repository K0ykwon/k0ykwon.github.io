import metadata from './meta.js?v=20261031-content-folders';
import ko from './ko.js?v=20261031-content-folders';
import en from './en.js?v=20261031-content-folders';
import {readText} from '../../read-text.js?v=20261031-content-folders';
const code=await readText(new URL('./solution.py?v=20261031-content-folders',import.meta.url));
const {sourceText,...fields}=ko;
const post={...metadata,...fields,code};
export {en};
export default post;
