import manifest from '../../assets/cv/manifest.js?v=20261031-cv-footer';
const entry=description=>`<article class="cv-entry" id="about-cv" aria-labelledby="cv-title"><span class="entry-meta">CURRICULUM VITAE</span><h3 id="cv-title">Curriculum vitae</h3><p>${description}</p><div class="cv-downloads"><a href="${manifest.pdf}" download="Youngkwon-Ko-CV.pdf">Download PDF <span aria-hidden="true">↓</span></a><a href="${manifest.source}" download="youngkwon-ko-cv.tex">LaTeX source <span aria-hidden="true">↓</span></a></div></article>`;
export default {
 en:entry('An English CV covering my research, experience and education.'),
 ko:entry('연구·경력·학력을 정리한 영문 CV입니다.')
};
