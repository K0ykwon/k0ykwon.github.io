import {renderEvidenceDemo} from './demo.js?v=20261031-research-evidence';
import metadata from './meta.js?v=20261031-content-folders';
import en from './en.js?v=20261031-research-evidence';
import ko from './ko.js?v=20261031-research-evidence';
import {renderEntry} from '../../render-entry.js?v=20261031-content-folders';
export default {...metadata,html:{en:renderEntry(metadata,en).replace('<div data-research-demo="hbr-ie"></div>',renderEvidenceDemo('en')),ko:renderEntry(metadata,ko).replace('<div data-research-demo="hbr-ie"></div>',renderEvidenceDemo('ko'))}};
