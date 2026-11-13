import metadata from './meta.js?v=20261113-desk-documents';
import en from './en.js?v=20261113-content-review';
import ko from './ko.js?v=20261113-content-review';
export default function software(language){return {...metadata,intro:metadata.intro[language],body:`<div data-content-localized>${{en,ko}[language]}</div>`};}
