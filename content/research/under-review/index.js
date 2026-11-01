import metadata from './meta.js?v=20261102-review';
import en from './en.js?v=20261102-review';
import ko from './ko.js?v=20261102-review';
import {renderEntry} from '../../render-entry.js?v=20261031-content-folders';
export default {...metadata,html:{en:renderEntry(metadata,en),ko:renderEntry(metadata,ko)}};
