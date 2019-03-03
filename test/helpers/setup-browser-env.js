import browserEnv from 'browser-env';
browserEnv(['window', 'document', 'navigator']);
global.URL = window.URL;
import browserFake from 'webextensions-api-fake';
global.browser = browserFake();
