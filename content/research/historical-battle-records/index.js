import metadata from './meta.js?v=20261031-content-folders';
import en from './en.js?v=20261113-content-review';
import ko from './ko.js?v=20261113-content-review';
import article from './article.js?v=20261113-content-review';
import {renderEntry} from '../../render-entry.js?v=20261031-content-folders';
export default {...metadata,article,html:{en:renderEntry(metadata,en),ko:renderEntry(metadata,ko)}};
