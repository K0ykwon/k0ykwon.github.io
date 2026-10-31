import {POST_DEMOS} from '../content/posts/demos.js?v=20261031-content-folders';
export function mountDemo(root,type,signal){const mount=POST_DEMOS[type];if(!mount)throw new Error(`Unknown post demo: ${type}`);return mount(root,signal);}
