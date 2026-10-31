import about from './about/index.js?v=20261031-content-folders';
import research from './research/page.js?v=20261031-content-folders';
import software from './software/index.js?v=20261031-content-folders';
import contact from './contact/index.js?v=20261031-content-folders';
import blog from './posts/page.js?v=20261031-content-folders';
const sections={about,research,software,contact,blog:language=>({...blog,intro:blog.intro[language],body:''})};
export const hasSection=key=>Object.hasOwn(sections,key);
export const getSection=(key,language='en')=>sections[key]?.(language==='ko'?'ko':'en');
