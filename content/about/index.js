import metadata from './meta.js?v=20261031-content-folders';
import en from './en.js?v=20261031-cv-footer';
import ko from './ko.js?v=20261031-cv-footer';
import cv from './cv.js?v=20261031-cv-footer';
import experiences from '../experience/index.js?v=20261031-content-folders';
import awards from '../awards/index.js?v=20261031-content-folders';
export default function about(language){const copy={en,ko}[language];return {...metadata,intro:metadata.intro[language],body:`<div data-content-localized>${copy.beforeCareer}<div id="about-experience" class="experience-overview"><section class="career-section" aria-labelledby="career-title"><div class="experience-section-heading"><span class="entry-meta">01 / CAREER</span><h2 id="career-title">Research &amp; professional experience</h2></div><ol class="career-timeline">${experiences.map(entry=>entry.html[language]).join('')}</ol></section><aside class="honors-section" aria-labelledby="honors-title"><div class="experience-section-heading"><span class="entry-meta">02 / RECOGNITION</span><h2 id="honors-title">Awards &amp; honors</h2></div>${awards.map(entry=>entry.html[language]).join('')}</aside></div>${copy.afterCareer}${cv[language]}</div>`};}
