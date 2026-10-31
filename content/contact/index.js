import metadata from './meta.js?v=20261031-content-folders';
import en from './en.js?v=20261031-content-folders';
import ko from './ko.js?v=20261031-content-folders';
export default function contact(language){return {...metadata,intro:metadata.intro[language],body:`<div data-content-localized>${{en,ko}[language]}</div>`};}
