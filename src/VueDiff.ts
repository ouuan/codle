import VueDiff from 'vue-diff';

import 'vue-diff/dist/index.css';

import cpp from 'highlight.js/lib/languages/cpp';

VueDiff.hljs.registerLanguage('cpp', cpp);

export default VueDiff;
