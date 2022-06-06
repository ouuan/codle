import { createApp } from 'vue';

import VueDiff from 'vue-diff';
import cpp from 'highlight.js/lib/languages/cpp';
import 'vue-diff/dist/index.css';

import App from './App.vue';

VueDiff.hljs.registerLanguage('cpp', cpp);

createApp(App).mount('#app');
