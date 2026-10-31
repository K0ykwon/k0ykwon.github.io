import {POST_DEMOS} from '../content/posts/demos.js?v=20261031-content-folders';
export const EXTRA_REVIEW_DEMOS=Object.fromEntries(['review-position','review-energy','review-phase','review-mixer'].map(type=>[type,POST_DEMOS[type]]));
