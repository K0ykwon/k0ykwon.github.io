import metadata from './meta.js?v=20261031-content-folders';
import en from './en.js?v=20261031-research-evidence';
import ko from './ko.js?v=20261031-research-evidence';
import {renderEntry} from '../../render-entry.js?v=20261031-content-folders';
export default {...metadata,html:{en:renderEntry(metadata,en),ko:renderEntry(metadata,ko)}};
