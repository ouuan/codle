import { createApp } from 'vue';
import App from './App.vue';
import VueDiff from './VueDiff';

createApp(App).use(VueDiff, { componentName: 'VueDiff' }).mount('#app');
